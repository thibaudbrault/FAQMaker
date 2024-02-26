import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Tenant } from '@prisma/client';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import Dropzone from 'react-dropzone';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components';
import { useUpsertFiles } from '@/hooks';
import { filesClientSchema } from '@/lib';

type Props = {
  tenant: Tenant;
};

type Schema = z.infer<typeof filesClientSchema>;

export const Files = ({ tenant }: Props) => {
  const [disabled, setDisabled] = useState<boolean>(true);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [file, setFile] = useState<File>();

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting, isDirty, isValid, errors },
  } = useForm<Schema>({
    resolver: zodResolver(filesClientSchema),
    mode: 'onBlur',
    defaultValues: {
      logo: null,
    },
  });

  const { mutate } = useUpsertFiles(tenant.id);

  const onSubmit: SubmitHandler<Schema> = (values) => {
    mutate(values);
  };

  const handleReset = () => {
    reset();
    setPreviewImage('');
    setFile(null);
  };

  useEffect(() => {
    setDisabled(isSubmitting || !isDirty || !isValid);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty, isSubmitting, isValid]);

  return (
    <div className="flex flex-col items-center gap-4">
      <h2
        className="text-center font-serif text-3xl font-semibold lowercase md:text-4xl"
        style={{ fontVariant: 'small-caps' }}
      >
        Logo
      </h2>
      <form
        className="mx-auto flex w-11/12 flex-col items-center gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          name={'logo'}
          control={control}
          render={({ field: { onChange, onBlur } }) => (
            <div className="w-full">
              <Dropzone
                accept={{
                  'image/png': ['.svg', '.jpeg', '.jpg', '.webp', '.png'],
                }}
                onDrop={(acceptedFiles) => {
                  onChange(acceptedFiles[0]);
                  setFile(acceptedFiles[0]);
                  setPreviewImage(URL.createObjectURL(acceptedFiles[0]));
                }}
              >
                {({ getRootProps, getInputProps, open, isDragActive }) => (
                  <div
                    className={`relative flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-t-md border-2 border-b-0 border-dashed border-gray-12 px-4 py-8 ${isDragActive ? 'bg-grayA-3' : 'bg-transparent'}`}
                    {...getRootProps()}
                  >
                    <input
                      {...getInputProps({
                        id: 'spreadsheet',
                        onChange,
                        onBlur,
                      })}
                    />
                    {previewImage ? (
                      <Image
                        src={previewImage}
                        alt={file.name}
                        className="h-36 w-36 rounded-md border border-gray-7 object-cover"
                        width={144}
                        height={144}
                      />
                    ) : (
                      <div className="flex h-36 w-36 items-center justify-center">
                        <Upload className="h-20 w-20" />
                      </div>
                    )}
                    <p className="text-xl font-semibold">
                      {file ? file.name : 'No file selected.'}
                    </p>
                    <button
                      type="button"
                      className="text-sm text-gray-11 hover:text-gray-12"
                      onClick={open}
                    >
                      Choose a file or drag and drop
                    </button>
                  </div>
                )}
              </Dropzone>
              <Button
                variant="ghost"
                rounded="bottom"
                weight="semibold"
                className="w-full border-2 border-t border-dashed border-t-grayA-8 lowercase shadow-none"
                style={{ fontVariant: 'small-caps', borderTopStyle: 'solid' }}
                onClick={handleReset}
                type="button"
              >
                Remove
              </Button>
            </div>
          )}
        />
        <Button
          variant={disabled ? 'disabled' : 'primary'}
          weight="semibold"
          className="lowercase"
          style={{ fontVariant: 'small-caps' }}
          disabled={disabled}
        >
          Update
        </Button>
      </form>
    </div>
  );
};
