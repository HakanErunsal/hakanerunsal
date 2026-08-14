import { MetadataRoute } from 'next'
import { brandConfig } from '@/config/site'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: `${brandConfig.url}/sitemap.xml`,
  }
}

