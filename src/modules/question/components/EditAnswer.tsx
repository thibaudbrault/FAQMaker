import { Dispatch, SetStateAction } from 'react';

import { Answer } from '@prisma/client';
import { PenSquare } from 'lucide-react';

import { Button, Editor } from '@/components';


type Props = {
  answer: Answer;
  isEditingAnswer: boolean;
  setIsEditingAnswer: Dispatch<SetStateAction<boolean>>;
};

export const EditAnswer = ({
  answer,
  isEditingAnswer,
  setIsEditingAnswer,
}: Props) => {
  const handleAnswer = () => {
    setIsEditingAnswer(false);
  };

  if (!isEditingAnswer) {
    if (answer) {
      return (
        <div className="flex flex-col items-center gap-4">
          <p>{answer.text}</p>
          <Button
            variant="primaryDark"
            onClick={() => setIsEditingAnswer(true)}
          >
            Edit
          </Button>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center gap-4">
          <p className="text-center italic">No answer</p>
          <Button
            variant="primaryDark"
            className="w-fit"
            icon="withIcon"
            onClick={() => setIsEditingAnswer(true)}
          >
            <PenSquare />
            Answer
          </Button>
        </div>
      );
    }
  } else {
    return (
      <div className="flex flex-col items-center gap-4">
        <Editor className="bg-white rounded-md w-full h-72 border border-teal-700 resize-y" />
        <Button variant="primaryDark" weight="semibold" onClick={handleAnswer}>
          Submit
        </Button>
      </div>
    );
  }
};
