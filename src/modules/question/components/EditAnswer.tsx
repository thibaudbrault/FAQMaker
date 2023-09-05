import { Button } from '@/components';
import { Answer } from '@prisma/client';
import { PenSquare } from 'lucide-react';

type Props = {
  answer: Answer;
};

export const EditAnswer = ({ answer }: Props) => {
  if (answer) {
    return <p>{answer.text}</p>;
  } else {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-center italic">No answer</p>
        <Button variant="primaryDark" className="w-fit" icon="withIcon">
          <PenSquare />
          Answer
        </Button>
      </div>
    );
  }
};
