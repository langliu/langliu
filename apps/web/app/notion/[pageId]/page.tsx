import { notion } from '@/libs/notion'
import Image from 'next/image'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

async function getData(page_id: string) {
  try {
    const result = await notion.pages.retrieve({ page_id })
    const blocks = await notion.blocks.children.list({ block_id: page_id, page_size: 10 })
    // console.log(result.results?.[0])
    // console.log(result.results?.[0]?.properties?.['出镜'])
    // console.log(result.results?.[0]?.properties?.['照片数量'])
    // console.log(result.results?.[0]?.properties?.['收集状态'])
    console.log('block', blocks.results?.[0])
    const images = blocks.results
      .filter((item) => item.type === 'image')
      .map((image) => image.image.file.url)
    return images
  } catch (error) {
    return []
  }
}
export default async function Page({ params }: { params: { pageId: string } }) {
  // console.log(params.pageId)
  const res = await getData(params.pageId)
  // console.log(res)
  return (
    <ScrollArea className="rounded-md border flex-1 h-screen">
      <div className="flex flex-col gap-4 items-center">
        De
        {res?.map((image) => (
          <Image
            alt=""
            src={image}
            width={300}
            height={600}
            key={image}
            style={{ width: '50%' }}
            loading="lazy"
          />
        ))}
      </div>
    </ScrollArea>
  )
}
