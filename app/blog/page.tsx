import { BlogPosts } from "@/components/posts";
export default function Page() {
  return (
    <section className="m-5 p-5">
      <h1 className="mb-8 text-3xl font-semibold tracking-tighter">
        What interests you?
      </h1>
      <p className="mb-4">
        {`At Bihance, short for Business Enhanced, we aim to create solutions that enhances your business operations. Founded in 2024, our mission is to empower businesses with innovative automation tools that streamline operations, boost efficiency, and drive growth.`}
      </p>
      <div className="my-8">
        <BlogPosts/>
      </div>
    </section>
  )
}