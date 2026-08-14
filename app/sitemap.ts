import { MetadataRoute } from 'next'
import { brandConfig, siteConfig } from '@/config/site'
import { isRigbak } from '@/lib/site-mode'
import { ownedDocs } from '@/lib/docs-ownership'
import { projects } from '#site/content'
import { articles } from '#site/content'
import { docs } from '#site/content'

// Each build lists only what its own host serves. Listing the other host's
// pages here would advertise URLs this deployment answers with a redirect.
export default function sitemap(): MetadataRoute.Sitemap {
  const docUrls = ownedDocs(docs)
    .filter((doc) => doc.published)
    .map((doc) => ({
      url: `${brandConfig.url}/${doc.slug}`,
      lastModified: new Date(doc.date),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))

  if (isRigbak) {
    return [
      {
        url: brandConfig.url,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 1,
      },
      {
        url: `${brandConfig.url}/docs`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      ...docUrls,
    ]
  }

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
      url: `${siteConfig.url}/docs`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...projectUrls,
    ...articleUrls,
    ...docUrls,
  ]
}
