import { MetadataRoute } from 'next'
import dbConnect from '@/lib/db'
import Project from '@/models/Project'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://kukaass.vercel.app'
  const currentDate = new Date()

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ]

  // Dynamic project pages
  let projectPages: MetadataRoute.Sitemap = []

  try {
    await dbConnect()
    const projects = await Project.find({}).select('_id updatedAt').sort({ updatedAt: -1 })

    projectPages = projects.map((project) => ({
      url: `${baseUrl}/projects/${project._id}`,
      lastModified: project.updatedAt || currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  } catch (error) {
    console.error('Error fetching projects for sitemap:', error)
    // Continue with static pages only if database fails
  }

  return [...staticPages, ...projectPages]
}
