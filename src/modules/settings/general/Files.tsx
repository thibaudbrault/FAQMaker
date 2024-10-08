'use client';

import { useCallback, useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import { DropzoneOptions, useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';

import { submitImage, updateLogo, updateLogoSchema } from '@/actions';
import { Button, resultToast } from '@/components';
import { filesSchema } from '@/lib/validations';
import { MAX_FILE_SIZE } from '@/utils';

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

  const {
    handleSubmit,
    reset,
    register,
    unregister,
    setValue,
    watch,
    formState: { isSubmitting, isDirty, isValid },
  } = useForm<Schema>({
    resolver: zodResolver(filesSchema),
    mode: 'onBlur',
    defaultValues: {
      logo: undefined,
    },
  });

  const files: File[] = watch('logo');

  const onDrop = useCallback<DropzoneOptions['onDrop']>(
    (files) => {
      setValue('logo', files, { shouldValidate: true, shouldDirty: true });
      setPreviewImage(URL.createObjectURL(files[0]));
    },
    [setValue],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.svg', '.jpeg', '.jpg', '.webp', '.png'],
    },
    maxSize: MAX_FILE_SIZE,
  });

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    const formData = new FormData();
    formData.append('logo', data.logo[0]);
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
  };

  useEffect(() => {
    register('logo');
    return () => {
      unregister('logo');
    };
  }, [register, unregister]);

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
        <div className="w-full">
          <div
            className={`relative flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-t-md border-2 border-b-0 border-dashed border-gray-12 px-4 py-8 ${isDragActive ? 'bg-primary-foreground-alpha' : 'bg-transparent'}`}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            {previewImage ? (
              <Image
                src={previewImage}
                alt={files?.[0]?.name ?? 'Logo'}
                className="size-36 rounded-md border border-primary object-cover"
                width={144}
                height={144}
              />
            ) : (
              <>
                <div className="flex size-36 items-center justify-center">
                  <Upload className="size-20" />
                </div>
                <p className="text-xl font-semibold">
                  {files?.length ? files?.[0].name : 'No file selected.'}
                </p>
                <button
                  type="button"
                  className="text-sm text-primary-muted hover:text-primary"
                  onClick={open}
                >
                  Choose a file or drag and drop
                </button>
              </>
            )}
          </div>
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
        <Button variant="primary" disabled={disabled}>
          Update
        </Button>
      </form>
    </div>
  );
};
