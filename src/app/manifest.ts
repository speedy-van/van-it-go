export default function manifest() {
  return {
    name: 'VanItGo - Moving Service',
    short_name: 'VanItGo',
    description: 'Built for people who hate moving stress',
    start_url: '/',
    display: 'standalone',
    background_color: '#06061A',
    theme_color: '#7B2FFF',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
