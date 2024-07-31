import { BlogPosts } from "@/components/posts";
import { getBlogPosts } from "./utils";
//fs is taken on the server side, so a client component desBlog, brings format date to the server
export default function Page() {
  let allBlogs = getBlogPosts()
  return (
    <section className="m-5 p-5">
      <h1 className="mb-8 text-3xl font-semibold tracking-tighter">
        What intrests you?
      </h1>
      <p className="mb-4">
        {`Bihance, short for Business Enhanced aims to create solutions that enhances your business operations. We are a small startup that aims to solve current easy to solve pressing issues at scale in a cost effective manner.
        From our blogs we hope that you can leverage our services to enhance your business or just to better understand who we are.`}
      </p>
      <div className="my-8">
        <BlogPosts allblogs={allBlogs}/>
      </div>
    </section>
  )
}