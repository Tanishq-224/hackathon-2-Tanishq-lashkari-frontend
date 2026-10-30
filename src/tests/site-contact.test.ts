import { maskPhoneLastFour, SITE_CONTACT } from '@/lib/site-contact'

describe('maskPhoneLastFour', () => {
  it('masks the last four digits of an Indian E.164 number', () => {
    expect(maskPhoneLastFour('+919876543210')).toBe('+91 98765 4XXXX')
  })

  it('exposes masked phone in SITE_CONTACT', () => {
    expect(SITE_CONTACT.phoneDisplay).toBe('+91 98765 4XXXX')
  })
})
