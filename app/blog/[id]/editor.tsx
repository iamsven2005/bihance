// components/Editor.tsx
"use client";

import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from '@tiptap/extension-image'

interface Props {
  blog: string | undefined;
}

const Editor = ({ blog }: Props) => {
  const editor = useEditor({
    extensions: [StarterKit,        Highlight,
        Typography,
        Image,
    ],
    content: blog || '',
    editable: false,
  });

  return <EditorContent editor={editor} />;
};

export default Editor;
