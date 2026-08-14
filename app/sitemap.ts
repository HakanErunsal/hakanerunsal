import { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'
import { projects } from '#site/content'
import { articles } from '#site/content'
import { docs } from '#site/content'

export default function sitemap(): MetadataRoute.Sitemap {
  const projectUrls = projects
    .filter((project) => project.published)
    .map((project) => ({
      url: `${siteConfig.url}/${project.slug}`,
      lastModified: new Date(project.date),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))

  const articleUrls = articles
    .filter((article) => article.published)
    .map((article) => ({
      url: `${siteConfig.url}/${article.slug}`,
      lastModified: new Date(article.date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

  // Docs carry the docs host, matching the canonical each page declares.
  const docUrls = docs
    .filter((doc) => doc.published)
    .map((doc) => ({
      url: `${siteConfig.docsUrl}/${doc.slug}`,
      lastModified: new Date(doc.date),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))

  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteConfig.url}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/articles`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteConfig.docsUrl}/docs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...projectUrls,
    ...articleUrls,
    ...docUrls,
  ]
}
