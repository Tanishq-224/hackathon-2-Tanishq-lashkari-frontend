/**
 * @description Masks the last four digits of a phone number with `XXXX` for public display.
 * @param {string} phone - Raw or formatted phone (e.g. E.164 or spaced groups).
 * @returns {string} Display-safe phone string.
 */
export function maskPhoneLastFour(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length <= 4) {
    return 'XXXX'
  }

  let local = digits
  let countryPrefix = ''

  if (digits.startsWith('91') && digits.length >= 12) {
    countryPrefix = '+91 '
    local = digits.slice(2, 12)
  } else if (digits.length === 10) {
    countryPrefix = '+91 '
  } else if (phone.trimStart().startsWith('+')) {
    countryPrefix = '+'
  }

  const visible = local.slice(0, -4)
  const tail = visible.slice(-1)
  const head = visible.slice(0, -1)

  if (countryPrefix === '+91 ' && visible.length >= 5) {
    const firstBlock = head.slice(0, 5)
    const secondPrefix = head.slice(5) + tail
    return `${countryPrefix}${firstBlock} ${secondPrefix}XXXX`
  }

  return `${countryPrefix}${visible}XXXX`.trim()
}

/** @description Full number for tel: links (not shown in UI). */
const PHONE_E164 = '+919876543210'

/**
 * @description Placeholder public contact details for marketing footer and Contact page (replace when verified).
 */
export const SITE_CONTACT = {
  phoneDisplay: maskPhoneLastFour(PHONE_E164),
  phoneHref: `tel:${PHONE_E164.replace(/\s/g, '')}`,
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
