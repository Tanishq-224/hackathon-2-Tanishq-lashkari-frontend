import {
  emailField,
  otpField,
  parseMoneyInput,
  personNameField,
  sanitizeOtpInput,
} from '@/lib/validation/fields'

describe('validation fields', () => {
  it('accepts international person names', () => {
    expect(personNameField.safeParse('Tanishq Lashkari').success).toBe(true)
    expect(personNameField.safeParse('María-José').success).toBe(true)
  })

  it('rejects numeric characters in names', () => {
    expect(personNameField.safeParse('Alex123').success).toBe(false)
  })

  it('sanitizes OTP input without coercing to number', () => {
    expect(sanitizeOtpInput('01a2b3456')).toBe('012345')
  })

  it('parses valid money strings with up to two decimals', () => {
    expect(parseMoneyInput('49.99')).toBe(49.99)
    expect(parseMoneyInput('10')).toBe(10)
    expect(parseMoneyInput('10.999')).toBeNull()
    expect(parseMoneyInput('abc')).toBeNull()
  })

  it('lowercases email on parse', () => {
    const result = emailField.safeParse('Team@Repairex.COM')
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toBe('team@repairex.com')
    }
  })

  it('validates OTP pattern', () => {
    expect(otpField.safeParse('000001').success).toBe(true)
    expect(otpField.safeParse('00001').success).toBe(false)
  })
})
