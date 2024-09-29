import { defineConfig } from 'rspress/config'

export default defineConfig({
  // 文档根目录
  root: 'docs',
  themeConfig: {
    nav: [
      { text: '首页', link: '/', position: 'left' },
      {
        text: '指南',
        link: '/guide/introduction',
        position: 'right',
      },
      {
        text: '组件',
        link: '/components/button',
        position: 'right',
      },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '开始',
          items: [
            {
              text: '介绍',
              link: '/guide/introduction',
            },
            {
              text: '快速开始',
              link: '/guide/getting-started',
            },
          ],
        },
        // {
        //   text: 'Advanced',
        //   items: [
        //     // 直接填入链接字符串
        //     '/guide/advanced/customization',
        //     '/guide/advanced/markdown',
        //   ],
        // },
      ],
      '/components/': [
        {
          text: '基础组件',
          items: [
            {
              text: '按钮',
              link: '/components/button',
            },
          ],
        },
      ],
    },
  },
})
