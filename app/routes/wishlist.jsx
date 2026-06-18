import {Link} from 'react-router';
import {useWishlistStore} from '~/stores/wishlist.store';
import {ProductItem} from '~/components/ProductItem';

export const meta = () => [{title: 'Wishlist | Snowboard Emporium'}];

export default function Wishlist() {
  const items = useWishlistStore((s) => s.items);
  const hasHydrated = useWishlistStore((s) => s.hasHydrated);
  const clear = useWishlistStore((s) => s.clear);

  if (!hasHydrated) {
    return <div className="p-8" />;
  }

  return (
    <div className="p-8">
      <h1>Wishlist</h1>
      {items.length === 0 ? (
        <p>
          No favorites yet.{' '}
          <Link to="/collections/all">Browse all products</Link>
        </p>
      ) : (
        <>
          <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(var(--grid-item-width),1fr))] mb-8">
            {items.map((product) => (
              <ProductItem key={product.id} product={product} />
            ))}
          </div>
          <button
            className="mt-4 px-4 py-2 border border-current bg-transparent cursor-pointer text-[0.85rem] hover:bg-[#f5f5f5]"
            onClick={clear}
          >
            Clear wishlist
          </button>
        </>
      )}
    </div>
  );
}
