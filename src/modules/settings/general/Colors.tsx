import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Color } from '@prisma/client';
import Sketch from '@uiw/react-color-sketch';
import { AxiosError } from 'axios';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { hex, score } from 'wcag-contrast';
import { z } from 'zod';

import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  errorToast,
} from '@/components';
import { useUpsertColors } from '@/hooks';
import { colorsClientSchema } from '@/lib';

type Schema = z.infer<typeof colorsClientSchema>;

type Props = {
  colors: Color;
  tenantId: string;
};

export const Colors = ({ colors, tenantId }: Props) => {
  const [disabled, setDisabled] = useState<boolean>(true);

  const [hexForeground, setHexForeground] = useState<string>(
    colors.foreground || '#0f766e',
  );
  const [hexBackground, setHexBackground] = useState<string>(
    colors.background || '#e7e5e4',
  );
  const ratio: number = hex(hexForeground, hexBackground);
  const wcag: string = score(ratio);

  const {
    handleSubmit,
    control,
    formState: { isDirty, isSubmitting },
  } = useForm<Schema>({
    resolver: zodResolver(colorsClientSchema),
  });

  const { mutate, isError, error } = useUpsertColors(tenantId);

  const onSubmit: SubmitHandler<Schema> = (values) => {
    mutate(values);
  };

  const handleForegroundChange = (onChange, color) => {
    onChange(color.hex);
    setHexForeground(color.hex);
  };

  const handleBackgroundChange = (onChange, color) => {
    onChange(color.hex);
    setHexBackground(color.hex);
  };

  useEffect(() => {
    setDisabled(isSubmitting || !isDirty);
  }, [isSubmitting, isDirty]);

  if (isError && error instanceof AxiosError) {
    const errorMessage = error.response?.data.message || 'An error occurred';
    errorToast(errorMessage);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto mb-4 flex w-3/4 flex-col gap-4 rounded-md bg-default p-4"
    >
      <h2
        className="text-center font-serif text-4xl font-semibold lowercase"
        style={{ fontVariant: 'small-caps' }}
      >
        Colors
      </h2>
      <div className="mb-2 flex items-center justify-evenly">
        <Controller
          control={control}
          name="foreground"
          render={({ field: { onChange } }) => (
            <Sketch
              style={{ boxShadow: 'none' }}
              color={hexForeground}
              presetColors={false}
              disableAlpha={true}
              onChange={(color) => handleForegroundChange(onChange, color)}
            />
          )}
        />
        <Controller
          control={control}
          name="background"
          render={({ field: { onChange } }) => (
            <Sketch
              style={{ boxShadow: 'none' }}
              color={hexBackground}
              presetColors={false}
              disableAlpha={true}
              onChange={(color) => handleBackgroundChange(onChange, color)}
            />
          )}
        />
      </div>
      <div className="flex items-center justify-center gap-8">
        <p
          className="w-fit rounded-md px-2 py-1 text-center font-semibold"
          style={{ backgroundColor: hexBackground, color: hexForeground }}
        >
          Test the colors
        </p>
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <p>{ratio.toFixed(2)}:1</p>
            </TooltipTrigger>
            <TooltipContent className="border-none bg-default text-default">
              <p>WCAG ratio</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <p
                className={`font-semibold ${
                  wcag === 'Fail' ? 'text-red-700' : ''
                } ${wcag === 'AAA' ? 'text-green-700' : ''}`}
              >
                {wcag}
              </p>
            </TooltipTrigger>
            <TooltipContent className="border-none bg-default text-default">
              <p>WCAG score</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <Button
          variant={disabled ? 'disabled' : 'primaryDark'}
          weight="semibold"
          className="lowercase"
          style={{ fontVariant: 'small-caps' }}
          disabled={disabled}
        >
          Update
        </Button>
      </div>
    </form>
  );
};
