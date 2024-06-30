import { createClient } from 'edgedb'
import e from '@/dbschema/edgeql-js'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const client = createClient()

async function createPost(formData: FormData) {
  'use server'

  const title = formData.get('title') as string
  const content = formData.get('content') as string

  const newPost = await e
    .insert(e.BlogPost, {
      title: title,
      content: content,
      author: e.global.current_user,
    })
    .run(client)

  redirect(`/post/${newPost.id}`)
}

export default function NewPost() {
  return (
    <div className="container mx-auto p-4 bg-black text-white">
      <nav>
        <Link href="/" className="text-blue-500 mb-4 block" replace>
          Back to list
        </Link>
      </nav>
      <h1 className="text-3xl font-bold mb-4">Create New Post</h1>
      <form action={createPost}>
        <div className="mb-4">
          <label htmlFor="title" className="block mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="w-full p-2 text-black"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block mb-2">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            required
            className="w-full p-2 h-32 text-black"
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Post
        </button>
      </form>
    </div>
  )
}
