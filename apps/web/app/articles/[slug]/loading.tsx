export default async function Loading() {
  return (
    <div
      className='h-screen flex items-center justify-center p-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700'>
      <div className='h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4'></div>
    </div>
  );
}
