import { useEffect } from 'react';

export const useWarnIfUnsavedChanges = (unsaved: boolean) => {
  useEffect(() => {
    const handleAnchorClick = (e: Event) => {
      const targetUrl = (e.currentTarget as HTMLAnchorElement).href,
        currentUrl = window.location.href;
      if (targetUrl !== currentUrl) {
        if (window.onbeforeunload) {
          // @ts-expect-error Expect 1 args
          const res = window.onbeforeunload();
          if (!res) {
            e.preventDefault();
          }
        }
      }
    };

    const handleMutation = () => {
      const anchorElements =
        document.querySelectorAll<HTMLAnchorElement>('a[href]');
      anchorElements.forEach((anchor) =>
        anchor.addEventListener('click', handleAnchorClick),
      );
    };

    const mutationObserver = new MutationObserver(handleMutation);
    mutationObserver.observe(document, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      const anchorElements =
        document.querySelectorAll<HTMLAnchorElement>('a[href]');
      anchorElements.forEach((anchor) =>
        anchor.removeEventListener('click', handleAnchorClick),
      );
    };
  }, []);

  // @ts-expect-error Wrong type of parameter assigned
  useEffect(() => {
    const beforeUnloadHandler = () => {
      const yes = confirm(
        'Changes you made has not been saved just yet. Do you wish to proceed anyway?',
      );

      // you can use this condition for something, example: if you have progressbar setup you might want to cancel the animation
      // if (!yes) cancelProgressbar();

      return yes;
    };
    window.onbeforeunload = unsaved ? beforeUnloadHandler : null;

    return () => (window.onbeforeunload = null);
     
  }, [unsaved]);
};
