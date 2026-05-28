import type { CollectionConfig } from 'payload'

// ─── Events ───────────────────────────────────────────────────────────────────

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'status'],
    group: 'Content',
  },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    {
      type: 'row',
      fields: [
        { name: 'date', type: 'date', required: true, label: 'Event Date', admin: { width: '50%', date: { pickerAppearance: 'dayAndTime' } } },
        { name: 'endDate', type: 'date', label: 'End Date/Time', admin: { width: '50%', date: { pickerAppearance: 'dayAndTime' } } },
      ],
    },
    { name: 'location', type: 'text', admin: { placeholder: 'e.g. Tiny Thinkers Main Campus, QC' } },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'description', type: 'richText', required: true },
    { name: 'registrationLink', type: 'text', label: 'Registration Link (optional)' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'upcoming',
      options: [
        { label: 'Upcoming', value: 'upcoming' },
        { label: 'Past', value: 'past' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
  timestamps: true,
}

// ─── Announcements ────────────────────────────────────────────────────────────

export const Announcements: CollectionConfig = {
  slug: 'announcements',
  admin: {
    useAsTitle: 'message',
    defaultColumns: ['message', 'severity', 'isActive', 'expiresAt'],
    group: 'Content',
    description: 'Short banners shown at the top of the site. Use sparingly.',
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true
      return { isActive: { equals: true } }
    },
  },
  fields: [
    { name: 'message', type: 'textarea', required: true, admin: { placeholder: 'e.g. Classes are suspended on Dec 25. Happy Christmas!' } },
    {
      name: 'severity',
      type: 'select',
      defaultValue: 'info',
      options: [
        { label: 'Info (blue)', value: 'info' },
        { label: 'Urgent (red)', value: 'urgent' },
      ],
    },
    { name: 'isActive', type: 'checkbox', label: 'Show on website', defaultValue: true },
    { name: 'expiresAt', type: 'date', label: 'Auto-expire at', admin: { date: { pickerAppearance: 'dayAndTime' }, description: 'Leave blank to never expire' } },
  ],
  timestamps: true,
}

// ─── Trial Requests ───────────────────────────────────────────────────────────

export const TrialRequests: CollectionConfig = {
  slug: 'trial-requests',
  admin: {
    useAsTitle: 'childName',
    defaultColumns: ['childName', 'parentName', 'preferredProgram', 'preferredDate', 'status'],
    group: 'Inquiries',
    description: 'Trial class bookings submitted from the website.',
  },
  access: {
    read: ({ req }) => !!req.user,
    create: () => true,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'childName', type: 'text', required: true, label: "Child's Name", admin: { width: '50%' } },
        { name: 'childBirthday', type: 'date', required: true, label: "Child's Birthday", admin: { width: '50%', date: { pickerAppearance: 'dayOnly' } } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'parentName', type: 'text', required: true, label: "Parent's Full Name", admin: { width: '50%' } },
        { name: 'email', type: 'email', required: true, label: 'Email Address', admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'preferredDate', type: 'date', required: true, label: 'Preferred Trial Date', admin: { width: '50%', date: { pickerAppearance: 'dayOnly' } } },
        { name: 'preferredProgram', type: 'relationship', relationTo: 'programs', label: 'Preferred Program', admin: { width: '50%' } },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: '🆕 New', value: 'new' },
        { label: '📞 Contacted', value: 'contacted' },
        { label: '✅ Enrolled', value: 'enrolled' },
        { label: '❌ Declined', value: 'declined' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Internal Notes',
      admin: {
        position: 'sidebar',
        description: 'Only visible to admins. Not shown to parents.',
      },
    },
  ],
  timestamps: true,
}

// ─── Authors ──────────────────────────────────────────────────────────────────

export const Authors: CollectionConfig = {
  slug: 'authors',
  admin: {
    useAsTitle: 'name',
    group: 'Settings',
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text', admin: { placeholder: 'e.g. Lead Teacher, Co-Founder' } },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'bio', type: 'textarea', admin: { description: 'Short bio (2–3 sentences)' } },
  ],
}

// ─── Categories ───────────────────────────────────────────────────────────────

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    group: 'Settings',
  },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true, admin: { placeholder: 'e.g. Learning Tips' } },
    { name: 'slug', type: 'text', required: true, unique: true },
    {
      name: 'color',
      type: 'select',
      defaultValue: 'teal',
      options: [
        { label: 'Teal', value: 'teal' },
        { label: 'Pink', value: 'pink' },
        { label: 'Yellow', value: 'yellow' },
        { label: 'Blue', value: 'blue' },
      ],
    },
  ],
}

// ─── Media ────────────────────────────────────────────────────────────────────

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Settings',
  },
  access: { read: () => true },
  upload: {
    staticDir: 'media',
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 432, position: 'centre' },
      { name: 'hero', width: 1280, height: 720, position: 'centre' },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Alt Text',
      admin: { description: 'Describe the image for accessibility and SEO' },
    },
    { name: 'caption', type: 'text', label: 'Caption (optional)' },
  ],
}

// ─── Parents (hidden — future portal) ────────────────────────────────────────

export const Parents: CollectionConfig = {
  slug: 'parents',
  admin: {
    useAsTitle: 'name',
    group: 'Portal (Future)',
    hidden: true,
    description: 'Stub collection for the future Parent Portal. Not active yet.',
  },
  access: {
    read: ({ req }) => !!req.user,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: "Parent's Full Name" },
    { name: 'email', type: 'email', required: true, unique: true },
    { name: 'phone', type: 'text', label: 'Mobile Number' },
    {
      name: 'children',
      type: 'array',
      label: 'Children (stub)',
      admin: { description: 'Will be a proper relationship when portal launches' },
      fields: [
        { name: 'childName', type: 'text' },
        { name: 'program', type: 'text', label: 'Program enrolled in' },
      ],
    },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
  ],
  timestamps: true,
}
