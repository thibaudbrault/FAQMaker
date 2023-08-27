import { Input, Label } from "@/components";
import { SearchIcon } from "lucide-react";

export const Search = () => {
  return (
    <section className="w-full flex justify-center">
      <div className="flex flex-col w-fit gap-1">
        <Label
          htmlFor="search"
          className="lowercase"
          style={{ fontVariant: "small-caps" }}
        >
          Search
        </Label>
        <Input
          withIcon
          icon={<SearchIcon />}
          type="text"
          id="search"
          placeholder="Search"
          className="bg-stone-100 rounded-md py-1 w-80 border border-stone-200 focus:border-stone-900 outline-none"
        />
      </div>
    </section>
  );
};
