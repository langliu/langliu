'use client';
import React, { FC, ChangeEventHandler, useState, useMemo } from 'react';
import { Collapse } from 'antd';

const CreateBook: FC = () => {
  const [content, setContent] = useState<string>('');

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    console.log(file);
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file, 'gbk');
      reader.onload = () => {
        console.log(reader.result);
        setContent(reader.result as string);
      };
    }
  };
  const title = useMemo(() => {
    const titles = content.match(/第.+章、.+\r/g);
    const contexts = content.split(/第.+章、.+\r/g);
    return titles?.map((item, index) => ({
      serial: index + 1,
      title: item,
      context: contexts[index + 1],
    }));
  }, [content]);

  return (
    <div>
      CreateBook
      <input
        type="file"
        placeholder="请选择文件"
        title="文件上传"
        onChange={handleFileChange}
      />
      <div>
        {title?.length}
        <Collapse>
          {title?.map((item) => (
            <Collapse.Panel header={item.title} key={item.serial}>
              <p>{item.context}</p>
            </Collapse.Panel>
          ))}
        </Collapse>
      </div>
    </div>
  );
};

export default CreateBook;
