import type { CodeBlockEditorDescriptor } from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
const {
  MDXEditor,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  CreateLink,
  codeBlockPlugin,
  headingsPlugin,
  listsPlugin,
  linkPlugin,
  linkDialogPlugin,
  quotePlugin,
  markdownShortcutPlugin,
  useCodeBlockEditorContext,
} = await import('@mdxeditor/editor');

const PlainTextCodeEditorDescriptor: CodeBlockEditorDescriptor = {
  match: () => true,
  priority: 0,
  Editor: (props) => {
    const cb = useCodeBlockEditorContext();
    return (
      <div onKeyDown={(e) => e.nativeEvent.stopImmediatePropagation()}>
        <textarea
          rows={3}
          cols={20}
          defaultValue={props.code}
          onChange={(e) => cb.setCode(e.target.value)}
        />
      </div>
    );
  },
};

type Props = {
  className: string;
};

export const Editor = ({ className }: Props) => {
  return (
    <MDXEditor
      className={className}
      onChange={console.log}
      markdown={'Hello world!'}
      plugins={[
        codeBlockPlugin({
          codeBlockEditorDescriptors: [PlainTextCodeEditorDescriptor],
        }),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              {' '}
              <UndoRedo />
              <BoldItalicUnderlineToggles />
              <CreateLink />
            </>
          ),
        }),
        headingsPlugin(),
        listsPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        quotePlugin(),
        markdownShortcutPlugin(),
      ]}
    />
  );
};
