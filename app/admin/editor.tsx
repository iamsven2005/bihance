"use client";

import { Editor } from '@tiptap/react';

interface Props {
  editor: Editor
}

const MenuBar = ({ editor }: Props) => {
  if (!editor) {
    return null;
  }

  const addImageFromUrl = () => {
    const url = window.prompt('URL');

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result as string;
        editor.chain().focus().setImage({ src: url }).run();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="control-group">
      <div className="button-group">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`btn ${editor.isActive('bold') ? 'is-active' : ''}`}
          type="button"
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`btn ${editor.isActive('italic') ? 'is-active' : ''}`}
          type="button"
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`btn ${editor.isActive('strike') ? 'is-active' : ''}`}
          type="button"
        >
          Strike
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={`btn ${editor.isActive('code') ? 'is-active' : ''}`}
          type="button"
        >
          Code
        </button>
        <button onClick={() => editor.chain().focus().unsetAllMarks().run()} className="btn" type="button">
          Clear marks
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`btn ${editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}`}
          type="button"
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`btn ${editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}`}
          type="button"
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`btn ${editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}`}
          type="button"
        >
          H3
        </button>

        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`btn ${editor.isActive('codeBlock') ? 'is-active' : ''}`}
          type="button"
        >
          Code block
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`btn ${editor.isActive('blockquote') ? 'is-active' : ''}`}
          type="button"
        >
          Blockquote
        </button>
        <button onClick={() => editor.chain().focus().setHorizontalRule().run()} className="btn" type="button">
          Block
        </button>
        <button onClick={() => editor.chain().focus().setHardBreak().run()} className="btn" type="button">
          Space
        </button>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="btn"
          type="button"
        >
          Undo
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="btn"
          type="button"
        >
          Redo
        </button>
        <button
          onClick={() => editor.chain().focus().setColor('#958DF1').run()}
          className={editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''}
          type="button"
        >
          Purple
        </button>
        <button onClick={addImageFromUrl} className='btn'>Add image from URL</button>
      </div>
    </div>
  );
};

export default MenuBar;
