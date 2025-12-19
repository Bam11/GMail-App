import { forwardRef, useImperativeHandle } from "react";
import { EditorContent, useEditor, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import FontFamily from "@tiptap/extension-font-family";
import EditorToolbar from "./editor-toolbar"
import { FontSize } from "~/lib/fontSize";
import Image from "@tiptap/extension-image";

type Props = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  showFormatting: boolean;
};

const MailEditor = forwardRef<Editor | null, Props>(
  ({ value, onChange, showFormatting }, ref) => {
    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          blockquote: {},
          bulletList: {},
          orderedList: {},
          listItem: {},
        }),
        Image.configure({
          inline: true,
          allowBase64: false,
        }),
        Underline,
        TextStyle,
        FontSize,
        Color,
        FontFamily,
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
      ],
      content: value,
      onUpdate({ editor }) {
        onChange(editor.getHTML());
      },
    });

    useImperativeHandle(ref, () => editor, [editor]);

    if (!editor) return null;

    return (
      <div className="relatuve h-full">
        {showFormatting && (
          <EditorToolbar editor={editor} />
        )}

        <EditorContent
          editor={editor}
          className="p-1 h-68 overflow-y-auto text-sm outline-none"
        />
      </div>
    );
  }
);

export default MailEditor;