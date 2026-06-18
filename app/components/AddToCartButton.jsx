import {CartForm} from '@shopify/hydrogen';

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            type="submit"
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
            className="w-full bg-twilight-indigo-800 hover:bg-twilight-indigo-900 active:bg-twilight-indigo-950 text-white font-heading font-semibold text-sm tracking-wide py-4 px-8 rounded-lg transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
}
