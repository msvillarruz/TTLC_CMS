import type { GlobalConfig } from 'payload'

// ─── Site Settings ────────────────────────────────────────────────────────────

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Settings',
    description: 'Global settings for the entire website. Edit with care.',
  },
  access: {
    read: () => true,
    update: ({ req }) => !!req.user,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'School Info',
          fields: [
            { name: 'schoolName', type: 'text', required: true, defaultValue: 'Tiny Thinkers Learning Center' },
            { name: 'tagline', type: 'text', required: true, defaultValue: "Your child's best beginning" },
            { name: 'footerTagline', type: 'text', defaultValue: 'Fostering curious minds and happy hearts.' },
            { name: 'logo', type: 'upload', relationTo: 'media', label: 'School Logo' },
            { name: 'favicon', type: 'upload', relationTo: 'media', label: 'Favicon' },
          ],
        },
        {
          label: 'Contact',
          fields: [
            {
              name: 'address',
              type: 'text',
              required: true,
              defaultValue: '113 West Avenue, Brgy. Bungad, Quezon City',
            },
            {
              name: 'phone',
              type: 'text',
              required: true,
              defaultValue: '+63 967 201 8214',
              admin: { description: 'Include country code: +63 967 201 8214' },
            },
            {
              name: 'email',
              type: 'email',
              required: true,
              defaultValue: 'hello@tinythinkers.edu.ph',
            },
            {
              name: 'viberNumber',
              type: 'text',
              label: 'Viber Number',
              admin: { description: 'Format: +639XXXXXXXXX — generates a Viber chat link' },
            },
            {
              name: 'googleMapsUrl',
              type: 'text',
              label: 'Google Maps Link',
              defaultValue: 'https://maps.app.goo.gl/g4ggoVGcMD2jqskeA',
              admin: { description: 'Paste the Google Maps share link' },
            },
            {
              name: 'googleMapsEmbed',
              type: 'text',
              label: 'Google Maps Embed URL',
              admin: {
                description: 'From Google Maps → Share → Embed a map → copy the src URL only',
              },
            },
          ],
        },
        {
          label: 'Social',
          fields: [
            {
              name: 'facebookUrl',
              type: 'text',
              label: 'Facebook Page URL',
              defaultValue: 'https://www.facebook.com/share/1BDRvgw8Ud/',
            },
            {
              name: 'instagramUrl',
              type: 'text',
              label: 'Instagram URL',
              defaultValue: 'https://www.instagram.com/tinythinkerslc',
            },
            {
              name: 'tiktokUrl',
              type: 'text',
              label: 'TikTok URL (optional)',
            },
          ],
        },
        {
          label: 'SEO Defaults',
          fields: [
            { name: 'metaTitle', type: 'text', label: 'Default Meta Title', defaultValue: 'Tiny Thinkers Learning Center | Quezon City' },
            { name: 'metaDescription', type: 'textarea', label: 'Default Meta Description', defaultValue: 'A play-based learning center in Quezon City dedicated to fostering curiosity, creativity, and confidence in every child.' },
            { name: 'ogImage', type: 'upload', relationTo: 'media', label: 'Default OG Image' },
          ],
        },
      ],
    },
  ],
}

// ─── Home Page ────────────────────────────────────────────────────────────────

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home Page',
  admin: {
    group: 'Settings',
    description: 'Edit the home page content from here.',
  },
  access: {
    read: () => true,
    update: ({ req }) => !!req.user,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            {
              name: 'heroHeadline',
              type: 'text',
              required: true,
              defaultValue: "Your child's best beginning",
            },
            {
              name: 'heroSubline',
              type: 'text',
              defaultValue: 'A play-based learning center dedicated to fostering curiosity, creativity, and confidence in every child.',
            },
            {
              type: 'row',
              fields: [
                { name: 'heroCTA1Label', type: 'text', defaultValue: 'Schedule a Trial', admin: { width: '50%' } },
                { name: 'heroCTA1Link', type: 'text', defaultValue: '/contact', admin: { width: '50%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'heroCTA2Label', type: 'text', defaultValue: 'Learn More About Us', admin: { width: '50%' } },
                { name: 'heroCTA2Link', type: 'text', defaultValue: '/about', admin: { width: '50%' } },
              ],
            },
            { name: 'heroImage', type: 'upload', relationTo: 'media', label: 'Hero Background Image (optional)' },
          ],
        },
        {
          label: 'About Section',
          fields: [
            { name: 'aboutTitle', type: 'text', defaultValue: 'About Tiny Thinkers' },
            {
              name: 'aboutBody',
              type: 'textarea',
              defaultValue: "Founded on the belief that play is the highest form of research, Tiny Thinkers provides a nurturing environment where children can explore, discover, and grow at their own pace. Our dedicated teachers guide each child on a personalized journey of learning, building a strong foundation for a lifelong love of knowledge.",
            },
          ],
        },
        {
          label: 'CTA Section',
          fields: [
            { name: 'ctaHeadline', type: 'text', defaultValue: "Start Your Child's Learning Journey Today!" },
            { name: 'ctaSubline', type: 'text', defaultValue: 'Schedule a tour and enjoy a free trial session at our center.' },
            { name: 'ctaButtonLabel', type: 'text', defaultValue: 'Schedule a FREE Trial' },
            { name: 'ctaButtonLink', type: 'text', defaultValue: '/contact' },
          ],
        },
      ],
    },
  ],
}
