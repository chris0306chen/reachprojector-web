export const productNavigation = [
  {
    label: 'Projectors',
    slug: 'projectors',
    children: [
      ['Laser TVs (Ultra Short Throw)', 'ust-laser-tv'],
      ['Home Smart Projectors', 'home-smart-projectors'],
      ['Portable / Mini Projectors', 'portable-mini-projectors'],
      ['Business & Education', 'business-education-projectors'],
      ['Engineering Projectors', 'engineering-projectors'],
      ['High-End Home Theater Projectors', 'high-end-home-theater-projectors'],
    ],
  },
  {
    label: 'Projection Screens',
    slug: 'projection-screens',
    children: [
      ['ALR / CLR Screens', 'alr-clr-screens'],
      ['Motorized Screens', 'motorized-screens'],
      ['Fixed Frame Screens', 'fixed-frame-screens'],
      ['Floor Rising Screens', 'floor-rising-screens'],
      ['Portable & Outdoor Screens', 'portable-outdoor-screens'],
    ],
  },
  {
    label: 'Mounts & Stands',
    slug: 'projector-mounts-stands',
    children: [
      ['Ceiling Mounts', 'ceiling-mounts'],
      ['Wall Mounts', 'wall-mounts'],
      ['Floor Stands', 'floor-stands'],
      ['Desktop Stands', 'desktop-stands'],
    ],
  },
  {
    label: 'AV Furniture',
    slug: 'av-furniture',
    children: [
      ['Projector Cabinets', 'projector-cabinets'],
      ['Motorized TV Cabinets', 'motorized-tv-cabinets'],
      ['Media Consoles', 'media-consoles'],
    ],
  },
  {
    label: 'Accessories & Parts',
    slug: 'accessories-parts',
    children: [
      ['Cables & Adapters', 'cables-adapters'],
      ['Cases & Bags', 'cases-bags'],
      ['Remotes & Replacement Parts', 'replacement-parts'],
    ],
  },
  {
    label: 'Solution Bundles',
    slug: 'solution-bundles',
    children: [
      ['Home Cinema Kits', 'home-cinema-kits'],
      ['Meeting Room Kits', 'meeting-room-kits'],
      ['Project Packages', 'project-packages'],
    ],
  },
] as const;

export const sceneNavigation = [
  {
    group: 'Residential',
    items: [
      ['Home Cinema', 'home-cinema'],
      ['Living Room Laser TV', 'living-room-laser-tv'],
      ['Bedroom & Small Space', 'bedroom-small-space'],
      ['Gaming Room', 'gaming-room'],
      ['Backyard & Outdoor Cinema', 'outdoor-cinema'],
    ],
  },
  {
    group: 'Business & Projects',
    items: [
      ['Office & Meeting Rooms', 'meeting-rooms'],
      ['Classrooms & Training', 'education-training'],
      ['Hotels & Hospitality', 'hotels-hospitality'],
      ['Bars & Restaurants', 'bars-restaurants'],
      ['Retail & Showrooms', 'retail-showrooms'],
      ['Events & Rental', 'events-rental'],
      ['Auditoriums & Large Venues', 'large-venues'],
    ],
  },
] as const;

