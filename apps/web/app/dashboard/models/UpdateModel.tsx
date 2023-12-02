'use client'
import Button from '@/components/Button'
import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Drawer, Form, Input, Upload } from 'antd'
import { useEffect, useState } from 'react'

import { updateModel } from './services'
import { UploadChangeParam, UploadFile } from 'antd/es/upload'

export interface CreateModelProps {
  record?: any
}

export default function UpdateModel({ record }: CreateModelProps) {
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()
  const supabase = createClientComponentClient()

  const handleUpload = async (info: UploadChangeParam<UploadFile<any>>) => {
    console.log(info)
    const { data, error } = await supabase.storage
      .from('langliu')
      .upload(`avatar/${info.file.name}`, info.file.originFileObj)
    if (!error) {
      form.setFieldValue('avatar', data.path)
    }
  }

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
        <EditOutlined className='pr-2' />
        编辑
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
          <Form.Item label='头像' name={'avatar'} valuePropName='file'>
            <Upload onChange={handleUpload}>
              <div className='w-16 h-16 bg-slate-200 flex items-center justify-center flex-col'>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  )
}
