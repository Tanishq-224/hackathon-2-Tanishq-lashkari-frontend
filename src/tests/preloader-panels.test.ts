import {
  getPreloaderPanelCount,
  getPreloaderPanelExitOrder,
} from '@/components/preloader/preloader-panels'

describe('preloader panel breakpoints', () => {
  it('uses 2 columns on mobile', () => {
    expect(getPreloaderPanelCount(390)).toBe(2)
    expect(getPreloaderPanelCount(767)).toBe(2)
  })

  it('uses 3 columns on tablet', () => {
    expect(getPreloaderPanelCount(768)).toBe(3)
    expect(getPreloaderPanelCount(1023)).toBe(3)
  })

  it('uses 4 columns on desktop', () => {
    expect(getPreloaderPanelCount(1024)).toBe(4)
  })

  it('exit order matches column count', () => {
    expect(getPreloaderPanelExitOrder(2)).toEqual([0, 1])
    expect(getPreloaderPanelExitOrder(3)).toEqual([0, 2, 1])
    expect(getPreloaderPanelExitOrder(4)).toEqual([0, 2, 1, 3])
  })
})
