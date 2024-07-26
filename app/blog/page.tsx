import { BlogPosts } from "@/components/posts";

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-3xl font-semibold tracking-tighter">
        What intrests you?
      </h1>
      <p className="mb-4">
        {`Bihance, short for Business Enhanced aims to create solutions that enhances your business operations. We are a small startup that aims to solve current easy to solve pressing issues at scale in a cost effective manner.
        From our blogs we hope that you can leverage our services to enhance your business or just to better understand who we are.`}
      </p>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  )
}