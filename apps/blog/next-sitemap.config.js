/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://langliu.xyz',
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
      `${process.env.SITE_URL || 'https://langliu.xyz'}/sitemap.xml`,
      `${process.env.SITE_URL || 'https://langliu.xyz'}/server-sitemap.xml`,
    ],
  },
}
