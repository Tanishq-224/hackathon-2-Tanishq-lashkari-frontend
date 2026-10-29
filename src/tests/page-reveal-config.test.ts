import {
  isRevealEligiblePath,
  PAGE_REVEAL_CONFIG,
} from '@/components/reveal/page-reveal-config'

describe('page reveal config', () => {
  it('includes home, about, and contact', () => {
    expect(isRevealEligiblePath('/')).toBe(true)
    expect(isRevealEligiblePath('/about')).toBe(true)
    expect(isRevealEligiblePath('/contact')).toBe(true)
  })

  it('excludes auth and dashboard paths by default', () => {
    expect(isRevealEligiblePath('/login')).toBe(false)
    expect(isRevealEligiblePath('/dashboard')).toBe(false)
    expect(isRevealEligiblePath('/dashboard/repairs/abc')).toBe(false)
  })

  it('can include auth routes when configured', () => {
    expect(
      isRevealEligiblePath('/login', {
        ...PAGE_REVEAL_CONFIG,
        includeAuthRoutes: true,
        publicPaths: PAGE_REVEAL_CONFIG.publicPaths,
      }),
    ).toBe(true)
  })
})
