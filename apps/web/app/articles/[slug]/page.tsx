import { supabase } from 'apps/web/libs/supabaseClient';
import styles from './page.module.css';

type Props = {
  params: {
    slug: string;
  };
};

export async function getData(id: string) {
  const { data } = await supabase
    .from('articles')
    .select('id,title,content')
    .eq('id', id);
  return data?.[0];
}

export default async function Page({ params }: Props) {
  const { slug } = params;
  const data = await getData(slug);

  const pa = (content: string) => {
    const arr = content?.split('\n') ?? [];
    return (
      <>
        {arr.map((item) => (
          <p key={item} style={{ marginBottom: 12, fontSize: '1.1rem' }}>
            {item.trim()}
          </p>
        ))}
      </>
    );
  };
  return (
    <div className={styles.content}>
      <h1>{data?.title}</h1>
      <div key={data?.id}>{pa(data?.content)}</div>
    </div>
  );
}
