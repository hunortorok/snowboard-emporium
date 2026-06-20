import {Await} from 'react-router';
import {Suspense, useEffect} from 'react';
import {CartMain} from '~/components/CartMain';
import {useUIStore} from '~/stores/ui.store';

export function CartDrawer({cart}) {
  const isCartOpen = useUIStore((s) => s.isCartOpen);
  const closeCart = useUIStore((s) => s.closeCart);

  useEffect(() => {
    if (!isCartOpen) return;
    const controller = new AbortController();
    document.addEventListener(
      'keydown',
      (e) => {
        if (e.key === 'Escape') closeCart();
      },
      {signal: controller.signal},
    );
    return () => controller.abort();
  }, [isCartOpen, closeCart]);

  return (
    <div aria-modal className={`overlay ${isCartOpen ? 'expanded' : ''}`} role="dialog">
      <button className="close-outside" onClick={closeCart} />
      <aside className="!bg-powder-blue-50">
        <header className="bg-twilight-indigo-700 !border-b-2 !border-powder-petal-500">
          <h3 className="text-powder-blue-200">CART</h3>
          <button
            className="close reset text-powder-blue-200 hover:no-underline transition-transform duration-200 hover:rotate-90 hover:scale-[1.5] origin-center cursor-pointer"
            onClick={closeCart}
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>
        <main className="bg-powder-blue-50">
          <Suspense fallback={<p>Loading cart ...</p>}>
            <Await resolve={cart}>
              {(resolvedCart) => <CartMain cart={resolvedCart} layout="aside" />}
            </Await>
          </Suspense>
        </main>
      </aside>
    </div>
  );
}
