export type GuideAudience = 'Home buyers' | 'Business buyers'

export interface GuideSection {
  title: string
  paragraphs?: string[]
  checklist?: string[]
}

export interface BuyingGuide {
  slug: string
  audience: GuideAudience
  title: string
  description: string
  directAnswer: string
  updatedAt: string
  readTime: string
  sections: GuideSection[]
  sources: Array<{ label: string; url: string }>
  cta: { label: string; href: string }
}

export const buyingGuides: BuyingGuide[] = [
  {
    slug: 'how-to-choose-a-projector-for-your-room',
    audience: 'Home buyers',
    title: 'How to Choose a Projector for Your Room',
    description: 'A practical room-first checklist for choosing throw type, screen size, brightness, resolution and installation options.',
    directAnswer: 'Measure the wall, viewing distance and possible projector positions before comparing model names. Room geometry determines throw type; ambient light and screen choice determine how much usable brightness you need.',
    updatedAt: '2026-09-03',
    readTime: '7 min read',
    sections: [
      {
        title: 'Start with four room measurements',
        checklist: [
          'Available wall width and height for the image or screen.',
          'Normal seating distance from the screen.',
          'Possible lens position: media cabinet, ceiling, rear shelf or directly below the screen.',
          'Typical light level while you watch: controlled, moderate or bright.',
        ],
      },
      {
        title: 'Choose throw type before features',
        paragraphs: [
          'A standard-throw projector usually gives the widest model choice and works well when a ceiling or rear-shelf position is available. Short-throw reduces the required distance. Ultra-short-throw places the projector close to the wall but makes cabinet depth, wall flatness and screen compatibility especially important.',
          'Use the manufacturer throw-distance calculator for the exact model. Marketing labels such as short throw are not a substitute for the model-specific throw ratio and lens-offset data.',
        ],
      },
      {
        title: 'Match brightness to the real viewing conditions',
        paragraphs: ['Do not compare brightness numbers in isolation. Image size, ambient light, screen gain, picture mode and measurement standard all change the result. For daytime viewing, reducing stray light and choosing an appropriate screen can matter as much as choosing a brighter projector.'],
      },
      {
        title: 'Confirm compatibility before paying',
        checklist: [
          'Native resolution and supported HDR formats.',
          'Input ports and gaming features required by your sources.',
          'Operating system, app availability and regional restrictions.',
          'Voltage, plug type, language, warranty region and after-sales path.',
          'Final throw distance and image size using the exact model calculator.',
        ],
      },
    ],
    sources: [
      { label: 'Epson: Throw Distance and Positioning', url: 'https://epson.com/projector-guide-how-to-buy-a-projector-throw-distance-and-positioning' },
      { label: 'Epson: Projector Throw Distance Simulator manual', url: 'https://files.support.epson.com/pdf/dl_page_linked/epson_tds_usersmanual-revb-eai.pdf' },
    ],
    cta: { label: 'Browse projectors', href: '/products' },
  },
  {
    slug: 'ultra-short-throw-vs-standard-throw-projector',
    audience: 'Home buyers',
    title: 'Ultra-Short-Throw vs Standard-Throw Projectors',
    description: 'Choose between UST and standard throw by comparing room layout, screen requirements, installation flexibility and total system cost.',
    directAnswer: 'Choose ultra-short throw when you need a large image without a ceiling installation and can control cabinet and screen geometry. Choose standard throw when you have a clear projection path and value broader model choice, easier image alignment and a more flexible budget.',
    updatedAt: '2026-09-03',
    readTime: '6 min read',
    sections: [
      {
        title: 'When ultra-short throw is the better fit',
        checklist: [
          'The projector must stay at the front of the room.',
          'People frequently walk between the seating area and screen.',
          'A compatible cabinet and a flat, stable wall or fixed-frame screen are possible.',
          'You have budgeted for the complete projector-and-screen system, not only the projector.',
        ],
      },
      {
        title: 'When standard throw is the better fit',
        checklist: [
          'A ceiling mount or protected rear shelf is acceptable.',
          'You want a wider range of projector prices, lenses and performance profiles.',
          'You may change image size or room layout later.',
          'The projection path can remain clear during use.',
        ],
      },
      {
        title: 'The screen decision is part of the projector decision',
        paragraphs: ['UST projectors send light to the screen at a steep angle, so a screen designed for UST geometry is often important in rooms with ambient light. Standard-throw ambient-light-rejecting screens use a different optical structure. Do not assume one ALR screen type works correctly with both systems.'],
      },
      {
        title: 'Before you choose',
        checklist: [
          'Check the exact image size at the available distance.',
          'Allow space for connectors, ventilation and cabinet depth.',
          'Confirm whether the quoted price includes the screen, mount or cabinet.',
          'Compare regional firmware, apps, warranty and plug requirements.',
        ],
      },
    ],
    sources: [{ label: 'Epson: Throw Distance and Positioning', url: 'https://epson.com/projector-guide-how-to-buy-a-projector-throw-distance-and-positioning' }],
    cta: { label: 'Plan your room', href: '/solutions' },
  },
  {
    slug: 'ddp-vs-dap-projector-shipping',
    audience: 'Business buyers',
    title: 'DDP vs DAP for International Projector Shipping',
    description: 'Understand who handles import clearance, duties and taxes before approving an international projector order.',
    directAnswer: 'Under DDP, the seller is responsible for import clearance and applicable import duties and taxes up to the named destination. Under DAP, the seller delivers to the named place, but the buyer handles import clearance and import duties and taxes. Always record the exact Incoterm and named destination on the quotation.',
    updatedAt: '2026-09-03',
    readTime: '5 min read',
    sections: [
      {
        title: 'The practical difference',
        paragraphs: [
          'DDP can give the buyer a more predictable landed-cost experience, but it is only appropriate when the seller can legally and operationally complete import clearance. DAP may be more suitable when the buyer has an importer record, local broker or established customs process.',
          'Neither label should be treated as a vague synonym for free shipping or tax included. The named place, product classification and local import requirements still matter.',
        ],
      },
      {
        title: 'What a quotation should state',
        checklist: [
          'DDP or DAP followed by the precise named destination and “Incoterms 2020”.',
          'Whether unloading, remote-area charges or address corrections are excluded.',
          'Who provides importer information and product documentation.',
          'Chargeable weight rule, including the volumetric divisor used by the route.',
          'Transit-time estimate and what event starts that estimate.',
        ],
      },
      {
        title: 'How Reach Projector applies the terms',
        paragraphs: ['The checkout or quotation must identify the shipping term for the selected destination. A DAP route must not be presented as duty paid. Destinations without a validated automatic rate should remain on manual quotation until the route, chargeable-weight rule and customs responsibility have been confirmed.'],
      },
      {
        title: 'Important limitation',
        paragraphs: ['This guide is a purchasing checklist, not legal or customs advice. Import rules and the seller’s ability to use DDP vary by destination. Confirm the final term and named place on the commercial documents for each shipment.'],
      },
    ],
    sources: [
      { label: 'International Chamber of Commerce: Incoterms rules', url: 'https://iccwbo.org/business-solutions/incoterms-rules/' },
      { label: 'ICC Digital Library: Incoterms and commercial contracts', url: 'https://library.iccwbo.org/clp/clp-incoterms.htm' },
    ],
    cta: { label: 'Read our shipping policy', href: '/shipping-policy' },
  },
  {
    slug: 'projector-rfq-checklist-for-business-buyers',
    audience: 'Business buyers',
    title: 'Projector RFQ Checklist for Business Buyers',
    description: 'The information an AV installer, school, hotel, reseller or project buyer should include to receive a comparable projector quotation.',
    directAnswer: 'A useful projector RFQ defines the application, image size, room conditions, installation constraints, required quantity, destination and commercial terms. Model-only enquiries produce prices; complete briefs produce comparable solutions.',
    updatedAt: '2026-09-03',
    readTime: '7 min read',
    sections: [
      {
        title: 'Project and room information',
        checklist: [
          'Application: meeting room, classroom, hospitality, venue, rental, simulation or resale.',
          'Required image size, aspect ratio and number of rooms or systems.',
          'Throw distance, mounting position and installation drawings if available.',
          'Ambient-light conditions and expected hours of use.',
          'Signal sources, resolution, inputs, control system and network requirements.',
        ],
      },
      {
        title: 'Product and compliance information',
        checklist: [
          'Preferred brand or approved alternatives.',
          'Minimum usable brightness, resolution and lens requirements.',
          'Local voltage, plug, language and firmware requirements.',
          'Required certifications, warranty coverage and spare-unit expectations.',
          'Accessories: lenses, screens, mounts, cables, cases and replacement parts.',
        ],
      },
      {
        title: 'Commercial and delivery information',
        checklist: [
          'Quantity now and forecast quantity, clearly separated.',
          'Target delivery date and full destination postcode.',
          'Requested Incoterm and named place.',
          'Packaging, pallet, labeling or neutral-brand requirements.',
          'Payment method, inspection needs and required shipping documents.',
        ],
      },
      {
        title: 'How to compare quotations',
        paragraphs: ['Normalize each offer before comparing it: model configuration, included accessories, warranty region, shipping term, taxes, lead time and chargeable weight. A lower unit price can become the higher landed cost when these fields are different.'],
      },
    ],
    sources: [
      { label: 'Epson: Throw Distance and Positioning', url: 'https://epson.com/projector-guide-how-to-buy-a-projector-throw-distance-and-positioning' },
      { label: 'International Chamber of Commerce: Incoterms rules', url: 'https://iccwbo.org/business-solutions/incoterms-rules/' },
    ],
    cta: { label: 'Request a project quotation', href: '/wholesale' },
  },
]

export function getBuyingGuide(slug: string) {
  return buyingGuides.find((guide) => guide.slug === slug)
}
