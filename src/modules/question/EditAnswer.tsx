import { Answer } from '@prisma/client';
import { PenSquare } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components';

type Props = {
  answer: Answer;
  nodeId: string;
};

export const EditAnswer = ({ answer, nodeId }: Props) => {
  if (answer) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p>{answer.text}</p>
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
