import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Question, User } from '@prisma/client';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { HelpCircle, MoveLeft } from 'lucide-react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button, errorToast, Field, Input, Loader } from '@/components';
import { useCreateNode, useTags } from '@/hooks';
import { PageLayout } from '@/layouts';
import { getMe, getTags, questionClientSchema, ssrNcHandler } from '@/lib';
import { TagsList } from '@/modules';
import { UserWithTenant } from '@/types';
import { cn, QueryKeys, Redirects } from '@/utils';

type Props = {
  me: UserWithTenant;
};

type Schema = z.infer<typeof questionClientSchema>;

function New({ me }: Props) {
  const [disabled, setDisabled] = useState<boolean>(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, isValid },
  } = useForm<Schema>({
    resolver: zodResolver(questionClientSchema),
    mode: 'onBlur',
    defaultValues: {
      text: '',
    },
  });
  const router = useRouter();

  const { data: tags, isPending } = useTags(me.tenantId);
  const { mutate, isError, error } = useCreateNode(me, router, selectedTags);

  const onSubmit: SubmitHandler<Schema> = (values) => {
    mutate(values);
  };

  if (isError && error instanceof AxiosError) {
    const errorMessage = error.response?.data.message || 'An error occurred';
    errorToast(errorMessage);
  }

  useEffect(() => {
    setDisabled(isSubmitting || !isValid);
  }, [isSubmitting, isValid]);

  return (
    <PageLayout id={me.id} company={me.tenant.company} tenantId={me.tenantId}>
      <section className="mx-auto flex w-3/4 flex-col gap-4">
        <Button
          variant="primaryDark"
          weight="semibold"
          icon="withIcon"
          font="large"
          asChild
          className="lowercase"
          style={{ fontVariant: 'small-caps' }}
        >
          <Link href="/">
            <MoveLeft />
            Go back
          </Link>
        </Button>
        <div className="flex flex-col gap-4 rounded-md bg-default p-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center gap-4"
          >
            <fieldset className="mx-auto flex w-11/12 flex-col gap-4 [&_svg]:focus-within:text-secondary">
              <div className="w-full text-center">
                <legend
                  className="font-serif text-4xl font-semibold lowercase"
                  style={{ fontVariant: 'small-caps' }}
                >
                  Ask a question
                </legend>
              </div>
              <Field
                label="Question"
                value="text"
                error={errors?.text?.message}
              >
                <Input
                  {...register('text')}
                  withIcon
                  icon={<HelpCircle />}
                  type="text"
                  id="question"
                  placeholder="New question"
                  className="w-full rounded-md border border-transparent py-1 outline-none focus:border-secondary"
                />
              </Field>
              <TagsList
                isPending={isPending}
                tags={tags}
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
              />
            </fieldset>
            <Button
              variant={disabled ? 'disabled' : 'primaryDark'}
              weight="semibold"
              className={cn(
                'lowercase',
                `${isSubmitting && 'flex items-center justify-center gap-2'}`,
              )}
              style={{ fontVariant: 'small-caps' }}
              disabled={disabled}
            >
              {isSubmitting ? (
                <>
                  <Loader size="items" border="thin" color="border-negative" />
                  <p>Submitting</p>
                </>
              ) : (
                'Submit'
              )}
            </Button>
          </form>
          <div className="justify-start text-center text-xs">
            <p>
              {disabled
                ? 'The question must have 3 or more letters'
                : "You're good to post"}
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

export default New;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const callbackMe = async () => await getMe({ req });
  const me = await ssrNcHandler<User | null>(req, res, callbackMe);

  if (!me) return Redirects.LOGIN;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.ME, me.id],
    queryFn: () => me,
  });
  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.TAGS, me.tenantId],
    queryFn: () => getTags(me.tenantId),
  });

  return {
    props: {
      me: JSON.parse(JSON.stringify(me)),
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};
