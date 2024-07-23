import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import Link from "next/link";

const Blogs = async () => {
    const blogs = await db.blog.findMany()
    return (
        <Card className="bg-base-300 text-base-content">
            <CardHeader>
                <CardTitle>
                    Blogs
                </CardTitle>
            </CardHeader>
            {blogs.map((blog) => (
                <Link href={`/blog/${blog.id}`} key={blog.id} className="m-5">
                    <CardContent className="flex gap-2 flex-col rounded-xl bg-base-100 p-5 m-5 shadow-xl">

                        <CardTitle>{blog.title}</CardTitle>
                        <CardDescription>
                            {blog.createdAt.toDateString()}
                        </CardDescription>
                    </CardContent>

                </Link>
            ))}

        </Card>
    );
}

export default Blogs;