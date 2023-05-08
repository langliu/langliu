'use client';
import { Button, Form, Input, Switch, message } from 'antd';
import React from 'react';
import { supabase } from '../../../libs/supabaseClient';

const CreateBook = () => {
  const [form] = Form.useForm();

  const createBook = async () => {
    try {
      const formData = await form.validateFields();
      const { data, error } = await supabase.from('books').insert({
        ...formData,
      });
      if (error) {
        message.error(error.message);
      } else {
        message.success('新建成功');
      }
    } catch (error) {}
  };

  return (
    <div>
      <Form form={form} onFinish={createBook}>
        <Form.Item
          label="书籍名称"
          name={'name'}
          rules={[{ required: true, message: '请输入书籍名称' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="书籍作者" name={'author'}>
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="是否完结" name={'end'}>
          <Switch checkedChildren="完结" unCheckedChildren="连载" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" block htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateBook;
