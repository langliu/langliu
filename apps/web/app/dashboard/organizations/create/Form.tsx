'use client'
import Button from '@/components/Button'
import Upload from '@/components/Upload'
// import { useFormState } from 'react-dom';
// import { CustomerField } from '@/app/lib/definitions';
import { Database } from '@/types/supabase'
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import { Form, Input, InputNumber, Select, Switch } from 'antd'
import Link from 'next/link'
// import { createInvoice } from '@/app/lib/actions';
import { createModel } from './actions'

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
          label="机构名称"
          rules={[{ required: true, message: '请输入机构名称' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name={'url'} label="机构链接">
          <Input placeholder="请输入机构链接地址" />
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
