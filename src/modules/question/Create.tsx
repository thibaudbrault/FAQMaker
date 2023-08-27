import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
} from "@/components";
import { postQuestion } from "@/data/question";
import { Question } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { HelpCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export const CreateQuestion = () => {
  const [disabled, setDisabled] = useState<boolean>(true);
  const { register, handleSubmit, reset, watch } = useForm();

  const { mutate, isLoading } = useMutation({
    mutationFn: (values: Question) => postQuestion(values),
    onSuccess: () => reset(),
  });

  const questionText = watch("text", "");

  useEffect(() => {
    setDisabled(isLoading || questionText.length < 3);
  }, [isLoading, questionText]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="primaryLight"
          font="large"
          size="small"
          className="font-semibold lowercase"
          style={{ fontVariant: "small-caps" }}
        >
          New Question
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-stone-200/80">
        <DialogHeader>
          <DialogTitle className="font-serif">Ask a question</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(mutate)}
          className="flex flex-col items-center gap-2"
        >
          <div className="flex flex-col gap-1 w-11/12 mx-auto">
            <Label
              htmlFor="question"
              className="lowercase"
              style={{ fontVariant: "small-caps" }}
            >
              Question
            </Label>
            <Input
              {...register("text", { required: true, min: 3 })}
              withIcon
              icon={<HelpCircle />}
              type="text"
              id="question"
              placeholder="New question"
              className="w-full border border-transparent outline-none rounded-md py-1 focus:border-stone-900"
            />
          </div>
          <Button
            variant={disabled ? "disabledDark" : "primaryDark"}
            type="submit"
            disabled={disabled}
          >
            Submit
          </Button>
        </form>
        <DialogFooter className="text-xs justify-start text-center">
          <p>
            {disabled
              ? "Question must have 3 or more letters"
              : "You're good to post"}
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
