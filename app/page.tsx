import Link from 'next/link'
import { createClient } from 'edgedb'
import e from '@/dbschema/edgeql-js'
import { AuthLinks } from '@/components/auth-links'

const client = createClient()

export default async function Home() {
  const postsQuery = e.select(e.BlogPost, () => ({
    id: true,
    title: true,
    content: true,
  }))

  const posts = await postsQuery.run(client)
  return (
    <div className="container mx-auto p-4 bg-black text-white">
      <h1 className="text-3xl font-bold mb-4">Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id} className="mb-4">
            <Link href={`/post/${post.id}`} className="text-blue-500">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href="/post/new"
        className="bg-blue-500 text-white px-4 py-2 rounded inline-block mt-4"
      >
        Create New Post
      </Link>
      <AuthLinks />
    </div>
  )
}
