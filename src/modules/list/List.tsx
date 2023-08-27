import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
} from "@/components";
import React, { useMemo } from "react";

export const List = () => {
  const nodes = useMemo(
    () => [
      {
        id: 1,
        question: {
          text: "Ceci est une question",
        },
        answer: {
          text: "Ceci est une réponse",
        },
        tags: [
          {
            id: 1,
            label: "Marketing",
          },
          {
            id: 2,
            label: "Nantes",
          },
        ],
        user: {
          name: "Test",
        },
      },
      {
        id: 2,
        question: {
          text: "Nouvelle question",
        },
        answer: {},
        tags: [
          {
            id: 1,
            label: "Payroll",
          },
          {
            id: 2,
            label: "Paris",
          },
        ],
        user: {
          name: "UserTest",
        },
      },
    ],
    []
  );

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
              {node.answer.text ? (
                <p>{node.answer.text}</p>
              ) : (
                <div className="flex justify-center">
                  <Button
                    variant="primaryDark"
                    font="large"
                    size="small"
                    className="font-semibold lowercase"
                    style={{ fontVariant: "small-caps" }}
                  >
                    Answer
                  </Button>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};
