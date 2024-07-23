"use client"
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Image from "@tiptap/extension-image";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import MenuBar from "./editor";
import "./styles.css"
import Link from "next/link";

const BlogForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Color,
      TextStyle,
      Image,
    ],
    content: '',
    onUpdate: ({ editor }) => {
      setDescription(editor.getHTML());
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });

      if (res.ok) {
        setTitle('');
        editor?.commands.clearContent();
        setSuccess(true);
      } else {
        const errorData = await res.json();
        setError(errorData.message);
      }
    } catch (error) {
      setError('Something went wrong');
    }

    setLoading(false);
  };

  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <Card className="bg-base-100 text-base-content">
    <Link href="/blog"className="btn btn-link">
    Blogs
    </Link>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <Input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Title"
            className="mb-4"
          />
          <MenuBar editor={editor} />
          <EditorContent editor={editor} className="border p-2 mt-2 text-base-content" />
        </CardContent>
        <CardFooter>
          <button type="submit" disabled={loading} className="btn btn-outline">
            {loading ? 'Submitting...' : 'Submit'}
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>Blog post created successfully!</p>}
        </CardFooter>
      </form>
    </Card>
  );
};

export default BlogForm;
