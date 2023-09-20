import '@uiw/react-md-editor/markdown-editor.css';

import dynamic from 'next/dynamic';
import rehypeSanitize from 'rehype-sanitize';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

type Props = {
  onChange: (...event: any[]) => void;
  value: string;
  prevAnswer: string;
};

export const Editor = ({ onChange, value, prevAnswer }: Props) => {
  return (
    <div className="w-full">
      <MDEditor
        className="!w-full !rounded-md border border-teal-700 !bg-white"
        value={value ?? prevAnswer}
        onChange={onChange}
        height={300}
        previewOptions={{
          rehypePlugins: [[rehypeSanitize]],
        }}
      />
    </div>
  );
};
