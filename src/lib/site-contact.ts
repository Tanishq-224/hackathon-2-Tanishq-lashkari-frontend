/**
 * @description Placeholder public contact details for marketing footer and Contact page (replace when verified).
 */
export const SITE_CONTACT = {
  phoneDisplay: '+91 98765 43210',
  phoneHref: 'tel:+919876543210',
  email: 'support@repairex-demo.example',
  emailHref: 'mailto:support@repairex-demo.example',
  /** @description Compact address for footer and cards. */
  addressShort: 'Vijay Nagar, Indore, MP 452010',
  addressLines: ['Vijay Nagar, Indore', 'Madhya Pradesh 452010, India'],
  supportHours: 'Mon–Sat, 9:00 AM – 7:00 PM IST',
  /** @description OpenStreetMap embed (no API key) centered on the public address. */
  mapEmbedUrl:
    'https://www.openstreetmap.org/export/embed.html?bbox=75.8650%2C22.7350%2C75.9050%2C22.7650&layer=mapnik&marker=22.7500%2C75.8850',
  /** @description Opens the service location in the visitor's maps app. */
  mapDirectionsUrl:
    'https://www.google.com/maps/search/?api=1&query=Vijay+Nagar%2C+Indore%2C+Madhya+Pradesh+452010%2C+India',
} as const
