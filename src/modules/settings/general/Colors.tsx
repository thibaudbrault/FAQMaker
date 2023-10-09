import React, { useState } from 'react';

import Sketch from '@uiw/react-color-sketch';

export const Colors = () => {
  const [hexPrimary, setHexPrimary] = useState('#0f766e');
  const [hexSecondary, setHexSecondary] = useState('#e7e5e4');
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
          color={hexPrimary}
          presetColors={false}
          disableAlpha={true}
          onChange={(color) => {
            setHexPrimary(color.hex);
          }}
        />
        <Sketch
          style={{ boxShadow: 'none' }}
          color={hexSecondary}
          presetColors={false}
          disableAlpha={true}
          onChange={(color) => {
            setHexSecondary(color.hex);
          }}
        />
      </div>
      <p
        className="w-fit px-2 py-1 text-center font-semibold"
        style={{ backgroundColor: hexSecondary, color: hexPrimary }}
      >
        Test the colors
      </p>
    </div>
  );
};
