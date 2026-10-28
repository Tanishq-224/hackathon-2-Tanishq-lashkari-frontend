/**
 * @description Root application shell shown while Phase 0 tooling is wired up.
 * @returns {JSX.Element} Minimal Repairex placeholder with typography tokens applied.
 */
function App() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-off-white px-4 py-12 sm:py-16">
      <div
        className="mx-auto flex w-full flex-col items-center text-center"
        style={{ maxWidth: 'var(--container-repairex)' }}
      >
        <h1 className="text-hero font-bold text-signal-orange">Repairex</h1>
        <p className="mt-4 max-w-md text-body-lg text-slate-grey">
          Frontend foundation setup in progress. Public pages and dashboards
          come in later phases.
        </p>

        <section
          aria-label="Typography preview"
          className="mt-12 w-full max-w-lg border-t border-warm-stone pt-10 text-left sm:mt-14"
        >
          <h2 className="text-h2 font-semibold">
            Trusted repair, clear estimates
          </h2>
          <p className="mt-3 text-body text-slate-grey">
            Body copy uses Inter for readable UI across forms, tables, and
            dashboard content.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
            <div className="flex-1">
              <label
                htmlFor="typography-sample-email"
                className="text-ui font-medium text-graphite"
              >
                Email label
              </label>
              <input
                id="typography-sample-email"
                type="email"
                readOnly
                value="customer@example.com"
                className="mt-1.5 w-full rounded-md border border-warm-stone bg-off-white px-3 py-2 text-ui text-graphite"
              />
            </div>
            <button
              type="button"
              className="rounded-md bg-signal-orange px-4 py-2.5 text-ui font-semibold text-off-white"
            >
              Primary action
            </button>
          </div>
          <p className="mt-4 text-caption text-slate-grey">
            Navigation, buttons, and captions stay on Inter at tuned sizes for
            mobile through desktop.
          </p>
        </section>
      </div>
    </main>
  )
}

export default App
