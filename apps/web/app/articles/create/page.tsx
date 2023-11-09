'use client'
import { supabase } from '../../../libs/supabaseClient'
import { useDebounceFn } from 'ahooks'
import { Button, Collapse, Form, Input, InputNumber, message } from 'antd'
import { Metadata } from 'next'
import { unstable_noStore as noStore } from 'next/cache'
import { useSearchParams } from 'next/navigation'
import React, { ChangeEventHandler, useMemo, useState } from 'react'

async function insertArticle(params: {
  bookId: number
  content: string
  title: string
  serial: number
}) {
  noStore()
  const { data, error } = await supabase.from('articles').insert([params]).select()
  return { data, error }
}

export default function CreateBook() {
  const searchParams = useSearchParams()
  const [content, setContent] = useState<string>('')
  const [form] = Form.useForm()
  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0]
    console.log(file)
    if (file) {
      const reader = new FileReader()
      reader.readAsText(file, 'gbk')
      reader.onload = () => {
        console.log(reader.result)
        setContent(reader.result as string)
      }
    }
  }
  console.log('search', searchParams.values())

  const title = useMemo(() => {
    const titles = content.match(/第.+章、.+\r/g)
    const contexts = content.split(/第.+章、.+\r/g)
    return titles?.map((item, index) => ({
      serial: index + 1,
      title: item,
      context: contexts[index + 1],
    }))
  }, [content])

  const { run: handleSubmit } = useDebounceFn(
    async () => {
      try {
        const formData = form.getFieldsValue()
        console.log({ ...formData, bookId: Number(searchParams.get('bookId')) })
        const resp = await insertArticle({
          ...formData,
          bookId: Number(searchParams.get('bookId')),
        })
        console.warn('res', resp)
        if (resp.error) {
          message.error(resp.error.message)
        } else {
          message.success('新建成功')
          form.setFieldsValue({
            serial: formData.serial + 1,
            title: undefined,
            content: undefined,
          })
        }
      } catch (error) {}
    },
    {
      wait: 1000,
    },
  )

  return (
    <div className='pt-8 px-8'>
      <h1 className='text-2xl mb-6'>新建章节</h1>
      <Form form={form} labelCol={{ span: 3 }} onFinish={handleSubmit}>
        <Form.Item
          label='章节序号'
          name={'serial'}
          rules={[{ required: true, message: '请输入章节序号' }]}
        >
          <InputNumber className='w-full' placeholder='请输入章节序号' />
        </Form.Item>
        <Form.Item label='标题' name={'title'} rules={[{ required: true, message: '请输入标题' }]}>
          <Input placeholder='请输入标题' />
        </Form.Item>
        <Form.Item
          label='章节内容'
          name={'content'}
          rules={[{ required: true, message: '请输入章节内容' }]}
        >
          <Input.TextArea rows={15} placeholder='请输入章节内容' />
        </Form.Item>
        <Form.Item>
          <Button htmlType='submit' block type='primary'>
            提交
          </Button>
        </Form.Item>
      </Form>
      CreateBook
      {/* <input type='file' placeholder='请选择文件' title='文件上传' onChange={handleFileChange} />
      <div>
        {title?.length}
        <Collapse>
          {title?.map((item) => (
            <Collapse.Panel header={item.title} key={item.serial}>
              <p>{item.context}</p>
            </Collapse.Panel>
          ))}
        </Collapse>
      </div> */}
    </div>
  )
}
