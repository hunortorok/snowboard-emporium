import {Suspense} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {useAnalytics, useOptimisticCart} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';
import {useUIStore} from '~/stores/ui.store';
import {useWishlistStore} from '~/stores/wishlist.store';

export function Header({header, cart, publicStoreDomain}) {
  const {shop, menu} = header;
  return (
    <header className="flex items-center bg-white h-16 px-4 sticky top-0 z-[1]">
      <NavLink prefetch="intent" to="/" style={activeLinkStyle} end>
        <strong className="font-heading">{shop.name}</strong>
      </NavLink>
      <HeaderMenu
        menu={menu}
        viewport="desktop"
        primaryDomainUrl={header.shop.primaryDomain.url}
        publicStoreDomain={publicStoreDomain}
      />
      <HeaderCtas cart={cart} />
    </header>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}) {
  const {close} = useAside();

  const navClassName =
    viewport === 'desktop'
      ? 'hidden gap-4 ml-12 min-[45em]:flex'
      : 'flex flex-col gap-4';

  return (
    <nav className={navClassName} role="navigation">
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          style={activeLinkStyle}
          to="/"
        >
          Home
        </NavLink>
      )}
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            className="cursor-pointer"
            end
            key={item.id}
            onClick={close}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

function HeaderCtas({cart}) {
  return (
    <nav className="flex items-center gap-4 ml-auto [&>*]:min-w-fit" role="navigation">
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
    <NavLink prefetch="intent" to="/wishlist" style={activeLinkStyle}>
      Wishlist {hasHydrated ? count : <span>&nbsp;</span>}
    </NavLink>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="reset min-[48em]:hidden"
      onClick={() => open('mobile')}
    >
      <h3>☰</h3>
    </button>
  );
}

function CartBadge({count}) {
  const openCart = useUIStore((s) => s.openCart);
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
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
      Cart {count === null ? <span>&nbsp;</span> : count}
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

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
  ],
};

function activeLinkStyle({isActive, isPending}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}
