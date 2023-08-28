import { Link } from "@/components";
import { getUser } from "@/data";
import { User } from "@prisma/client";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { CreateQuestion } from "../question";

export const Header = ({ email }) => {
  const {
    data: user,
    isLoading,
    isError,
    error,
  }: UseQueryResult<User, Error> = useQuery({
    queryKey: ["users"],
    queryFn: () => getUser(email),
  });

  const title = "Company";

  if (isError && error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <header className="flex justify-between items-center px-8 py-4 bg-stone-900 text-stone-200">
      <h1>
        <Link href="/" className="text-4xl font-serif">
          {title}
        </Link>
      </h1>
      <div className="flex gap-4 items-baseline">
        {!isLoading && (
          <ul className="flex gap-4">
            <li>
              <Link decoration="underline" href="/profile">
                Profile
              </Link>
            </li>
            {user.role === "Admin" && (
              <li>
                <Link decoration="underline" href="/admin">
                  Admin
                </Link>
              </li>
            )}
          </ul>
        )}
        <CreateQuestion user={user} />
      </div>
    </header>
  );
};
