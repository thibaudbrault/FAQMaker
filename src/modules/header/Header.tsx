import { Link } from "@/components";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { CreateQuestion } from "../question";
import { getUser } from "@/data";

export const Header = () => {
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUser,
  });

  console.log(user);

  const title = "Company";

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error}</div>;
  }

  return (
    <header className="flex justify-between items-center px-8 py-4 bg-stone-900 text-stone-200">
      <h1>
        <Link href="/" className="text-4xl font-serif">
          {title}
        </Link>
      </h1>
      <div className="flex gap-4 items-baseline">
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
        <CreateQuestion />
      </div>
    </header>
  );
};
