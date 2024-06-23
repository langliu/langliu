'use client'
import { createModel } from './actions'
import Upload from '@/components/Upload'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Database } from '@/types/supabase'
import { Button, Drawer, Form, Input, InputNumber, Select, Switch } from 'antd'
import { EditIcon } from 'lucide-react'
import { useState } from 'react'
import { useRequest } from 'ahooks'
import { useRouter } from 'next/navigation'

type CreateAlbum = Database['public']['Tables']['albums']['Insert']

export default function AlbumForm({
  models,
}: { models: Database['public']['Tables']['models']['Row'][] }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const initialState: CreateAlbum = {
    video_num: 0,
    collected: false,
    picture_num: 0,
  }
  const [form] = Form.useForm<CreateAlbum>()
  const { run, loading } = useRequest(createModel, {
    manual: true,
    debounceWait: 500,
    onSuccess: () => {
      form.resetFields()
      setOpen(false)
      router.refresh()
    },
  })

  const handleFormSubmit = () => {
    form.validateFields().then((formData) => {
      console.table(formData)
      run(formData)
    })
  }

  return (
    <>
      <Button
        type="default"
        className="ml-auto gap-1.5"
        onClick={() => setOpen(true)}
        icon={<EditIcon className="size-3.5" />}
      >
        新建专辑
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        classNames={{
          body: 'flex flex-col',
        }}
        title={'新建专辑'}
        extra={
          <Button onClick={handleFormSubmit} loading={loading}>
            提交
          </Button>
        }
      >
        <ScrollArea className="flex-1">
          <Form form={form} layout="vertical" initialValues={initialState}>
            <Form.Item
              name={'name'}
              label="专辑名称"
              rules={[{ required: true, message: '请输入专辑名称' }]}
            >
              <Input />
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
              />
            </Form.Item>
            <Form.Item
              name={'picture_num'}
              label="图片数量"
              rules={[{ required: true, message: '请输入图片数量' }]}
            >
              <InputNumber step={1} min={0} className="w-full" />
            </Form.Item>
            <Form.Item name={'video_num'} label="视频数量">
              <InputNumber step={1} min={0} className="w-full" />
            </Form.Item>
            <Form.Item label="收集状态" name={'collected'} valuePropName="checked">
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
