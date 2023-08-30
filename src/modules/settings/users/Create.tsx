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
} from '@/components';
import { createNode, createUser } from '@/data';
import user from '@/pages/api/user';
import { Question, User } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AtSign, HelpCircle, PlusCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';

type Props = {
  tenantId: string;
};

export const CreateUser = ({ tenantId }: Props) => {
  const { register, handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: (values: User) => createUser(values, tenantId),
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({
        queryKey: ['users', tenantId],
      });
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="primaryDark"
          size="full"
          font="large"
          icon="withIcon"
          weight="bold"
        >
          <PlusCircle />
          Add
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-stone-200/80">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">New user</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(mutate)}
          className="flex flex-col items-center gap-4"
        >
          <fieldset className="flex flex-col w-full gap-2">
            <div className="flex flex-col gap-1 w-11/12 mx-auto">
              <Label
                htmlFor="firstName"
                className="lowercase"
                style={{ fontVariant: 'small-caps' }}
              >
                First Name
              </Label>
              <Input
                {...register('firstName', { required: true })}
                withIcon
                icon={<HelpCircle />}
                type="text"
                id="firstName"
                placeholder="First Name"
                className="w-full border border-transparent outline-none rounded-md py-1 focus:border-teal-700"
              />
            </div>
            <div className="flex flex-col gap-1 w-11/12 mx-auto">
              <Label
                htmlFor="lastName"
                className="lowercase"
                style={{ fontVariant: 'small-caps' }}
              >
                Last Name
              </Label>
              <Input
                {...register('lastName', { required: true })}
                withIcon
                icon={<HelpCircle />}
                type="text"
                id="lastName"
                placeholder="Last Name"
                className="w-full border border-transparent outline-none rounded-md py-1 focus:border-teal-700"
              />
            </div>
            <div className="flex flex-col gap-1 w-11/12 mx-auto">
              <Label
                htmlFor="email"
                className="lowercase"
                style={{ fontVariant: 'small-caps' }}
              >
                Email
              </Label>
              <Input
                {...register('email', { required: true })}
                withIcon
                icon={<AtSign />}
                type="text"
                id="email"
                placeholder="Email"
                className="w-full border border-transparent outline-none rounded-md py-1 focus:border-teal-700"
              />
            </div>
          </fieldset>
          <Button variant={'primaryDark'} type="submit">
            Add
          </Button>
        </form>
        <DialogFooter>
          <p className="text-xs">
            The password will be created automatically and sent to the email
            entered
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
