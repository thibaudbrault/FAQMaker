import { Footer, Header, List, Search } from "@/modules";
import { prisma } from "lib/prisma";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

function Home(props) {
  return (
    <>
      <Header email={props.email} />
      <div className="my-12">
        <Search />
        <List tenantId={props.tenantId} />
      </div>
      <Footer />
    </>
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
  });

  return {
    props: JSON.parse(JSON.stringify(user)),
  };
}
