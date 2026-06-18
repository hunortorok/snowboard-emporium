import {Link} from 'react-router';
import {useWishlistStore} from '~/stores/wishlist.store';
import {ProductItem} from '~/components/ProductItem';

export const meta = () => [{title: 'Wishlist | Snowboard Emporium'}];

export default function Wishlist() {
  const items = useWishlistStore((s) => s.items);
  const hasHydrated = useWishlistStore((s) => s.hasHydrated);
  const clear = useWishlistStore((s) => s.clear);

  if (!hasHydrated) {
    return <div className="wishlist" />;
  }

  return (
    <div className="wishlist">
      <h1>Wishlist</h1>
      {items.length === 0 ? (
        <p>
          No favorites yet.{' '}
          <Link to="/collections/all">Browse all products</Link>
        </p>
      ) : (
        <>
          <div className="products-grid">
            {items.map((product) => (
              <ProductItem key={product.id} product={product} />
            ))}
          </div>
          <button className="wishlist-clear" onClick={clear}>
            Clear wishlist
          </button>
        </>
      )}
    </div>
  );
}
