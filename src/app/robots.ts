export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api', '/admin', '/dashboard', '/driver', '/book'],
      },
    ],
    sitemap: 'https://vanitgo.com/sitemap.xml',
  };
}
