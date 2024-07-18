'use client';

import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface TiptapProps {
  content: string;
  onUpdate?: (content: string) => void;
  editable?: boolean;
}

const Tiptap = ({ content, onUpdate, editable = true }: TiptapProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editable,
    onUpdate: ({ editor }) => {
      if (onUpdate) {
        onUpdate(editor.getHTML());
      }
    },
  });

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return <EditorContent editor={editor} />;
};

export default Tiptap;
