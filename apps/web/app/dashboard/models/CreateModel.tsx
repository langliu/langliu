'use client'
import Button from '@/components/Button'
import { PlusOutlined } from '@ant-design/icons'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Drawer, Form, Input } from 'antd'
import { useState } from 'react'

import { createModel } from './services'

export interface CreateModelProps {
  name?: string
}

export default function CreateModel({ name }: CreateModelProps) {
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()

  const supabase = createClientComponentClient()

  const handleSubmit = () => {
    form
      .validateFields()
      .then(createModel)
      .then((value) => {
        if (value) {
          setOpen(false)
          form.resetFields()
        }
      })
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusOutlined className='pr-2' />
        添加
      </Button>
      <Drawer
        title='新增模特'
        width={600}
        placement='right'
        onClose={() => setOpen(false)}
        open={open}
        extra={<Button onClick={handleSubmit}>提交</Button>}
      >
        <Form form={form} layout='vertical'>
          <Form.Item
            label='名称'
            name={'username'}
            rules={[{ required: true, message: '请输入模特名称' }]}
          >
            <Input placeholder='请输入模特名称' />
          </Form.Item>
          <Form.Item label='个人主页' name={'homepage'}>
            <Input placeholder='请输入模特的个人主页' />
          </Form.Item>
          <Form.Item label='X' name={'twitter'}>
            <Input placeholder='请输入模特在X的用户ID' addonBefore='https://twitter.com/' />
          </Form.Item>
          <Form.Item label='Instagram' name={'instagram'}>
            <Input
              placeholder='请输入模特在微博的用户ID'
              addonBefore='https://www.instagram.com/'
            />
          </Form.Item>
          <Form.Item label='微博' name={'weibo'}>
            <Input placeholder='请输入模特在微博的用户ID' addonBefore='https://weibo.com/u/' />
          </Form.Item>
          <Form.Item label='头像' name={'avatar'}>
            <Input placeholder='请输入模特的头像地址' />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  )
}
