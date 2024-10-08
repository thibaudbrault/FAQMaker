import { useWarnIfUnsavedChanges } from '@/hooks';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/alert/Alert';

type Props = {
  isDirty: boolean;
};

export const PageChangeAlert = ({ isDirty }: Props) => {
  const { showDialog, setShowDialog, nextUrl, setNextUrl } =
    useWarnIfUnsavedChanges(isDirty);

  const handleConfirm = () => {
    if (nextUrl) {
      window.onbeforeunload = null;
      window.location.href = nextUrl;
    }
    setShowDialog(false);
    setNextUrl(null);
  };

  const handleCancel = () => {
    setShowDialog(false);
  };

  if (!showDialog) return null;
  return (
    <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to leave this page ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            You have made changes that have not been saved. If you choose to
            leave this page, any unsaved progress will be permanently lost.{' '}
            <br /> Would you like to continue without saving ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={handleCancel}
            style={{ fontVariant: 'small-caps' }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleConfirm}
            style={{ fontVariant: 'small-caps' }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
