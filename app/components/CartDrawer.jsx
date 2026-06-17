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
      <aside>
        <header>
          <h3>CART</h3>
          <button className="close reset" onClick={closeCart} aria-label="Close">
            &times;
          </button>
        </header>
        <main>
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
