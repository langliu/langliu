import SnippetCard from 'components/SnippetCard'
import { Snippet, allSnippets } from 'contentlayer/generated'

async function getAllSnippets(): Promise<Snippet[]> {
  return await allSnippets
}

export default async function ListSnippets(): Promise<JSX.Element> {
  const snippets = await getAllSnippets()
  return (
    <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 my-2 w-full mt-4 max-w-3xl'>
      {snippets.map((snippet: Snippet) => (
        <SnippetCard key={snippet.slug} snippet={snippet} />
      ))}
    </div>
  )
}
