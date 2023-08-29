import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
} from "@/components";
import { getNodes } from "@/data";
import { useQuery } from "@tanstack/react-query";

import { CreateAnswer } from "../answer";

type Props = {
  tenantId: string;
};

export const List = ({ tenantId }: Props) => {
  const {
    data: nodes,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["nodes", tenantId],
    queryFn: () => getNodes(tenantId),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError && error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <section className="mt-6">
      <Accordion type="multiple" className="w-3/4 mx-auto flex flex-col gap-6">
        {nodes.map((node) => (
          <AccordionItem
            key={node.id}
            value={node.id.toString()}
            className="bg-stone-100 border border-stone-900 rounded-md px-6"
          >
            <AccordionTrigger>
              <div className="flex flex-col items-start gap-4">
                <h2 className="font-semibold text-2xl">{node.question.text}</h2>
                <ul className="flex text-sm gap-4">
                  {node.tags.map((tag) => (
                    <li key={tag.id}>
                      <Badge
                        variant="pill"
                        rounded="full"
                        size="small"
                        style={{ fontVariant: "small-caps" }}
                      >
                        {tag.label.toLowerCase()}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {node.answer ? (
                <p>{node.answer.text}</p>
              ) : (
                <div className="flex justify-center">
                  <CreateAnswer
                    question={node.question.text}
                    tenantId={tenantId}
                    nodeId={node.id}
                  />
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};
