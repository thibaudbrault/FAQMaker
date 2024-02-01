import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@prisma/client';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { HelpCircle, MoveRight } from 'lucide-react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { BackButton, Button, Field, Input } from '@/components';
import { useCreateNode, useIntegration, useMediaQuery, useTags } from '@/hooks';
import { PageLayout } from '@/layouts';
import {
  getIntegration,
  getMe,
  getTags,
  questionClientSchema,
  ssrNcHandler,
} from '@/lib';
import { TagsList } from '@/modules';
import { UserWithTenant } from '@/types';
import { QueryKeys, Redirects } from '@/utils';

type Props = {
  me: UserWithTenant;
};

type Schema = z.infer<typeof questionClientSchema>;

function New({ me }: Props) {
  const [disabled, setDisabled] = useState<boolean>(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const isDesktop = useMediaQuery('(min-width: 640px)');
  const withAnswer = true;

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
  const { data: integrations } = useIntegration(me.tenantId);
  const { mutate, isError, error } = useCreateNode(
    me,
    router,
    selectedTags,
    integrations,
  );

  const onSubmit: SubmitHandler<Schema> = (values) => {
    mutate(values);
  };

  const onSubmitWithAnswer: SubmitHandler<Schema> = (data) => {
    const values = { ...data, withAnswer };
    mutate(values);
  };

  useEffect(() => {
    setDisabled(isSubmitting || !isValid);
  }, [isSubmitting, isValid]);

  return (
    <PageLayout id={me.id} company={me.tenant.company} tenantId={me.tenantId}>
      <section className="mx-auto flex w-11/12 flex-col gap-4 md:w-3/4">
        <BackButton />
        <div className="flex flex-col gap-4 rounded-md bg-default p-4">
          <form className="flex flex-col items-center gap-4">
            <fieldset className="mx-auto flex w-11/12 flex-col gap-4 [&_svg]:focus-within:text-secondary">
              <div className="w-full text-center">
                <legend
                  className="font-serif text-3xl font-semibold lowercase md:text-4xl"
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
                  withIcon={isDesktop}
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
            <div className="flex items-center justify-center gap-4">
              <Button
                variant={disabled ? 'disabled' : 'primary'}
                weight="semibold"
                className="lowercase"
                style={{ fontVariant: 'small-caps' }}
                disabled={disabled}
                onClick={handleSubmit(onSubmit)}
              >
                Submit
              </Button>
              <Button
                variant={disabled ? 'disabled' : 'negative'}
                icon="withIcon"
                weight="semibold"
                className="lowercase"
                style={{ fontVariant: 'small-caps' }}
                disabled={disabled}
                onClick={handleSubmit(onSubmitWithAnswer)}
              >
                Answer
                <MoveRight className="h-5 w-5" />
              </Button>
            </div>
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
  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.INTEGRATION, me.tenantId],
    queryFn: () => getIntegration(me.tenantId),
  });

  return {
    props: {
      me: JSON.parse(JSON.stringify(me)),
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};
