/**
 * TTLC CMS — Seed Data
 * Run via Payload's seed script or paste into the admin UI manually.
 * All data verified by MSV on 2026-05-28.
 */

// ─── PROGRAMS ─────────────────────────────────────────────────────────────────

export const PROGRAMS_SEED = [
  {
    name: 'Brainy Bunch',
    slug: 'brainy-bunch',
    classType: 'Toddler',
    programType: 'toddler',
    ageMin: '1.6 years',
    ageMax: '2.6 years',
    ageRange: '1.6 to 2.6 years old',
    duration: '1 and 1/2 hours',
    dailyRoutine: true,
    classSize: 'Max 8 students per class',
    accentColor: 'pink',
    focuses: [
      { item: 'Basic life skills' },
      { item: 'Values' },
      { item: 'Thematic play' },
      { item: 'Socialization' },
    ],
    isActive: true,
    order: 1,
  },
  {
    name: 'Crayon Crew',
    slug: 'crayon-crew',
    classType: 'Junior Nursery',
    programType: 'junior-nursery',
    ageMin: '2.7 years',
    ageMax: '3.7 years',
    ageRange: '2.7 to 3.7 years old',
    duration: '2 and 1/2 hours',
    dailyRoutine: true,
    classSize: 'Max 8 students per class',
    accentColor: 'yellow',
    focuses: [
      { item: 'Literacy' },
      { item: 'Practical life' },
      { item: 'Values' },
      { item: 'Thematic play' },
      { item: 'Socialization' },
    ],
    isActive: true,
    order: 2,
  },
  {
    name: 'Epic Explorers',
    slug: 'epic-explorers',
    classType: 'Senior Nursery',
    programType: 'senior-nursery',
    ageMin: '3.8 years',
    ageMax: '4.11 years',
    ageRange: '3.8 to 4.11 years old',
    duration: '3 hours',
    dailyRoutine: true,
    classSize: 'Max 8 students per class',
    accentColor: 'cyan',
    focuses: [
      { item: 'Literacy' },
      { item: 'Practical life' },
      { item: 'Values' },
      { item: 'Thematic play' },
      { item: 'Socialization' },
      { item: 'Big-school readiness program' },
    ],
    isActive: true,
    order: 3,
  },
  {
    name: 'Discovery Drivers',
    // Public canonical slug. The live CMS record was saved as "discovery-driveres";
    // the website 301s that typo and rewrites it when reading. Keep this spelling in the CMS.
    slug: 'discovery-drivers',
    classType: 'Kinder Readiness',
    programType: 'kinder-readiness',
    ageMin: '5 years',
    ageMax: 'and beyond',
    ageRange: '5 years old and beyond',
    duration: '4 hours (10:00 AM – 2:00 PM)',
    schedule: '10:00 AM – 2:00 PM | Available 3x or 5x per week',
    dailyRoutine: true,
    classSize: '8 slots per class ONLY',
    accentColor: 'yellow',
    focuses: [
      { item: 'Literacy' },
      { item: 'Numeracy' },
      { item: 'Big-school readiness' },
      { item: 'Social-emotional development' },
      { item: 'Practical skills' },
    ],
    classRoutine: [
      { activity: 'Literacy / Play', duration: '120 mins' },
      { activity: 'Circle Time', duration: '20 mins' },
      { activity: 'Thematic Program', duration: '35 mins' },
      { activity: 'Snack Time', duration: '30 mins' },
      { activity: 'Practical Skills', duration: '30 mins' },
      { activity: 'Goodbye Song', duration: '5 mins' },
    ],
    specialNote: 'For children whose birthday falls after August 31, 2021, or those below the DepEd age requirement for Kinder 2. For inquiries, please message our admin or teachers.',
    isActive: true,
    order: 4,
  },
  {
    name: 'Daycare',
    slug: 'daycare',
    classType: 'Daycare',
    programType: 'daycare',
    ageMin: '1.5 years',
    ageMax: 'and up',
    ageRange: '1.5 years old and up',
    duration: 'Flexible — 8:00 AM to 5:00 PM',
    schedule: 'Mondays to Fridays, 8:00 AM – 5:00 PM',
    dailyRoutine: false,
    classSize: 'Per arrangement',
    accentColor: 'green',
    focuses: [
      { item: 'Free activities' },
      { item: 'Supervised play' },
      { item: 'Safe and nurturing environment' },
    ],
    isActive: true,
    order: 5,
  },
  {
    name: 'Tutorials',
    slug: 'tutorials',
    classType: 'One-on-One Tutorial',
    programType: 'tutorial',
    ageMin: '2 years',
    ageMax: 'and up',
    ageRange: '2 years old and up',
    duration: 'Per session',
    schedule: 'Flexible — by appointment',
    dailyRoutine: false,
    classSize: 'One-on-one',
    accentColor: 'purple',
    focuses: [
      { item: 'Mathematics' },
      { item: 'Reading' },
      { item: 'Writing' },
    ],
    isActive: true,
    order: 6,
  },
  {
    name: 'Arts and Science Playgroups',
    slug: 'arts-and-science-playgroups',
    classType: 'Playgroup',
    programType: 'playgroup',
    ageMin: 'Per age group',
    ageMax: '',
    ageRange: 'Per age group',
    duration: 'Per session',
    schedule: 'By schedule — contact admin for dates',
    dailyRoutine: false,
    classSize: '7 – 8 students per class',
    accentColor: 'orange',
    focuses: [
      { item: 'Arts and crafts' },
      { item: 'Science experiments' },
      { item: 'Hands-on exploration' },
      { item: 'Creative expression' },
    ],
    isActive: true,
    order: 7,
  },
]

