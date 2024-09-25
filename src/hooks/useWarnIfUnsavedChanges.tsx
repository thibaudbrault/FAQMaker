'use client';

import { useState, useEffect } from 'react';

export const useWarnIfUnsavedChanges = (unsaved: boolean) => {
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const targetUrl = (e.currentTarget as HTMLAnchorElement).href;
      const currentUrl = window.location.href;

      if (targetUrl !== currentUrl && unsaved) {
        e.preventDefault();
        setNextUrl(targetUrl);
        setShowDialog(true);
      }
    };

    // Add event listeners to all anchor elements on mount
    const anchorElements = document.querySelectorAll('a[href]');
    anchorElements.forEach((anchor) =>
      anchor.addEventListener('click', handleAnchorClick),
    );

    // Cleanup function to remove listeners when unmounting
    return () => {
      anchorElements.forEach((anchor) =>
        anchor.removeEventListener('click', handleAnchorClick),
      );
    };
  }, [unsaved]);

  return { showDialog, setShowDialog, nextUrl, setNextUrl };
};
