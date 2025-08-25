import { MetadataRoute } from 'next'

export default function sitemapIndex(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://kukaass.vercel.app/sitemap.xml',
      lastModified: new Date(),
    },
  ]
}