// ─── AUTHORS / TEAM ───────────────────────────────────────────────────────────

export const AUTHORS_SEED = [
  // Founders
  {
    name: 'Carla Irel B. Villarruz',
    role: 'Co-Founder',
    bio: 'Co-founder of Tiny Thinkers Learning Center. Passionate about creating joyful, nurturing spaces where every child can learn, grow, and thrive.',
  },
  {
    name: 'Renee Therese D. Baquilar',
    role: 'Co-Founder',
    bio: 'Co-founder of Tiny Thinkers Learning Center. Committed to building a school that puts children first and makes parents feel welcome, heard, and assured.',
  },
  // Teachers
  {
    name: 'Franceska Veniece Adriana Y. Martin',
    role: 'Teacher — Brainy Bunch (Toddler)',
    bio: 'Teacher for Brainy Bunch, guiding our youngest learners through their first steps in play-based exploration and socialization.',
  },
  {
    name: 'Ella Joyce R. Noble',
    role: 'Teacher — Crayon Crew (Junior Nursery)',
    bio: 'Teacher for Crayon Crew, helping children develop literacy, practical life skills, and a love for learning through play.',
  },
  {
    name: 'Angel Rita T. Mutuc',
    role: 'Teacher — Epic Explorers (Senior Nursery)',
    bio: 'Teacher for Epic Explorers, preparing children for big school with a holistic approach to literacy, socialization, and school readiness.',
  },
  {
    name: 'Bianca D. Ramirez',
    role: 'Teacher — Discovery Drivers (Kinder Readiness)',
    bio: 'Teacher for Discovery Drivers, guiding children in their Kinder Readiness journey through structured learning and meaningful play.',
  },
  {
    name: 'Robie Mae Reyes',
    role: 'Teacher — Discovery Drivers (Kinder Readiness)',
    bio: 'Teacher for Discovery Drivers, supporting children as they build confidence and skills to thrive in a bigger educational setting.',
  },
  // Teacher Aides
  {
    name: 'Joanna Marie E. Casimiro',
    role: 'Teacher Aide',
    bio: 'Teacher Aide at Tiny Thinkers, providing caring support to ensure every child feels safe, seen, and engaged throughout the school day.',
  },
  {
    name: 'Rosalyn R. Eusuya',
    role: 'Teacher Aide',
    bio: 'Teacher Aide at Tiny Thinkers, dedicated to creating a warm and supportive learning environment for every child in our care.',
  },
  {
    name: 'Lorry Mae B. Ladiao',
    role: 'Teacher Aide',
    bio: 'Teacher Aide at Tiny Thinkers, bringing patience and heart to every classroom moment and helping children grow with confidence.',
  },
]

// ─── CATEGORIES ───────────────────────────────────────────────────────────────

export const CATEGORIES_SEED = [
  { name: 'School News', slug: 'school-news', color: 'teal' },
  { name: 'Learning Tips', slug: 'learning-tips', color: 'pink' },
  { name: 'Parenting', slug: 'parenting', color: 'yellow' },
  { name: 'Events', slug: 'events', color: 'blue' },
  { name: 'Milestones', slug: 'milestones', color: 'teal' },
]

// ─── SITE SETTINGS (pre-filled) ───────────────────────────────────────────────

export const SITE_SETTINGS_SEED = {
  schoolName: 'Tiny Thinkers Learning Center',
  tagline: "Your child's best beginning",
  footerTagline: 'Fostering curious minds and happy hearts.',
  address: '113 West Avenue, Brgy. Bungad, Quezon City',
  phone: '+63 967 201 8214',
  email: 'hello@tinythinkers.edu.ph',
  facebookUrl: 'https://www.facebook.com/share/1BDRvgw8Ud/',
  instagramUrl: 'https://www.instagram.com/tinythinkerslc',
  googleMapsUrl: 'https://maps.app.goo.gl/g4ggoVGcMD2jqskeA',
  metaTitle: 'Tiny Thinkers Learning Center | Quezon City',
  metaDescription: 'A play-based learning center in Quezon City dedicated to fostering curiosity, creativity, and confidence in every child.',
}
