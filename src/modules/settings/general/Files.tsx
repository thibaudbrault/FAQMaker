'use client';

import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import Dropzone from 'react-dropzone';
import { Controller, useForm } from 'react-hook-form';

import { submitImage, updateLogo, updateLogoSchema } from '@/actions';
import { Button, resultToast } from '@/components';
import { filesSchema } from '@/lib/validations';

import type { Tenant } from '@prisma/client';
import type { SubmitHandler } from 'react-hook-form';
import type { z } from 'zod';

type Props = {
  tenant: Tenant;
};

type Schema = z.infer<typeof filesSchema>;

type UpdateLogoType = z.infer<typeof updateLogoSchema>;

export const Files = ({ tenant }: Props) => {
  const [disabled, setDisabled] = useState<boolean>(true);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting, isDirty, isValid },
  } = useForm<Schema>({
    resolver: zodResolver(filesSchema),
    mode: 'onBlur',
    defaultValues: {
      logo: undefined,
    },
  });

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    const formData = new FormData();
    formData.append('logo', data.logo);
    formData.append('company', tenant.company);
    const url = await submitImage(formData, 'logo');
    if (url === '') {
      return resultToast('Upload failed', undefined);
    }
    const logo: UpdateLogoType = {
      url,
      id: tenant.id,
    };
    const result = await updateLogo(logo);
    resultToast(result?.serverError, 'Logo updated successfully');
  };

  const handleReset = () => {
    reset();
    setPreviewImage('');
    setFile(null);
  };

  useEffect(() => {
    setDisabled(isSubmitting || !isDirty || !isValid);
  }, [isDirty, isSubmitting, isValid]);

  return (
    <div className="flex flex-col gap-4">
      <h2
        className="text-xl font-semibold lowercase"
        style={{ fontVariant: 'small-caps' }}
      >
        Logo
      </h2>
      <form
        className="flex flex-col items-center gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          name="logo"
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
                    className={`relative flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-t-md border-2 border-b-0 border-dashed border-gray-12 px-4 py-8 ${isDragActive ? 'bg-primary-foreground-alpha' : 'bg-transparent'}`}
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
                        alt={file?.name ?? 'Logo'}
                        className="size-36 rounded-md border border-primary object-cover"
                        width={144}
                        height={144}
                      />
                    ) : (
                      <div className="flex size-36 items-center justify-center">
                        <Upload className="size-20" />
                      </div>
                    )}
                    <p className="text-xl font-semibold">
                      {file ? file.name : 'No file selected.'}
                    </p>
                    <button
                      type="button"
                      className="text-sm text-primary-muted hover:text-primary"
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
                className="w-full border-2 border-t border-dashed border-t-grayA-8 shadow-none"
                style={{ borderTopStyle: 'solid', fontVariant: 'small-caps' }}
                onClick={handleReset}
                type="button"
              >
                Remove
              </Button>
            </div>
          )}
        />
        <Button variant="primary" disabled={disabled}>
          Update
        </Button>
      </form>
    </div>
  );
};
