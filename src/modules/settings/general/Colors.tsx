import React, { useState } from 'react';

import Sketch from '@uiw/react-color-sketch';

export const Colors = () => {
  const [hexPrimary, setHexPrimary] = useState('#0f766e');
  const [hexSecondary, setHexSecondary] = useState('#e7e5e4');
  return (
    <div className="flex flex-col gap-4 w-3/4 mx-auto bg-stone-100 rounded-md p-4 mb-4">
      <h2
        className="text-4xl text-center font-serif font-semibold lowercase"
        style={{ fontVariant: 'small-caps' }}
      >
        Colors
      </h2>
      <div className="flex justify-evenly items-center mb-2">
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
        className="text-center font-semibold w-fit px-2 py-1"
        style={{ backgroundColor: hexSecondary, color: hexPrimary }}
      >
        Test the colors
      </p>
    </div>
  );
};
