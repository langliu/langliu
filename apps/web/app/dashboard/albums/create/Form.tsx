'use client'
import { createModel } from './actions'
import Button from '@/components/Button'
import Upload from '@/components/Upload'
import type { Database } from '@/types/supabase'
import { Form, Input, InputNumber, Select, Switch } from 'antd'
import Link from 'next/link'

type CreateAlbum = Database['public']['Tables']['albums']['Insert']

export default function AlbumForm({
  models,
}: { models: Database['public']['Tables']['models']['Row'][] }) {
  const initialState: CreateAlbum = {
    video_num: 0,
    collected: false,
    picture_num: 0,
  }
  const [form] = Form.useForm<CreateAlbum>()

  const handleFormSubmit = () => {
    form.validateFields().then((formData) => {
      console.table(formData)
      createModel(formData)
    })
  }

  return (
    <Form form={form} layout="vertical" initialValues={initialState} onFinish={handleFormSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <Form.Item name="cover" label="专辑封面">
          <Upload />
        </Form.Item>
        <Form.Item
          name={'name'}
          label="专辑名称"
          rules={[{ required: true, message: '请输入专辑名称' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name={'models'} label="模特" rules={[{ required: true, message: '请选择模特' }]}>
          <Select
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
        <Form.Item label="收集状态" name={'collected'}>
          <Switch />
        </Form.Item>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/albums"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          取消
        </Link>
        <Button type="submit">新建专辑</Button>
      </div>
    </Form>
  )
}
