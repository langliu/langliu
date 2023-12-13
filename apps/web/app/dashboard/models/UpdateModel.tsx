'use client'
import Button from '@/components/Button'
import Upload from '@/components/Upload'
import { Database } from '@/types/supabase'
import { EditOutlined } from '@ant-design/icons'
import { Drawer, Form, Input } from 'antd'
import { useEffect, useState } from 'react'

import { updateModel } from './services'

export interface CreateModelProps {
  record: Database['public']['Tables']['models']['Row']
}

export default function UpdateModel({ record }: CreateModelProps) {
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()

  const handleSubmit = () => {
    console.warn('record', record)
    form
      .validateFields()
      .then((value) => updateModel(record.id, value))
      .then((value) => {
        if (value) {
          setOpen(false)
          form.resetFields()
        }
      })
  }

  useEffect(() => {
    form.setFieldsValue(record)
    return () => {
      form.resetFields()
    }
  }, [record, form])

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <EditOutlined className="pr-2" />
        编辑
      </Button>
      <Drawer
        title="新增模特"
        width={600}
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
        extra={<Button onClick={handleSubmit}>提交</Button>}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="名称"
            name={'username'}
            rules={[{ required: true, message: '请输入模特名称' }]}
          >
            <Input placeholder="请输入模特名称" />
          </Form.Item>
          <Form.Item label="个人主页" name={'homepage'}>
            <Input placeholder="请输入模特的个人主页" />
          </Form.Item>
          <Form.Item label="X" name={'twitter'}>
            <Input placeholder="请输入模特在X的链接" />
          </Form.Item>
          <Form.Item label="Instagram" name={'instagram'}>
            <Input placeholder="请输入模特在微博的链接" />
          </Form.Item>
          <Form.Item label="微博" name={'weibo'}>
            <Input placeholder="请输入模特在微博的链接" />
          </Form.Item>
          <Form.Item label="头像" name={'avatar'}>
            <Upload />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  )
}
