import { notion } from '@/libs/notion'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import NextButton from './(components)/NextButton'

async function getData(start_cursor?: string) {
  try {
    const result = await notion.databases.query({
      database_id: 'd976f7f856e24e65806247963435971e',
      page_size: 10,
      start_cursor,
    })

    return {
      list: result.results,
      hasMore: result.has_more,
      nextCursor: result.next_cursor,
    }
  } catch (error) {
    return {}
  }
}

export default async function Page({ searchParams }: { searchParams: { nextCursor?: string } }) {
  const res = await getData(searchParams.nextCursor)
  return (
    <div>
      <Navbar />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>名称</TableHead>
            <TableHead>出境</TableHead>
            <TableHead>机构</TableHead>
            <TableHead>照片数量</TableHead>
            <TableHead>视频数量</TableHead>
            <TableHead>收集状态</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {res?.list?.map((album) => (
            <TableRow key={album.id}>
              <TableCell>
                <Link href={`/notion/${album.id}`}>
                  {album?.properties?.Name?.['title']?.[0]?.['plain_text']}
                </Link>
              </TableCell>
              <TableCell>{album?.properties?.Name?.['title']?.[0]?.['plain_text']}</TableCell>
              <TableCell>{album?.properties?.Name?.['title']?.[0]?.['plain_text']}</TableCell>
              <TableCell>{album?.properties?.['照片数量']?.['number'] ?? 0}</TableCell>
              <TableCell>{album?.properties?.['视频数量']?.['number'] ?? 0}</TableCell>
              <TableCell>{album?.properties?.['收集状态']?.['status']?.['name']}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {res?.hasMore && <NextButton nextCursor={res?.nextCursor} />}
    </div>
  )
}
