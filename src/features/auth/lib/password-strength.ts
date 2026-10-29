export type PasswordRule = {
  id: string
  label: string
  satisfied: boolean
}

export type PasswordStrength = {
  score: number
  label: 'Too weak' | 'Weak' | 'Fair' | 'Good' | 'Strong'
  colorClass: string
  barColorClass: string
  rules: PasswordRule[]
  hasMinLength: boolean
  hasLetter: boolean
  hasNumber: boolean
  hasSpecial: boolean
  isValid: boolean
}

/**
 * @description Evaluates password strength and individual alphanumeric/character requirement rules.
 * @param {string} password - Current password input string.
 * @returns {PasswordStrength} Score, strength label, dynamic styling tokens, and rules checklist.
 */
export function getPasswordStrength(password: string): PasswordStrength {
  const hasMinLength = password.length >= 8
  const hasLetter = /[A-Za-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecial = /[^A-Za-z0-9]/.test(password)

  const rules: PasswordRule[] = [
    {
      id: 'length',
      label: 'At least 8 characters',
      satisfied: hasMinLength,
    },
    {
      id: 'letter',
      label: 'At least 1 letter (a-z, A-Z)',
      satisfied: hasLetter,
    },
    {
      id: 'number',
      label: 'At least 1 number (0-9)',
      satisfied: hasNumber,
    },
    {
      id: 'special',
      label: 'At least 1 special symbol (!@#$...)',
      satisfied: hasSpecial,
    },
  ]

  const passedCount = rules.filter((r) => r.satisfied).length

  let score = 0
  if (password.length > 0) {
    if (passedCount <= 1) score = 1
    else if (passedCount === 2) score = 2
    else if (passedCount === 3) score = 3
    else if (passedCount === 4) {
      score = password.length >= 10 ? 4 : 3
    }
  }

  let label: PasswordStrength['label'] = 'Too weak'
  let colorClass = 'text-muted-foreground'
  let barColorClass = 'bg-muted'

  if (password.length > 0) {
    barColorClass = 'bg-primary'
    colorClass = 'text-primary'
    switch (score) {
      case 1:
        label = 'Weak'
        break
      case 2:
        label = 'Fair'
        break
      case 3:
        label = 'Good'
        break
      case 4:
        label = 'Strong'
        break
    }
  }

  const isValid = hasMinLength && hasNumber && hasSpecial

  return {
    score,
    label,
    colorClass,
    barColorClass,
    rules,
    hasMinLength,
    hasLetter,
    hasNumber,
    hasSpecial,
    isValid,
  }
}