export const sceneDetails: Record<string, {
  title: string;
  eyebrow: string;
  description: string;
  considerations: string[];
  categorySlugs: string[];
}> = {
  'home-cinema': {
    title: 'Home Cinema Solutions',
    eyebrow: 'Residential',
    description: 'Create a complete home theater with the right projector, screen, mount, and room-specific accessories.',
    considerations: ['Room light and screen material', 'Viewing distance and screen size', 'Throw ratio and mounting position'],
    categorySlugs: ['home-smart-projectors', 'high-end-home-theater-projectors', 'projection-screens'],
  },
  'living-room-laser-tv': {
    title: 'Living Room Laser TV Solutions',
    eyebrow: 'Residential',
    description: 'Ultra-short-throw projection systems designed for bright living rooms and clean furniture-integrated installations.',
    considerations: ['UST projector and CLR screen compatibility', 'Cabinet depth and ventilation', 'Daytime brightness performance'],
    categorySlugs: ['ust-laser-tv', 'alr-clr-screens', 'av-furniture'],
  },
  'bedroom-small-space': {
    title: 'Bedroom & Small Space Projection',
    eyebrow: 'Residential',
    description: 'Compact, quiet projection options for bedrooms, apartments, and flexible small-space setups.',
    considerations: ['Short viewing distance', 'Low-noise operation', 'Portable or compact mounting'],
    categorySlugs: ['portable-mini-projectors', 'desktop-stands', 'portable-outdoor-screens'],
  },
  'gaming-room': {
    title: 'Gaming Room Projection',
    eyebrow: 'Residential',
    description: 'Large-screen gaming systems selected for low input lag, refresh rate, and console compatibility.',
    considerations: ['Input lag and refresh rate', 'HDMI and console compatibility', 'Ambient light control'],
    categorySlugs: ['home-smart-projectors', 'high-end-home-theater-projectors', 'projection-screens'],
  },
  'outdoor-cinema': {
    title: 'Backyard & Outdoor Cinema',
    eyebrow: 'Residential',
    description: 'Portable projector and screen combinations for gardens, camping, and temporary outdoor events.',
    considerations: ['Portable power and connectivity', 'Weather-safe storage', 'Fast screen setup'],
    categorySlugs: ['portable-mini-projectors', 'portable-outdoor-screens', 'cases-bags'],
  },
  'meeting-rooms': {
    title: 'Office & Meeting Room Solutions',
    eyebrow: 'Business & Projects',
    description: 'Reliable presentation and collaboration systems for huddle rooms, boardrooms, and conference spaces.',
    considerations: ['Room capacity and screen size', 'Wireless presentation workflow', 'Installation and cable routing'],
    categorySlugs: ['business-education-projectors', 'motorized-screens', 'ceiling-mounts'],
  },
  'education-training': {
    title: 'Classroom & Training Solutions',
    eyebrow: 'Business & Projects',
    description: 'Low-maintenance projection packages for classrooms, training centers, and multi-room deployments.',
    considerations: ['Brightness under classroom lighting', 'Centralized maintenance', 'Volume pricing and spares'],
    categorySlugs: ['business-education-projectors', 'projection-screens', 'ceiling-mounts'],
  },
  'hotels-hospitality': {
    title: 'Hotel & Hospitality Projection',
    eyebrow: 'Business & Projects',
    description: 'Guest-room, lounge, meeting, and entertainment solutions with project pricing and installation support.',
    considerations: ['Guest experience and simple controls', 'Furniture integration', 'Multi-site rollout consistency'],
    categorySlugs: ['ust-laser-tv', 'av-furniture', 'solution-bundles'],
  },
  'bars-restaurants': {
    title: 'Bars & Restaurants',
    eyebrow: 'Business & Projects',
    description: 'High-impact large-screen systems for sports viewing, private rooms, and branded entertainment spaces.',
    considerations: ['High ambient-light brightness', 'Multiple screen layouts', 'Long daily operating hours'],
    categorySlugs: ['engineering-projectors', 'alr-clr-screens', 'projector-mounts-stands'],
  },
  'retail-showrooms': {
    title: 'Retail & Showroom Projection',
    eyebrow: 'Business & Projects',
    description: 'Flexible visual merchandising and showroom systems for product launches, displays, and immersive content.',
    considerations: ['Content format and projection surface', 'Operating schedule', 'Hidden installation and brand presentation'],
    categorySlugs: ['engineering-projectors', 'projector-mounts-stands', 'accessories-parts'],
  },
  'events-rental': {
    title: 'Events & Rental Solutions',
    eyebrow: 'Business & Projects',
    description: 'Transportable, serviceable projection packages for conferences, exhibitions, and rental fleets.',
    considerations: ['Fast setup and teardown', 'Road cases and spare parts', 'Venue brightness and throw distance'],
    categorySlugs: ['engineering-projectors', 'portable-outdoor-screens', 'cases-bags'],
  },
  'large-venues': {
    title: 'Auditoriums & Large Venues',
    eyebrow: 'Business & Projects',
    description: 'High-brightness installation solutions for auditoriums, houses of worship, halls, and large public spaces.',
    considerations: ['Projection distance and lens selection', 'Rigging and safety', 'Redundancy and maintenance access'],
    categorySlugs: ['engineering-projectors', 'fixed-frame-screens', 'ceiling-mounts'],
  },
};
