'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

interface TiptapProps {
  content: string;
  onUpdate?: (content: string) => void;
  editable?: boolean;
}

const Tiptap = ({ content, onUpdate, editable = true }: TiptapProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content,
    editable,
    onUpdate: editable && onUpdate ? ({ editor }) => {
      const newContent = editor.getHTML();
      onUpdate(newContent);
    } : undefined,
  });

  return (
    <EditorContent editor={editor} />
  );
}

export default Tiptap;
