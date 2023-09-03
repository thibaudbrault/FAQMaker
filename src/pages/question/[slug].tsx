import { PageLayout } from '@/layouts';
import { getMe, getNode, ssrNcHandler } from '@/lib';
import { ClientUser } from '@/types';
import { Redirects, QueryKeys } from '@/utils';
import { Tenant, User } from '@prisma/client';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

type Props = {
  me: User & { tenant: Tenant };
};

function Question({ me }: Props) {
  const router = useRouter();
  return (
    <PageLayout id={me.id} company={me.tenant.company}>
      <p>
        Question: {router.query.slug} {router.query.id}
      </p>
    </PageLayout>
  );
}

export default Question;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
}) => {
  console.log(params);
  const callbackMe = async () => await getMe({ req });
  const me = await ssrNcHandler<ClientUser | null>(req, res, callbackMe);

  if (!me) return Redirects.LOGIN;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([QueryKeys.ME, me.id], () => me);
  // await queryClient.prefetchQuery([QueryKeys.NODES, me.tenantId], () =>
  //   getNode(me.tenantId),
  // );

  return {
    props: {
      me: JSON.parse(JSON.stringify(me)),
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};
