import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Color } from '@prisma/client';
import Sketch from '@uiw/react-color-sketch';
import axios, { AxiosError } from 'axios';
import { HelpCircle } from 'lucide-react';
import { useRouter } from 'next/router';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { hex, score } from 'wcag-contrast';
import { z } from 'zod';

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  const router = useRouter();

  const [hexForeground, setHexForeground] = useState<string>(
    colors?.foreground ?? '#0f766e',
  );
  const [hexBackground, setHexBackground] = useState<string>(
    colors?.background ?? '#e7e5e4',
  );
  const [hexBorder, setHexBorder] = useState<string>(
    colors?.border ?? '#0a0a0a',
  );
  const ratio: number = hex(hexForeground, hexBackground);
  const wcag: string = score(ratio);

  const {
    handleSubmit,
    control,
    formState: { isDirty, isSubmitting },
  } = useForm<Schema>({
    resolver: zodResolver(colorsClientSchema),
    defaultValues: {
      foreground: colors?.foreground,
      background: colors?.background,
      border: colors?.border,
    },
  });

  const { mutate, isError, error } = useUpsertColors(tenantId, router);

  const [test, setTest] = useState('#d45e54');
  const testFn = async () => {
    const { data } = await axios.get(
      `https://www.thecolorapi.com/scheme?hex=${hexBackground.slice(
        1,
      )}&mode=monochrome&count=11`,
    );
    setTest(data.colors[2].hex.value);
  };

  const onSubmit: SubmitHandler<Schema> = (values) => {
    testFn();
    // mutate(values);
  };

  const handleForegroundChange = (onChange, color) => {
    onChange(color.hex);
    setHexForeground(color.hex);
  };

  const handleBackgroundChange = (onChange, color) => {
    onChange(color.hex);
    setHexBackground(color.hex);
  };

  const handleBorderChange = (onChange, color) => {
    onChange(color.hex);
    setHexBorder(color.hex);
  };

  useEffect(() => {
    setDisabled(isSubmitting || !isDirty);
  }, [isSubmitting, isDirty]);

  if (isError && error instanceof AxiosError) {
    console.error(`Something went wrong: ${error.response.data.message}`);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative flex flex-col gap-4"
    >
      <h2
        className="text-center font-serif text-4xl font-semibold lowercase"
        style={{ fontVariant: 'small-caps' }}
      >
        Colors
      </h2>
      <fieldset className="mb-2 flex flex-wrap items-center justify-evenly gap-2">
        <div>
          <p className="text-center font-semibold">Foreground</p>
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
                className="border border-ghost"
              />
            )}
          />
        </div>
        <div>
          <p className="text-center font-semibold">Background</p>
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
                className="border border-ghost"
              />
            )}
          />
        </div>
        <div>
          <p className="text-center font-semibold">Border</p>
          <Controller
            control={control}
            name="border"
            render={({ field: { onChange } }) => (
              <Sketch
                style={{ boxShadow: 'none' }}
                color={hexBorder}
                presetColors={false}
                disableAlpha={true}
                onChange={(color) => handleBorderChange(onChange, color)}
                className="border border-ghost"
              />
            )}
          />
        </div>
      </fieldset>
      <div className="flex items-center justify-center gap-8">
        <p
          className="w-fit rounded-md border border-ghost px-2 py-1 text-center font-semibold"
          style={{ backgroundColor: hexBackground, color: hexForeground }}
        >
          Test the colors
        </p>
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <p>{ratio.toFixed(2)}:1</p>
            </TooltipTrigger>
            <TooltipContent>
              <p>WCAG ratio</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <p
                className={`font-semibold ${
                  wcag === 'Fail' ? 'text-error' : ''
                } ${wcag === 'AAA' ? 'text-green-700' : ''}`}
              >
                {wcag}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p>WCAG score</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-2">
        <Button
          variant={disabled ? 'disabled' : 'primary'}
          weight="semibold"
          className="lowercase"
          style={{ fontVariant: 'small-caps' }}
          disabled={disabled}
        >
          Update
        </Button>
        {wcag === 'Fail' && (
          <p className="text-sm text-error">
            <span className="font-semibold">Bad contrast!</span> Do not use this
            palette
          </p>
        )}
        {wcag === 'AAA' && (
          <p className="text-sm text-green-700">
            <span className="font-semibold">Good contrast!</span> Use this
            palette
          </p>
        )}
      </div>
      <Dialog>
        <DialogTrigger className="absolute bottom-1 right-1 font-semibold">
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle />
            </TooltipTrigger>
            <TooltipContent>
              <p>Help</p>
            </TooltipContent>
          </Tooltip>
        </DialogTrigger>
        <DialogContent className="bg-stone-200/90">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              How to build a good palette ?
            </DialogTitle>
          </DialogHeader>
          <div>
            <p>There are 3 different colors to choose:</p>
            <ul className="list-disc pl-6">
              <li>
                <span className="font-semibold">Foreground</span>: used for text
                (default is white)
              </li>
              <li>
                <span className="font-semibold">Background</span>: used for
                background (default is black)
              </li>
              <li>
                <span className="font-semibold">Border</span>: used for border
              </li>
            </ul>
          </div>
          <p>
            Other colors will be created to have a complete palette with offsets
            and negative of the chosen colors.
          </p>
        </DialogContent>
      </Dialog>
    </form>
  );
};
