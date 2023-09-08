import { AxiosError } from 'axios';
import Link from 'next/link';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
  Loader,
  errorToast,
} from '@/components';
import { ExtendedNode } from '@/types';

type Props = {
  nodes: ExtendedNode[];
  isLoading: boolean;
  isError: boolean;
  error: AxiosError;
};

export const List = ({ nodes, isLoading, isError, error }: Props) => {
  if (isLoading) {
    return <Loader size="screen" color="border-teal-700" />;
  }

  if (isError && error instanceof Error) {
    errorToast(error.message);
  }

  return (
    <section className="mt-6">
      {nodes.length > 0 ? (
        <Accordion
          type="multiple"
          className="w-3/4 mx-auto flex flex-col gap-6"
        >
          {nodes.map((node) => (
            <AccordionItem
              key={node.id}
              value={node.id.toString()}
              className="relative bg-stone-100 border border-teal-700 rounded-md"
            >
              <AccordionTrigger className="px-6">
                <div className="flex flex-col items-start gap-4">
                  <h2 className="font-semibold text-2xl">
                    {node.question.text}
                  </h2>
                  <ul className="flex text-sm gap-4">
                    {node.tags.map((tag) => (
                      <li key={tag.id}>
                        <Badge
                          variant="primary"
                          rounded="full"
                          size="small"
                          style={{ fontVariant: 'small-caps' }}
                        >
                          {tag.label.toLowerCase()}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6">
                {node.answer ? (
                  <p>{node.answer.text}</p>
                ) : (
                  <p className="text-center italic">No answer</p>
                )}
              </AccordionContent>
              <Button
                variant="secondaryDark"
                size="full"
                font="large"
                weight="bold"
                rounded="bottom"
                className="lowercase block text-center border-t border-t-teal-700"
                style={{ fontVariant: 'small-caps' }}
                asChild
              >
                <Link
                  href={{
                    pathname: '/question/[slug]',
                    query: { slug: node.question.slug, id: node.id },
                  }}
                  as={`/question/${node.question.slug}?id=${node.id}`}
                >
                  Modify
                </Link>
              </Button>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <p
          className="text-center text-2xl font-bold lowercase"
          style={{ fontVariant: 'small-caps' }}
        >
          Ask a question
        </p>
      )}
    </section>
  );
};
