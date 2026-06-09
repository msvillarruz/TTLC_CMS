import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'parentName',
    defaultColumns: ['parentName', 'programName', 'rating', 'testimonialType', 'isActive', 'order'],
    group: 'Content',
    description: 'Parent testimonials shown on the website homepage.',
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true
      return { isActive: { equals: true } }
    },
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'parentName', type: 'text', required: true, label: 'Parent Name', admin: { width: '50%', placeholder: 'e.g. Sarah M.' } },
        { name: 'programName', type: 'text', required: true, label: 'Program', admin: { width: '50%', placeholder: 'e.g. Brainy Bunch' } },
      ],
    },
    {
      name: 'testimonialType',
      type: 'select',
      label: 'Testimonial Type',
      defaultValue: 'text',
      options: [
        { label: 'Text', value: 'text' },
        { label: 'Video', value: 'video' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      label: 'Quote / Review Text',
      admin: { placeholder: 'The review text as written by the parent.' },
    },
    {
      name: 'videoFile',
      type: 'upload',
      relationTo: 'media',
      label: 'Video File',
      admin: {
        condition: (data) => data.testimonialType === 'video',
        description: 'Upload MP4 video testimonial. Will be served from R2.',
      },
    },
    {
      name: 'videoUrl',
      type: 'text',
      label: 'Video URL (YouTube / Facebook)',
      admin: {
        condition: (data) => data.testimonialType === 'video',
        description: 'Or paste a YouTube or Facebook video URL instead of uploading a file.',
        placeholder: 'https://www.youtube.com/watch?v=...',
      },
    },
    {
      name: 'source',
      type: 'select',
      label: 'Review Source',
      defaultValue: 'direct',
      options: [
        { label: 'Facebook', value: 'facebook' },
        { label: 'Google', value: 'google' },
        { label: 'Direct', value: 'direct' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'rating',
      type: 'number',
      label: 'Rating (1–5)',
      defaultValue: 5,
      min: 1,
      max: 5,
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Display Order',
      defaultValue: 1,
      admin: {
        position: 'sidebar',
        description: 'Lower number = shown first.',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Show on website',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
  ],
  timestamps: true,
}
