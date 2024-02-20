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
        className="!w-full !rounded-md !bg-gray-3 !text-gray-12 !shadow-sm [&_.w-md-editor-toolbar]:!rounded-t-md [&_.w-md-editor-toolbar]:!bg-gray-2"
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
