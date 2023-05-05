import Link from 'next/link';
import { supabase } from 'apps/web/libs/supabaseClient';

type Props = {
  params: {
    slug: string;
  };
};

export async function getData(bookId: string) {
  const { data, error } = await supabase
    .from('articles')
    .select('id,title,serial,bookId')
    .eq('bookId', bookId);
  return data;
}

export default async function Page({ params }: Props) {
  const { slug } = params;
  const data = await getData(slug);

  return (
    <div>
      My Post
      <ul>
        {data?.map((country) => (
          <li key={country.id}>
            <Link href={`/articles/${country.id}`}>{country.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
