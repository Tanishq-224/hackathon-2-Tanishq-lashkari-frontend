import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ThemeProvider, useTheme } from '@/providers/ThemeProvider'

/**
 * @description Test helper that exposes resolved theme in the DOM.
 * @returns {JSX.Element} Debug element with current resolved theme.
 */
function ThemeProbe() {
  const { resolvedTheme } = useTheme()
  return <span data-testid="resolved-theme">{resolvedTheme}</span>
}

/**
 * @description Test helper button wired to theme toggle.
 * @returns {JSX.Element} Button that toggles theme.
 */
function ToggleButton() {
  const { toggleTheme } = useTheme()
  return (
    <button type="button" onClick={toggleTheme}>
      Toggle
    </button>
  )
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('toggles the document dark class and resolved theme', async () => {
    const user = userEvent.setup()

    render(
      <ThemeProvider>
        <ThemeProbe />
        <ToggleButton />
      </ThemeProvider>,
    )

    // Default theme is now dark
    expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    await user.click(screen.getByRole('button', { name: 'Toggle' }))

    expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
