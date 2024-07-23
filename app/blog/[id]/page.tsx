// app/blog/[id]/page.tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { db } from '@/lib/db';
import dynamic from 'next/dynamic';

interface Props {
  params: {
    id: string;
  };
}

const BlogPage = async ({ params }: Props) => {
  const blog = await db.blog.findFirst({
    where: {
      id: params.id,
    },
  });

  // Dynamically import the Editor component with no SSR
  const Editor = dynamic(() => import('./editor'), { ssr: false });

  return (
    <Card className="bg-base-200 text-base-content">
      <CardHeader>
        <CardTitle>{blog?.title}</CardTitle>
        <CardDescription>{blog?.createdAt.toDateString()}</CardDescription>
      </CardHeader>
      <CardContent>
        <CardDescription>
          {blog?.description ? <Editor blog={blog.description} /> : <p>No content available</p>}
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Link href="/blog" className="btn btn-outline">
          Blog
        </Link>
      </CardFooter>
    </Card>
  );
};

export default BlogPage;
