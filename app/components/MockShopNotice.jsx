export function MockShopNotice() {
  return (
    <section
      className="bg-white border border-black border-l-8 my-4"
      aria-labelledby="mock-shop-notice-heading"
    >
      <div className="px-4 py-3.5">
        <h2 id="mock-shop-notice-heading" className="text-[1.6rem] font-bold leading-snug">
          Welcome to Hydrogen!
        </h2>
        <p className="mb-2">
          You&rsquo;re seeing mocked products because no store is connected to
          this project yet.
        </p>
        <p className="mb-2">
          Link a store by running{' '}
          <code className="bg-black/[0.06] rounded px-[0.3em] py-[0.1em]">
            npx shopify hydrogen link
          </code>{' '}
          in your terminal.
        </p>
      </div>
    </section>
  );
}
