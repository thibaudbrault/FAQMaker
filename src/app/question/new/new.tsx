'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Integrations, Tag } from '@prisma/client';
import { HelpCircle } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import {
  FieldErrors,
  UseFormRegister,
  UseFormWatch,
  useForm,
} from 'react-hook-form';
import slugify from 'slugify';
import { z } from 'zod';

import { createNode } from '@/actions';
import { BackButton, Button, Field, Input } from '@/components';
import { questionClientSchema } from '@/lib';
import { TagsList } from '@/modules';
import { Me } from '@/types';
import { Limits } from '@/utils';

type Props = {
  me: Me;
  tags: Tag[];
  integrations: Integrations;
};

type Schema = z.infer<typeof questionClientSchema>;

type ContentProps = {
  me: Me;
  tags: Tag[];
  isValid: boolean;
  watch: UseFormWatch<Schema>;
  errors: FieldErrors<Schema>;
  register: UseFormRegister<Schema>;
};

export function FormContent({
  me,
  tags,
  isValid,
  watch,
  errors,
  register,
}: ContentProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { pending } = useFormStatus();
  const disabled = pending || !isValid;
  const text = watch('text');

  return (
    <>
      <fieldset className="mx-auto flex w-11/12 flex-col gap-4">
        <div className="w-full text-center">
          <legend
            className="font-serif text-3xl font-semibold lowercase md:text-4xl"
            style={{ fontVariant: 'small-caps' }}
          >
            Ask a question
          </legend>
        </div>
        <input type="text" name="userId" value={me.id} readOnly hidden />
        <input
          type="text"
          name="tenantId"
          value={me.tenantId}
          readOnly
          hidden
        />
        <input
          type="text"
          name="slug"
          value={slugify(text).toLowerCase()}
          readOnly
          hidden
        />
        <input type="text" name="tags" value={selectedTags} readOnly hidden />
        <Field
          label="Question"
          value="text"
          error={errors?.text?.message}
          hasLimit
          limit={Limits.QUESTION}
          curLength={text.length}
        >
          <Input
            {...register('text')}
            name="text"
            withIcon={true}
            icon={<HelpCircle />}
            type="text"
            id="question"
            placeholder="New question"
          />
        </Field>
        <TagsList
          tags={tags}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
        />
      </fieldset>
      <div className="flex items-center justify-center gap-4">
        <Button
          variant={disabled ? 'disabled' : 'primary'}
          weight="semibold"
          className="lowercase"
          style={{ fontVariant: 'small-caps' }}
          disabled={disabled}
          type="submit"
        >
          Submit
        </Button>
        {/* <Button
              variant={disabled ? 'disabled' : 'ghost'}
              icon="withIcon"
              weight="semibold"
              className="lowercase"
              style={{ fontVariant: 'small-caps' }}
              disabled={disabled}
              onClick={handleSubmit(onSubmitWithAnswer)}
            >
              Answer
              <MoveRight className="h-5 w-5" />
            </Button> */}
      </div>
    </>
  );
}

export default function New({ me, tags, integrations }: Props) {
  const withAnswer = true;

  const {
    register,
    watch,
    formState: { errors, isValid },
  } = useForm<Schema>({
    resolver: zodResolver(questionClientSchema),
    mode: 'onBlur',
    defaultValues: {
      text: '',
    },
  });

  const createNodeAction = createNode.bind(null, integrations);

  return (
    <section className="mx-auto flex w-11/12 flex-col gap-4 md:w-3/4">
      <BackButton />
      <div className="flex flex-col gap-4 rounded-md bg-gray-3 p-4">
        <form
          action={createNodeAction}
          className="flex flex-col items-center gap-4"
        >
          <FormContent
            tags={tags}
            me={me}
            isValid={isValid}
            watch={watch}
            errors={errors}
            register={register}
          />
        </form>
      </div>
    </section>
  );
}

// 'use client';

// import { BackButton, Field, Input, Button } from '@/components';
// import { useMediaQuery, useCreateNode } from '@/hooks';
// import { questionClientSchema } from '@/lib';
// import { TagsList } from '@/modules';
// import { Me } from '@/types';
// import { Limits } from '@/utils';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Integrations, Tag } from '@prisma/client';
// import { HelpCircle, MoveRight } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { useState, useEffect } from 'react';
// import { useForm, SubmitHandler } from 'react-hook-form';
// import { Schema } from 'zod';

// type Props = {
//   me: Me;
//   tags: Tag[];
//   integrations: Integrations;
// };

// export default function New({ me, tags, integrations }: Props) {
//   const [disabled, setDisabled] = useState<boolean>(true);
//   const [selectedTags, setSelectedTags] = useState<string[]>([]);
//   const isDesktop = useMediaQuery('(min-width: 640px)');
//   const withAnswer = true;

//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { isSubmitting, errors, isValid },
//   } = useForm<Schema>({
//     resolver: zodResolver(questionClientSchema),
//     mode: 'onBlur',
//     defaultValues: {
//       text: '',
//     },
//   });
//   const router = useRouter();
//   const text = watch('text');

//   const { mutate } = useCreateNode(me, router, selectedTags, integrations);

//   const onSubmit: SubmitHandler<Schema> = (values) => {
//     mutate(values);
//   };

//   const onSubmitWithAnswer: SubmitHandler<Schema> = (data) => {
//     const values = { ...data, withAnswer };
//     mutate(values);
//   };

//   useEffect(() => {
//     setDisabled(isSubmitting || !isValid);
//   }, [isSubmitting, isValid]);

//   return (
//     <section className="mx-auto flex w-11/12 flex-col gap-4 md:w-3/4">
//       <BackButton />
//       <div className="flex flex-col gap-4 rounded-md bg-gray-3 p-4">
//         <form className="flex flex-col items-center gap-4">
//           <fieldset className="mx-auto flex w-11/12 flex-col gap-4">
//             <div className="w-full text-center">
//               <legend
//                 className="font-serif text-3xl font-semibold lowercase md:text-4xl"
//                 style={{ fontVariant: 'small-caps' }}
//               >
//                 Ask a question
//               </legend>
//             </div>
//             <Field
//               label="Question"
//               value="text"
//               error={errors?.text?.message}
//               hasLimit
//               limit={Limits.QUESTION}
//               curLength={text.length}
//             >
//               <Input
//                 {...register('text')}
//                 withIcon={isDesktop}
//                 icon={<HelpCircle />}
//                 type="text"
//                 id="question"
//                 placeholder="New question"
//               />
//             </Field>
//             <TagsList
//               tags={tags}
//               selectedTags={selectedTags}
//               setSelectedTags={setSelectedTags}
//             />
//           </fieldset>
//           <div className="flex items-center justify-center gap-4">
//             <Button
//               variant={disabled ? 'disabled' : 'primary'}
//               weight="semibold"
//               className="lowercase"
//               style={{ fontVariant: 'small-caps' }}
//               disabled={disabled}
//               onClick={handleSubmit(onSubmit)}
//             >
//               Submit
//             </Button>
//             <Button
//               variant={disabled ? 'disabled' : 'ghost'}
//               icon="withIcon"
//               weight="semibold"
//               className="lowercase"
//               style={{ fontVariant: 'small-caps' }}
//               disabled={disabled}
//               onClick={handleSubmit(onSubmitWithAnswer)}
//             >
//               Answer
//               <MoveRight className="h-5 w-5" />
//             </Button>
//           </div>
//         </form>
//       </div>
//     </section>
//   );
// }
