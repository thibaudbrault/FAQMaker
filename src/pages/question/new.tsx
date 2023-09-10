import { useEffect, useState } from 'react';

import { Question, Tenant } from '@prisma/client';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { HelpCircle, MoveLeft } from 'lucide-react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import { Button, Input, Label, errorToast } from '@/components';
import { useCreateNode, useTags } from '@/hooks';
import { PageLayout } from '@/layouts';
import { getMe, getNode, ssrNcHandler } from '@/lib';
import { ClientUser } from '@/types';
import { QueryKeys, Redirects } from '@/utils';

type Props = {
  me: ClientUser & { tenant: Tenant };
};

function New({ me }: Props) {
  const [disabled, setDisabled] = useState<boolean>(true);
  const [selectedTags, setSelectedTags] = useState<String[]>([]);

  const { register, handleSubmit, watch } = useForm();
  const router = useRouter();

  const { data: tags, isLoading: tagsLoading } = useTags(me.tenantId);
  const { mutate, isLoading, isError, error } = useCreateNode(
    me,
    router,
    selectedTags,
  );

  const onSubmit = (values: Question) => {
    mutate(values);
  };

  if (isError && error instanceof Error) {
    errorToast(error.message);
  }

  const questionText = watch('text', '');

  useEffect(() => {
    setDisabled(isLoading || questionText.length < 3);
  }, [isLoading, questionText]);

  return (
    <PageLayout id={me.id} company={me.tenant.company}>
      <section className="flex flex-col gap-4 w-3/4 mx-auto">
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
        <div className="flex flex-col bg-stone-100 rounded-md p-4 gap-4">
          <h2
            className="text-4xl text-center font-serif font-semibold lowercase"
            style={{ fontVariant: 'small-caps' }}
          >
            Ask a question
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center gap-2 [&_svg]:focus-within:text-teal-700"
          >
            <div className="flex flex-col gap-1 w-11/12 mx-auto">
              <Label
                htmlFor="question"
                className="lowercase"
                style={{ fontVariant: 'small-caps' }}
              >
                Question
              </Label>
              <Input
                {...register('text', { required: true, min: 3 })}
                withIcon
                icon={<HelpCircle />}
                type="text"
                id="question"
                placeholder="New question"
                className="w-full border border-transparent outline-none rounded-md py-1 focus:border-teal-700"
              />
            </div>
            <Button
              variant={disabled ? 'disabledDark' : 'primaryDark'}
              type="submit"
              disabled={disabled}
            >
              Submit
            </Button>
          </form>
          <div className="text-xs justify-start text-center">
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

  return {
    props: {
      me: JSON.parse(JSON.stringify(me)),
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};
