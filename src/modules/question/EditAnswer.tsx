import { Answer } from '@prisma/client';
import { PenSquare } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import { Button } from '@/components';
const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), {
  ssr: false,
});

type Props = {
  answer: Answer;
  nodeId: string;
};

export const EditAnswer = ({ answer, nodeId }: Props) => {
  if (answer) {
    return (
      <div className="flex flex-col items-center gap-4">
        <MarkdownPreview
          className="w-11/12 mx-auto text-left"
          source={answer.text}
        />
        <Button variant="primaryDark" asChild>
          <Link
            href={{
              pathname: '/question/answer',
              query: { id: nodeId },
            }}
            as={`/question/answer?id=${nodeId}`}
          >
            Edit
          </Link>
        </Button>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-center italic">No answer</p>
        <Button variant="primaryDark" icon="withIcon" asChild>
          <Link
            href={{
              pathname: '/question/answer',
              query: { id: nodeId },
            }}
            as={`/question/answer?id=${nodeId}`}
          >
            <PenSquare />
            Answer
          </Link>
        </Button>
      </div>
    );
  }
};
