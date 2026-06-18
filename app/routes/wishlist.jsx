import {Link} from 'react-router';
import {useWishlistStore} from '~/stores/wishlist.store';
import {ProductItem} from '~/components/ProductItem';

export const meta = () => [{title: 'Wishlist | Snowboard Emporium'}];

export default function Wishlist() {
  const items = useWishlistStore((s) => s.items);
  const hasHydrated = useWishlistStore((s) => s.hasHydrated);
  const clear = useWishlistStore((s) => s.clear);

  if (!hasHydrated) {
    return <div className="min-h-[40vh]" />;
  }

  return (
    <div>
      <div className="flex items-baseline gap-4 mb-8">
        <h1 className="m-0">Wishlist</h1>
        {items.length > 0 && (
          <span className="text-sm text-twilight-indigo-400">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center text-center py-16 gap-6">
          <div className="w-48 rounded-2xl overflow-hidden opacity-60 relative">
            <img
              src="/wishlist-empty.jpg"
              alt="Snowboarder sitting on a snowy mountain peak"
              className="w-full h-full object-cover aspect-square"
            />
            <p className="absolute bottom-1 right-1 text-[8px] text-white/40 m-0 pointer-events-none">
              S. Arkwright / Unsplash
            </p>
          </div>
          <div>
            <p className="font-heading font-semibold text-twilight-indigo-800 text-lg mb-2">
              Nothing saved yet
            </p>
            <p className="text-twilight-indigo-500 text-sm mb-6">
              Hit the heart icon on any product to save it here.
            </p>
            <Link
              to="/collections/all"
              className="inline-block bg-twilight-indigo-800 hover:bg-twilight-indigo-900 text-white font-heading font-semibold text-sm px-8 py-3 rounded-lg transition-colors hover:no-underline"
            >
              Browse all products
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 grid-cols-2 min-[45em]:grid-cols-[repeat(auto-fit,minmax(260px,1fr))] mb-8">
            {items.map((product) => (
              <ProductItem key={product.id} product={product} />
            ))}
          </div>
          <button
            className="text-sm text-twilight-indigo-400 hover:text-powder-blush-500 transition-colors border border-ash-brown-200 hover:border-powder-blush-300 px-5 py-2 rounded-lg cursor-pointer bg-transparent"
            onClick={clear}
          >
            Clear wishlist
          </button>
        </>
      )}
    </div>
  );
}
