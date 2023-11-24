'use client'
import Button from '@/components/Button'
import { Form, Input, Switch, message } from 'antd'
import React from 'react'

import { createBook } from '../actions'

const CreateBook = () => {
  const [form] = Form.useForm()

  const handleCreateBook = async () => {
    try {
      const formData = await form.validateFields()
      await createBook(formData)
      message.success('新建成功')
    } catch (error) {
      message.error(error?.message)
    }
  }

  return (
    <div className='px-10 pt-6'>
      <Form form={form} onFinish={handleCreateBook}>
        <Form.Item
          label='书籍名称'
          name={'name'}
          rules={[{ required: true, message: '请输入书籍名称' }]}
        >
          <Input placeholder='请输入' />
        </Form.Item>
        <Form.Item label='书籍作者' name={'author'}>
          <Input placeholder='请输入' />
        </Form.Item>
        <Form.Item label='是否完结' name={'end'}>
          <Switch checkedChildren='完结' unCheckedChildren='连载' />
        </Form.Item>
        <Form.Item>
          <Button type='submit' block>提交</Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default CreateBook
