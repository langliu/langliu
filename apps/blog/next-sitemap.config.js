/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://langliu.vercel.app',
  generateRobotsTxt: true,
  exclude: ['/server-sitemap.xml'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    additionalSitemaps: [
      `${process.env.SITE_URL || 'https://langliu.vercel.app'}/sitemap.xml`,
      `${process.env.SITE_URL || 'https://langliu.vercel.app'}/server-sitemap.xml`,
    ],
  },
}
