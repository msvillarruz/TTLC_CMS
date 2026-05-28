import type { CollectionConfig } from 'payload'

export const Programs: CollectionConfig = {
  slug: 'programs',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'classType', 'ageRange', 'isActive'],
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Program Name',
      admin: { placeholder: 'e.g. Brainy Bunch' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { placeholder: 'e.g. brainy-bunch' },
    },
    {
      name: 'classType',
      type: 'text',
      required: true,
      label: 'Class Type',
      admin: { placeholder: 'e.g. Toddler Class' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'ageMin',
          type: 'text',
          required: true,
          label: 'Age Minimum',
          admin: { placeholder: 'e.g. 1.5 years', width: '50%' },
        },
        {
          name: 'ageMax',
          type: 'text',
          required: true,
          label: 'Age Maximum',
          admin: { placeholder: 'e.g. 2.5 years', width: '50%' },
        },
      ],
    },
    {
      name: 'ageRange',
      type: 'text',
      label: 'Age Range (display)',
      admin: {
        placeholder: 'e.g. 1.5 to 2.5 years old',
        description: 'Formatted age range shown on the website',
      },
    },
    {
      name: 'duration',
      type: 'text',
      required: true,
      admin: { placeholder: 'e.g. 1 and 1/2 hours' },
    },
    {
      name: 'dailyRoutine',
      type: 'checkbox',
      label: 'Has daily routine',
      defaultValue: true,
    },
    {
      name: 'focuses',
      type: 'array',
      label: 'Focus Areas',
      minRows: 1,
      admin: {
        description: 'What this program focuses on (e.g. Basic life skills, Socialization)',
      },
      fields: [
        {
          name: 'item',
          type: 'text',
          required: true,
          label: 'Focus area',
        },
      ],
    },
    {
      name: 'schedule',
      type: 'text',
      label: 'Schedule',
      admin: {
        placeholder: 'e.g. 10:00 AM – 2:00 PM, 3x or 5x per week',
        description: 'Session schedule shown on the program page',
      },
    },
    {
      name: 'classSize',
      type: 'text',
      label: 'Class Size',
      admin: {
        placeholder: 'e.g. Max 8 students per class',
      },
    },
    {
      name: 'programType',
      type: 'select',
      label: 'Program Type',
      defaultValue: 'regular',
      options: [
        { label: 'Toddler', value: 'toddler' },
        { label: 'Junior Nursery', value: 'junior-nursery' },
        { label: 'Senior Nursery', value: 'senior-nursery' },
        { label: 'Kinder Readiness', value: 'kinder-readiness' },
        { label: 'Daycare', value: 'daycare' },
        { label: 'Tutorial / One-on-One', value: 'tutorial' },
        { label: 'Playgroup / Workshop', value: 'playgroup' },
      ],
    },
    {
      name: 'classRoutine',
      type: 'array',
      label: 'Daily Class Routine',
      admin: {
        description: 'Optional — list each activity and duration (e.g. Discovery Drivers)',
      },
      fields: [
        { name: 'activity', type: 'text', required: true, label: 'Activity' },
        { name: 'duration', type: 'text', required: true, label: 'Duration (e.g. 120 mins)' },
      ],
    },
    {
      name: 'specialNote',
      type: 'textarea',
      label: 'Special Note / Disclaimer',
      admin: {
        placeholder: 'e.g. For children 4.8 yrs old by June or below DepEd age requirement...',
        description: 'Shown as a footnote on the program card',
      },
    },
    {
      name: 'accentColor',
      type: 'select',
      label: 'Card Accent Color',
      defaultValue: 'pink',
      options: [
        { label: 'Pink (Brainy Bunch)', value: 'pink' },
        { label: 'Yellow (Crayon Crew / Discovery Drivers)', value: 'yellow' },
        { label: 'Cyan (Epic Explorers)', value: 'cyan' },
        { label: 'Green (Daycare)', value: 'green' },
        { label: 'Purple (Tutorials)', value: 'purple' },
        { label: 'Orange (Arts & Science)', value: 'orange' },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Short Description',
      admin: {
        description: 'Optional — appears on program detail page below the focuses',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Program Image',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'isActive',
          type: 'checkbox',
          label: 'Currently enrolling',
          defaultValue: true,
          admin: { width: '50%' },
        },
        {
          name: 'order',
          type: 'number',
          label: 'Display Order',
          defaultValue: 1,
          admin: { width: '50%', description: '1 = first' },
        },
      ],
    },
  ],
  timestamps: true,
}
