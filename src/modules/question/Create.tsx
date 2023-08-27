import {
  Button,
  Dialog,
  DialogContent,
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
import { useForm } from "react-hook-form";

export const CreateQuestion = () => {
  const { register, handleSubmit, reset } = useForm();

  const { mutate, isLoading } = useMutation({
    mutationFn: (values: Question) => postQuestion(values),
    onSuccess: () => reset(),
  });

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
      <DialogContent>
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
              {...register("text")}
              withIcon
              icon={<HelpCircle />}
              type="text"
              id="question"
              placeholder="New question"
              className="w-full border border-transparent outline-none rounded-md py-1 focus:border-stone-900"
            />
          </div>
          <Button variant="primaryDark" type="submit" disabled={isLoading}>
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
