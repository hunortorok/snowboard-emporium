import {Suspense} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {useAnalytics, useOptimisticCart} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';
import {useUIStore} from '~/stores/ui.store';
import {useWishlistStore} from '~/stores/wishlist.store';

const NAV_ITEMS = [
  {title: 'Products', url: '/collections/all'},
  {title: 'Collections', url: '/collections'},
];

export function Header({header, cart}) {
  const {shop} = header;
  return (
    <header className="flex items-center bg-twilight-indigo-700 border-b-2 border-powder-petal-500 h-16 px-4 min-[45em]:px-32 sticky top-0 z-[1]">
      <div className="flex-1">
        <NavLink prefetch="intent" to="/" end className="hover:no-underline">
          <span className="flex items-center gap-2">
            <span className="text-powder-petal-500">
              <SnowflakeIcon />
            </span>
            <strong className="font-heading text-powder-blue-200">
              {shop.name}
            </strong>
          </span>
        </NavLink>
      </div>
      <HeaderMenu viewport="desktop" />
      <div className="flex-1 flex justify-end">
        <HeaderCtas cart={cart} />
      </div>
    </header>
  );
}

export function HeaderMenu({viewport}) {
  const {close} = useAside();

  const navClassName =
    viewport === 'desktop'
      ? 'hidden gap-6 min-[45em]:flex'
      : 'flex flex-col gap-4 items-center';

  return (
    <nav className={navClassName} role="navigation">
      {NAV_ITEMS.map((item) => (
        <NavLink
          className={({isActive}) =>
            `cursor-pointer px-2 py-1 inline-flex flex-col items-center border-b-2 no-underline hover:no-underline after:block after:h-0 after:overflow-hidden after:invisible after:font-bold after:content-[attr(data-title)] transition-colors ${
              viewport === 'desktop' ? 'text-powder-blue-100' : 'text-twilight-indigo-700'
            } ${
              isActive
                ? 'border-powder-petal-500 font-bold'
                : 'border-transparent hover:font-bold'
            }`
          }
          data-title={item.title}
          end
          key={item.url}
          onClick={close}
          prefetch="intent"
          to={item.url}
        >
          {item.title}
        </NavLink>
      ))}
    </nav>
  );
}

function HeaderCtas({cart}) {
  return (
    <nav
      className="flex items-center gap-4 [&>*]:min-w-fit"
      role="navigation"
    >
      <HeaderMenuMobileToggle />
      <WishlistBadge />
      <CartToggle cart={cart} />
    </nav>
  );
}

function WishlistBadge() {
  const count = useWishlistStore((s) => s.items.length);
  const hasHydrated = useWishlistStore((s) => s.hasHydrated);

  return (
    <NavLink
      prefetch="intent"
      to="/wishlist"
      aria-label="Wishlist"
      className="relative flex items-center text-powder-blue-100"
    >
      <HeartIcon />
      {hasHydrated && count > 0 && (
        <span className="absolute -top-1 -right-2 bg-twilight-indigo-700 text-powder-blue-100 text-[10px] font-bold leading-none rounded-full w-4 h-4 flex items-center justify-center">
          {count}
        </span>
      )}
    </NavLink>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button className="reset min-[48em]:hidden text-powder-blue-100" onClick={() => open('mobile')}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>
  );
}

function CartBadge({count}) {
  const openCart = useUIStore((s) => s.openCart);
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
      aria-label="Cart"
      className="relative flex items-center gap-2 bg-powder-petal-500 text-white px-3 py-1.5 rounded-full text-sm font-medium hover:no-underline hover:bg-powder-petal-400 transition-colors"
      onClick={(e) => {
        e.preventDefault();
        openCart();
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        });
      }}
    >
      <CartIcon />
      <span>Cart</span>
      {count !== null && count > 0 && (
        <span className="absolute -top-1 -right-1 bg-twilight-indigo-900 text-powder-blue-100 text-[10px] font-bold leading-none rounded-full w-4 h-4 flex items-center justify-center">
          {count}
        </span>
      )}
    </a>
  );
}

function CartToggle({cart}) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue();
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

function SnowflakeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
      <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
      <polyline points="12 2 10 6 14 6 12 2" />
      <polyline points="12 22 10 18 14 18 12 22" />
      <polyline points="2 12 6 10 6 14 2 12" />
      <polyline points="22 12 18 10 18 14 22 12" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}
