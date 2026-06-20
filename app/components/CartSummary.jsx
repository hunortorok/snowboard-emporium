import {CartForm, Money} from '@shopify/hydrogen';
import {useEffect, useRef} from 'react';
import {Link, useFetcher} from 'react-router';
import {useUIStore} from '~/stores/ui.store';

export function CartSummary({cart, layout}) {
  const className =
    layout === 'page'
      ? 'relative'
      : 'bg-powder-blue-50 border-t border-dark bottom-0 pt-3 mb-4 absolute w-[calc(var(--aside-width)-40px)]';

  const subTotalClassName =
    layout === 'page'
      ? 'flex items-center gap-2 py-3 border-t border-ash-brown-200'
      : 'flex items-center justify-between py-3 border-t border-ash-brown-200';
  return (
    <div aria-labelledby="cart-summary" className={className}>
      <div className="md:mx-auto">
        <dl className={subTotalClassName}>
          <dt className="font-heading font-semibold text-sm text-twilight-indigo-900">
            Subtotal
          </dt>
          <dd className="font-heading font-bold text-twilight-indigo-900">
            {cart?.cost?.subtotalAmount?.amount ? (
              <Money data={cart?.cost?.subtotalAmount} />
            ) : (
              '-'
            )}
          </dd>
        </dl>
        <CartDiscounts discountCodes={cart?.discountCodes} />
        <CartGiftCard giftCardCodes={cart?.appliedGiftCards} />
      </div>
      <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} layout={layout} />
    </div>
  );
}

function CartCheckoutActions({checkoutUrl, layout}) {
  const closeCart = useUIStore((s) => s.closeCart);
  if (!checkoutUrl) return null;

  return (
    <div className="mt-3 flex flex-col gap-2">
      <a
        href={checkoutUrl}
        target="_self"
        className="block w-full bg-twilight-indigo-800 hover:bg-twilight-indigo-900 text-white text-center font-heading font-semibold text-sm tracking-wide py-4 rounded-lg transition-colors hover:no-underline"
      >
        Continue to Checkout &rarr;
      </a>
      {layout === 'aside' && (
        <Link
          to="/cart"
          onClick={closeCart}
          prefetch="intent"
          className="block w-full bg-powder-petal-300 hover:bg-powder-petal-400 text-twilight-indigo-900 text-center font-heading font-semibold text-sm tracking-wide py-4 rounded-lg transition-colors hover:no-underline"
        >
          View My Cart
        </Link>
      )}
    </div>
  );
}

function CartDiscounts({discountCodes}) {
  const codes =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div>
      <dl hidden={!codes.length}>
        <div>
          <dt>Discount(s)</dt>
          <UpdateDiscountForm>
            <div className="flex items-center mt-1">
              <code>{codes?.join(', ')}</code>
              &nbsp;
              <button type="submit" aria-label="Remove discount">
                Remove
              </button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      <UpdateDiscountForm discountCodes={codes}>
        <div>
          <label htmlFor="discount-code-input" className="sr-only">
            Discount code
          </label>
          <input
            id="discount-code-input"
            type="text"
            name="discountCode"
            placeholder="Discount code"
          />
          &nbsp;
          <button type="submit" aria-label="Apply discount code">
            Apply
          </button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({discountCodes, children}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

function CartGiftCard({giftCardCodes}) {
  const giftCardCodeInput = useRef(null);
  const giftCardAddFetcher = useFetcher({key: 'gift-card-add'});

  useEffect(() => {
    if (giftCardAddFetcher.data) {
      giftCardCodeInput.current.value = '';
    }
  }, [giftCardAddFetcher.data]);

  return (
    <div>
      {giftCardCodes && giftCardCodes.length > 0 && (
        <dl>
          <dt>Applied Gift Card(s)</dt>
          {giftCardCodes.map((giftCard) => (
            <RemoveGiftCardForm key={giftCard.id} giftCardId={giftCard.id}>
              <div className="flex items-center mt-1">
                <code>***{giftCard.lastCharacters}</code>
                &nbsp;
                <Money data={giftCard.amountUsed} />
                &nbsp;
                <button type="submit">Remove</button>
              </div>
            </RemoveGiftCardForm>
          ))}
        </dl>
      )}

      <AddGiftCardForm fetcherKey="gift-card-add">
        <div>
          <input
            type="text"
            name="giftCardCode"
            placeholder="Gift card code"
            ref={giftCardCodeInput}
          />
          &nbsp;
          <button type="submit" disabled={giftCardAddFetcher.state !== 'idle'}>
            Apply
          </button>
        </div>
      </AddGiftCardForm>
    </div>
  );
}

function AddGiftCardForm({fetcherKey, children}) {
  return (
    <CartForm
      fetcherKey={fetcherKey}
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesAdd}
    >
      {children}
    </CartForm>
  );
}

function RemoveGiftCardForm({giftCardId, children}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesRemove}
      inputs={{
        giftCardCodes: [giftCardId],
      }}
    >
      {children}
    </CartForm>
  );
}
