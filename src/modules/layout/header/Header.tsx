import { Link, Tooltip, TooltipContent, TooltipTrigger } from "@/components";
import { useUser } from "@/hooks";
import { cn } from "@/utils/cn";
import { LogOut, Settings, User as UserIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import { CreateQuestion } from "../../question";

type Props = {
  email?: string;
  company?: string;
};

export const Header = ({ email, company }: Props) => {
  const { data: user, isLoading } = useUser(email);

  const tooltipClass = "bg-teal-800 text-stone-200 border border-stone-200";

  return (
    <header className="flex justify-between items-center px-8 py-4 bg-teal-700 text-stone-200">
      <h1>
        <Link href="/" className="text-4xl font-serif">
          {company}
        </Link>
      </h1>
      {user && (
        <div className="flex gap-4 items-baseline">
          {!isLoading && (
            <ul className="flex gap-4">
              <li>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      decoration="none"
                      href="/profile"
                      className="flex items-center gap-1 hover:text-stone-300"
                    >
                      <UserIcon />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent className={cn(tooltipClass)}>
                    <p>Profile</p>
                  </TooltipContent>
                </Tooltip>
              </li>
              {user?.role === "Admin" && (
                <li>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        decoration="none"
                        href="/settings"
                        className="hover:text-stone-300"
                      >
                        <Settings />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent className={cn(tooltipClass)}>
                      <p>Settings</p>
                    </TooltipContent>
                  </Tooltip>
                </li>
              )}
              <li>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => signOut()}
                      className="hover:text-stone-300"
                    >
                      <LogOut />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className={cn(tooltipClass)}>
                    <p>Logout</p>
                  </TooltipContent>
                </Tooltip>
              </li>
            </ul>
          )}
          <CreateQuestion user={user} />
        </div>
      )}
    </header>
  );
};
