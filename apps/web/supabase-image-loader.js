const projectId = 'fnxhbjhqajtangiuezbp' // your supabase project id

export default function supabaseLoader({ src, width, quality }) {
  if (src?.startsWith('/')) {
    return src
  }
  // return `https://${projectId}.supabase.co/storage/v1/object/sign/langliu/${src}`
  return src
}
