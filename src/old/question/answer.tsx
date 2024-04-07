import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@prisma/client';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/navigation';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { BackButton, Button, Editor, Loader } from '@/components';
import { useCreateAnswer, useNode, useUpdateAnswer } from '@/hooks';
import { answerClientSchema, getMe, getNode, ssrNcHandler } from '@/lib';
import { UserWithTenant } from '@/types';
import { Limits, QueryKeys, Redirects } from '@/utils';

type Props = {
  me: UserWithTenant;
  id: string;
};

type Schema = z.infer<typeof answerClientSchema>;

function Answer({ me, id }: Props) {
  const [disabled, setDisabled] = useState<boolean>(true);

  const { data: node, isPending } = useNode(me.tenantId, id as string);

  const {
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting, errors, isValid, isDirty },
  } = useForm<Schema>({
    resolver: zodResolver(answerClientSchema),
    mode: 'onBlur',
    defaultValues: {
      text: node?.answer?.text ?? '',
    },
  });

  const router = useRouter();
  const text = watch('text');

  const { mutate: createAnswer } = useCreateAnswer(
    id,
    me.id,
    me.tenantId,
    router,
  );

  const { mutate: updateAnswer } = useUpdateAnswer(
    me.id,
    me.tenantId,
    router,
    node?.answer?.id,
  );

  const onSubmit: SubmitHandler<Schema> = (values) => {
    if (node?.answer) {
      updateAnswer(values);
    } else {
      createAnswer(values);
    }
  };

  useEffect(() => {
    setDisabled(isSubmitting || !isValid || !isDirty);
  }, [isSubmitting, isValid, isDirty]);

  return isPending ? (
    <Loader size="screen" />
  ) : (
    <section className="mx-auto flex w-11/12 flex-col gap-4 md:w-3/4">
      <BackButton />
      <div className="flex flex-col gap-4 rounded-md bg-gray-3 p-4">
        <h2
          className="text-center font-serif text-3xl font-semibold lowercase md:text-4xl"
          style={{ fontVariant: 'small-caps' }}
        >
          {node.answer ? 'Edit the answer' : 'Answer'}
        </h2>
        <form
          className="flex flex-col items-center justify-center gap-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex w-full flex-col justify-start gap-px">
            <p className="text-sm">
              Question: <b>{node.question.text}</b>
            </p>
            <Controller
              control={control}
              name="text"
              render={({ field: { onChange, value } }) => (
                <Editor value={value} onChange={onChange} />
              )}
            />
            <div className="grid grid-cols-2 gap-2">
              {errors.text && (
                <small className="col-start-1 justify-self-start text-sm text-red-9">
                  {errors.text.message}
                </small>
              )}
              <small className="col-start-2 justify-self-end text-xs text-gray-11">
                {text.length} / {Limits.ANSWER}
              </small>
            </div>
          </div>
          <Button
            variant={disabled ? 'disabled' : 'primary'}
            type="submit"
            weight="semibold"
            className="lowercase"
            disabled={disabled}
            style={{ fontVariant: 'small-caps' }}
          >
            {node.answer ? 'Update' : 'Submit'}
          </Button>
        </form>
      </div>
    </section>
  );
}

export default Answer;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const { id } = query;
  const callbackMe = async () => await getMe({ req });
  const me = await ssrNcHandler<User | null>(req, res, callbackMe);

  if (!me) return Redirects.LOGIN;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.ME, me.id],
    queryFn: () => me,
  });
  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.NODE, me.tenantId, id],
    queryFn: () => getNode(me.tenantId, id as string),
  });

  return {
    props: {
      id,
      me: JSON.parse(JSON.stringify(me)),
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};
