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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  errorToast,
} from '@/components';
import { useCreateNode, useTags } from '@/hooks';
import { Question, User } from '@prisma/client';
import { HelpCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TagsList } from './components';

type Props = {
  user: User;
};

export const CreateQuestion = ({ user }: Props) => {
  const [disabled, setDisabled] = useState<boolean>(true);
  const [selectedTags, setSelectedTags] = useState<String[]>([]);

  const { register, handleSubmit, reset, watch } = useForm();

  const { data: tags, isLoading: tagsLoading } = useTags(user.tenantId);
  const { mutate, isLoading, isError, error } = useCreateNode(
    user,
    selectedTags,
    reset,
  );

  const onSubmit = (values: Question) => {
    mutate(values);
  };

  if (isError && error instanceof Error) {
    errorToast(error.message);
  }

  const questionText = watch('text', '');

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
          style={{ fontVariant: 'small-caps' }}
        >
          New Question
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-stone-200/90">
        <DialogHeader>
          <DialogTitle>New question</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="question">
          <TabsList className="w-full gap-2">
            <TabsTrigger
              value="question"
              className="data-[state=active]:bg-teal-700 data-[state=active]:text-stone-200"
            >
              Question
            </TabsTrigger>
            <TabsTrigger
              value="tags"
              className="data-[state=active]:bg-teal-700 data-[state=active]:text-stone-200"
            >
              Tags
            </TabsTrigger>
          </TabsList>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center gap-2 [&_svg]:focus-within:text-teal-700"
          >
            <TabsContent value="question" className="w-full">
              <div className="flex flex-col gap-1 w-11/12 mx-auto">
                <Label
                  htmlFor="question"
                  className="lowercase"
                  style={{ fontVariant: 'small-caps' }}
                >
                  Question
                </Label>
                <Input
                  {...register('text', { required: true, min: 3 })}
                  withIcon
                  icon={<HelpCircle />}
                  type="text"
                  id="question"
                  placeholder="New question"
                  className="w-full border border-transparent outline-none rounded-md py-1 focus:border-teal-700"
                />
              </div>
            </TabsContent>
            <TabsContent value="tags">
              <TagsList
                tagsLoading={tagsLoading}
                tags={tags}
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
              />
            </TabsContent>
            <Button
              variant={disabled ? 'disabledDark' : 'primaryDark'}
              type="submit"
              disabled={disabled}
            >
              Submit
            </Button>
          </form>
        </Tabs>
        <DialogFooter className="text-xs justify-start text-center">
          <p>
            {disabled
              ? 'The question must have 3 or more letters'
              : "You're good to post"}
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
