import { Layout, List, Search } from "@/modules";
import { Tenant, User } from "@prisma/client";
import { prisma } from "lib/prisma";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

function Home(props: User & { tenant: Tenant }) {
  return (
    <Layout email={props.email} company={props.tenant.company}>
      <div className="my-12">
        <Search />
        <List tenantId={props.tenantId} />
      </div>
    </Layout>
  );
}

export default Home;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: `/`,
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
