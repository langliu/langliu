import React from 'react';
import Link from 'next/link';
import { supabase } from '../../libs/supabaseClient';
import styles from './page.module.css';

export async function getData() {
  const { data } = await supabase.from('books').select('*');
  return data;
}

const Page = async () => {
  const data = await getData();

  return (
    <div>
      <h1>书籍📕</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>书名</th>
            <th>作者</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((country) => (
            <tr key={country.id}>
              <td> {country.name}</td>
              <td> {country.author ?? '未知'}</td>
              <td>
                <Link href={`/books/${country.id}`}>查看</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Page;
