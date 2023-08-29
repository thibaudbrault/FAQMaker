import { Layout, List, Search } from "@/modules";
import { Tenant } from "@prisma/client";
import { prisma } from "lib/prisma";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

type Props = {
  email: string;
  tenant: Tenant;
  tenantId: string;
};

function Home({ email, tenant, tenantId }: Props) {
  return (
    <main className="bg-stone-200 h-screen">
      <Layout email={email} company={tenant.company}>
        <div className="my-12">
          <Search />
          <List tenantId={tenantId} />
        </div>
      </Layout>
    </main>
  );
}

export default Home;

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

  return {
    props: JSON.parse(JSON.stringify(user)),
  };
}
