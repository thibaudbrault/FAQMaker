import { Colors } from './Colors';

type Props = {
  nodes: number;
};

export const General = ({ nodes }: Props) => {
  return (
    <>
      <section className="flex flex-col gap-4 w-3/4 mx-auto bg-stone-100 rounded-md p-4 mb-4">
        <Colors />
      </section>
      <section></section>
    </>
  );
};
