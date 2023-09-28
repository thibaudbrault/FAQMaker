import { useEffect, useState } from 'react';

import { Question, Tenant } from '@prisma/client';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { HelpCircle, MoveLeft } from 'lucide-react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import { Button, Field, Input, Label, errorToast } from '@/components';
import { useCreateNode, useTags } from '@/hooks';
import { PageLayout } from '@/layouts';
import { getMe, getTags, ssrNcHandler } from '@/lib';
import { TagsList } from '@/modules';
import { ClientUser } from '@/types';
import { QueryKeys, Redirects } from '@/utils';
import { AxiosError } from 'axios';

type Props = {
  me: ClientUser & { tenant: Tenant };
};

function New({ me }: Props) {
  const [disabled, setDisabled] = useState<boolean>(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, isValid },
  } = useForm();
  const router = useRouter();

  const { data: tags, isLoading } = useTags(me.tenantId);
  const { mutate, isError, error } = useCreateNode(me, router, selectedTags);

  const onSubmit = (values: Question) => {
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
    <PageLayout id={me.id} company={me.tenant.company}>
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
        <div className="flex flex-col gap-4 rounded-md bg-stone-100 p-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center gap-4"
          >
            <fieldset className="mx-auto flex w-11/12 flex-col gap-4 [&_svg]:focus-within:text-teal-700">
              <div className="w-full text-center">
                <legend
                  className="font-serif text-4xl font-semibold lowercase"
                  style={{ fontVariant: 'small-caps' }}
                >
                  Ask a question
                </legend>
              </div>
              <Field label="Question" value="text" error={errors?.text}>
                <Input
                  {...register('text', { required: true, minLength: 3 })}
                  withIcon
                  icon={<HelpCircle />}
                  type="text"
                  id="question"
                  placeholder="New question"
                  className="w-full rounded-md border border-transparent py-1 outline-none focus:border-teal-700"
                />
              </Field>
              <TagsList
                isLoading={isLoading}
                tags={tags}
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
              />
            </fieldset>
            <Button
              variant={disabled ? 'disabledDark' : 'primaryDark'}
              weight="semibold"
              className="lowercase"
              style={{ fontVariant: 'small-caps' }}
              disabled={disabled}
            >
              Submit
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
  const me = await ssrNcHandler<ClientUser | null>(req, res, callbackMe);

  if (!me) return Redirects.LOGIN;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([QueryKeys.ME, me.id], () => me);
  await queryClient.prefetchQuery([QueryKeys.TAGS, me.tenantId], () =>
    getTags(me.tenantId),
  );

  return {
    props: {
      me: JSON.parse(JSON.stringify(me)),
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};
