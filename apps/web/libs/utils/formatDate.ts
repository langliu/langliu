import siteMetadata from '@/data/siteMetadata'

const formatDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }
  const now = new Date(date).toLocaleDateString(siteMetadata.locale, options)

  return now
}

export default formatDate
