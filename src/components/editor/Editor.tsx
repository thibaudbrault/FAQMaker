import '@uiw/react-md-editor/markdown-editor.css';

import dynamic from 'next/dynamic';
import rehypeSanitize from 'rehype-sanitize';

import { useMediaQuery } from '@/hooks';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

type Props = {
  onChange: (...event: any[]) => void;
  value: string;
};

export const Editor = ({ onChange, value }: Props) => {
  const isDesktop = useMediaQuery('(min-width: 640px)');

  return (
    <div className="w-full">
      <MDEditor
        className="[a_.w-md-toolbar]:dark:!bg-negativeOffset !w-full !rounded-md border !border-accent !bg-offset !shadow-none dark:!bg-negativeOffset dark:!text-negative"
        value={value}
        preview={isDesktop ? 'live' : 'edit'}
        onChange={onChange}
        height={300}
        previewOptions={{
          rehypePlugins: [[rehypeSanitize]],
        }}
      />
    </div>
  );
};
