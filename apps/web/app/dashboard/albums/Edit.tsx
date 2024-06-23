'use client'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/components/ui/use-toast'
import Upload from '@/components/Upload'
import { createClient } from '@/libs/supabase/client'
import { EditIcon } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDebounceFn, useRequest } from 'ahooks'
import { Button, Drawer, Form, Input, InputNumber, Select, Switch } from 'antd'
import type { Database } from '@/types/supabase'

async function getAlbumDetail(id: number | string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('albums')
    .select('*, models(*)')
    .eq('id', id)
    .maybeSingle()
  if (error) {
    throw new Error(error.message)
  }
  return data
}

async function updateAlbum(params: Record<string, unknown>, id: number | string) {
  const supabase = createClient()
  const { models = [], ...postData } = params
  const { data, error } = await supabase.from('albums').update(postData).eq('id', id)
  if (error) {
    throw new Error(error.message)
  }
  const modelsAlbums = await supabase.from('models_albums').select().eq('album_id', id)
  const preModels = modelsAlbums.data?.map((item) => item.model_id) ?? []
  /** 需要删除的 */
  const needDel = preModels?.filter((item) => !(models ?? [])?.includes(item))
  /** 需要添加的 */
  const needAdd = models?.filter((item) => !preModels.includes(item)) ?? []
  await Promise.all(
    needDel.map((item) =>
      supabase.from('models_albums').delete().match({
        model_id: item,
        album_id: id,
      }),
    ),
  )
  await supabase
    .from('models_albums')
    .insert(needAdd.map((item) => ({ model_id: item, album_id: id })))
  return data
}

export default function Edit({
  id,
  models = [],
}: { id: string | number; models: Database['public']['Tables']['models']['Row'][] }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const [form] = Form.useForm()
  const { toast } = useToast()
  const { data } = useRequest(() => (open ? getAlbumDetail(id) : Promise.resolve(null)), {
    cacheKey: `album_detail${id}`,
    onSuccess: (data) => {
      form.setFieldsValue({ ...data, models: data?.models.map((model) => model.id) })
    },
    refreshDeps: [open],
  })

  const { run, loading: submitLoading } = useRequest(updateAlbum, {
    manual: true,
    onSuccess: () => {
      handleSuccess()
    },
    onError: (e) => {
      toast({ title: '编辑错误', description: e.message })
    },
  })

  const { run: handleSubmit } = useDebounceFn(
    async () => {
      try {
        const formData = await form.validateFields()
        run(formData, id)
      } catch (error) {}
    },
    {
      wait: 1000,
    },
  )

  const handleSuccess = () => {
    setOpen(false)
    router.refresh()
  }

  return (
    <>
      <Button size="small" type="default" className="ml-auto gap-1.5" onClick={() => setOpen(true)}>
        <EditIcon className="size-3.5" />
        编辑
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        classNames={{
          body: 'flex flex-col',
        }}
        title={'编辑专辑'}
        extra={
          <Button type="primary" onClick={handleSubmit} loading={submitLoading}>
            保持更改
          </Button>
        }
      >
        <ScrollArea className="flex-1">
          <Form form={form} layout="vertical">
            <Form.Item
              name={'name'}
              label={'专辑名称'}
              rules={[{ required: true, message: '请输入专辑名称' }]}
            >
              <Input placeholder="请输入专辑名称" />
            </Form.Item>
            <Form.Item
              name={'models'}
              label="模特"
              rules={[{ required: true, message: '请选择模特' }]}
            >
              <Select
                optionFilterProp="label"
                mode="multiple"
                options={models.map((model) => ({ label: model.username, value: model.id }))}
                onChange={(v) => {
                  console.log(v)
                }}
              />
            </Form.Item>
            <Form.Item
              label="照片数量"
              name={'picture_num'}
              rules={[
                { required: true, message: '请输入照片数量' },
                { type: 'integer', min: 0, max: 500, message: '照片数量取值范围为0~500' },
              ]}
            >
              <InputNumber className="w-full" placeholder="请输入照片数量" />
            </Form.Item>
            <Form.Item
              label="视频数量"
              name={'video_num'}
              rules={[
                { required: true, message: '请输入视频数量' },
                { type: 'integer', min: 0, max: 50, message: '视频数量取值范围为0~50' },
              ]}
            >
              <InputNumber className="w-full" placeholder="请输入视频数量" />
            </Form.Item>
            <Form.Item label="是否收藏" name={'collected'} valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name="cover" label="专辑封面">
              <Upload />
            </Form.Item>
          </Form>
        </ScrollArea>
      </Drawer>
    </>
  )
}
