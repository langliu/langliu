import { supabase } from '@/libs/supabaseClient';

export async function getData() {
  const { data, error } = await supabase.from('countries').select();
  return { data, error };
}
export default async function Page() {
  const { data } = await getData();
  console.table(data);

  const onClick = async () => {
    const { data, error } = await supabase
      .from('countries')
      .insert([{ name: 'someValue', asd: 'otherValue' }]);
  };

  const signWithGithub = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
    });
    console.log(data);
  };
  return (
    <div>
      <h1>Countries</h1>
      {/* <button type="button" onClick={onClick}>
        插入数据
      </button>

      <button type="button" onClick={signWithGithub}>
        Github登录
      </button> */}
    </div>
  );
}
