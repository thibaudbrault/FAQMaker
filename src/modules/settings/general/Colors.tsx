import { useState } from 'react';

import Sketch from '@uiw/react-color-sketch';
import { hex, score } from 'wcag-contrast';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components';

export const Colors = () => {
  const [hexForeground, setHexForeground] = useState('#0f766e');
  const [hexBackground, setHexBackground] = useState('#e7e5e4');
  const ratio: number = hex(hexForeground, hexBackground);
  const wcag: string = score(ratio);

  return (
    <div className="mx-auto mb-4 flex w-3/4 flex-col gap-4 rounded-md bg-default p-4">
      <h2
        className="text-center font-serif text-4xl font-semibold lowercase"
        style={{ fontVariant: 'small-caps' }}
      >
        Colors
      </h2>
      <div className="mb-2 flex items-center justify-evenly">
        <Sketch
          style={{ boxShadow: 'none' }}
          color={hexForeground}
          presetColors={false}
          disableAlpha={true}
          onChange={(color) => {
            setHexForeground(color.hex);
          }}
        />
        <Sketch
          style={{ boxShadow: 'none' }}
          color={hexBackground}
          presetColors={false}
          disableAlpha={true}
          onChange={(color) => {
            setHexBackground(color.hex);
          }}
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
    </div>
  );
};
