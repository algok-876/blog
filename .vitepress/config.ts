import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/',
  title: "algok's blog",
  description: "blog",
  srcDir: 'src',
  cleanUrls: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'English', link: '/english' },
      { text: 'Rust', link: '/rust' }
    ],

    sidebar: [
      {
        text: 'English',
        items: [
          { text: 'Words', link: '/english/words/index' },
          { text: 'Grammer', link: '/english/grammer/index'}
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
