import Image from 'next/image'
import { notion } from '@/libs/notion'
import { ScrollArea } from '@/components/ui/scroll-area'

async function getData(page_id: string) {
  try {
    const result = await notion.pages.retrieve({ page_id })
    const blocks = await notion.blocks.children.list({ block_id: page_id, page_size: 10 })
    const images = blocks.results
      .filter((item) => item?.type === 'image')
      .map((image) => image.image.file.url)
    return {
      title: result['properties']['Name']['title'][0]['plain_text'],
      images,
    }
  } catch (error) {}
}
export default async function Page({ params }: { params: { pageId: string } }) {
  const res = await getData(params.pageId)
  return (
    <ScrollArea className="rounded-md border flex-1 h-screen w-screen">
      <div className="flex flex-col gap-2 md:gap-4 items-center">
        <h2 className="mt-4 text-lg font-bold text-ellipsis overflow-hidden whitespace-nowrap max-w-[100vw]">
          {res?.title}
        </h2>
        {res?.images?.map((image) => (
          <Image
            alt=""
            src={image}
            width={300}
            height={600}
            key={image}
            className="w-full xl:w-[50%]"
            loading="lazy"
          />
        ))}
      </div>
    </ScrollArea>
  )
}
