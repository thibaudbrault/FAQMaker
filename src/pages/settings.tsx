import { General, Layout, Users } from "@/modules";
import { Tenant, User } from "@prisma/client";
import { prisma } from "lib/prisma";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import {
  Card,
  Grid,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@tremor/react";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { getNodes } from "@/data";
import { useNodes } from "@/hooks";

type Props = {
  user: User & { tenant: Tenant };
};

function Settings({ user }: Props) {
  const { data: nodes, isLoading, isError, error } = useNodes(user.tenantId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError && error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Layout email={user.email} company={user.tenant.company}>
      <section className="flex flex-col items-center p-4">
        <h2 className="font-serif text-3xl">Settings</h2>
        <TabGroup className="mt-6">
          <TabList variant="solid" className="w-full">
            <Tab>General</Tab>
            <Tab>Users</Tab>
          </TabList>
          <TabPanels>
            <General nodes={nodes} />
            <Users tenantId={user.tenantId} />
          </TabPanels>
        </TabGroup>
      </section>
    </Layout>
  );
}

export default Settings;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: `/login`,
        permanent: false,
      },
    };
  }

  const email =
    typeof session.user?.email === `string` ? session.user?.email : undefined;

  const user = await prisma.user.findUnique({
    where: { email },
    include: { tenant: { select: { company: true } } },
  });

  if (user.role !== "Admin") {
    return {
      redirect: {
        destination: `/`,
        permanent: false,
      },
    };
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["nodes", user.tenantId], () =>
    getNodes(user.tenantId)
  );

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
      dehydratedState: dehydrate(queryClient),
    },
  };
}
