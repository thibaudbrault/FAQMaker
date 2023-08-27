import { Link } from "@/components";
import React, { useMemo } from "react";

export const Header = () => {
  const title = "Company";

  const navLinks = useMemo(
    () => [
      {
        name: "Profile",
        link: "/profile",
      },
      {
        name: "Admin",
        link: "/admin",
      },
    ],
    []
  );

  return (
    <header className="flex justify-between items-center px-8 py-4 bg-stone-300">
      <h1>
        <Link href="/" className="text-3xl">
          {title}
        </Link>
      </h1>
      <ul className="flex gap-4">
        {navLinks.map((nav, i) => (
          <li key={i}>
            <Link decoration="underline" href={nav.link}>
              {nav.name}
            </Link>
          </li>
        ))}
      </ul>
    </header>
  );
};
