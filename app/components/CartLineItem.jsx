import {CartForm, Image} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import {ProductPrice} from './ProductPrice';
import {useUIStore} from '~/stores/ui.store';

export function CartLineItem({layout, line, childrenMap}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const closeCart = useUIStore((s) => s.closeCart);
  const lineItemChildren = childrenMap[id];
  const childrenLabelId = `cart-line-children-${id}`;

  return (
    <li key={id} className="py-4 border-b border-ash-brown-100 last:border-b-0">
      <div className="flex gap-3">
        {image && (
          <div className="rounded-lg overflow-hidden shrink-0 bg-ash-brown-50">
            <Image
              alt={title}
              aspectRatio="1/1"
              data={image}
              height={88}
              loading="lazy"
              width={88}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="flex-1 min-w-0 flex flex-col">
          <div>
            <Link
              prefetch="intent"
              to={lineItemUrl}
              className="hover:no-underline"
              onClick={() => {
                if (layout === 'aside') {
                  closeCart();
                }
              }}
            >
              <p className="font-heading font-semibold text-sm text-twilight-indigo-900 m-0 leading-snug line-clamp-2">
                {product.title}
              </p>
            </Link>
            <div className="mt-1">
              <ProductPrice price={line?.cost?.totalAmount} />
            </div>
          </div>
          <div className="mt-auto pt-2">
            <CartLineQuantity line={line} />
          </div>
        </div>
      </div>

      {lineItemChildren ? (
        <div>
          <p id={childrenLabelId} className="sr-only">
            Line items with {product.title}
          </p>
          <ul aria-labelledby={childrenLabelId} className="pl-8">
            {lineItemChildren.map((childLine) => (
              <CartLineItem
                childrenMap={childrenMap}
                key={childLine.id}
                line={childLine}
                layout={layout}
              />
            ))}
          </ul>
        </div>
      ) : null}
    </li>
  );
}

function CartLineQuantity({line}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="flex items-center border border-ash-brown-200 rounded-md overflow-hidden">
        <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
          <button
            aria-label="Decrease quantity"
            disabled={quantity <= 1 || !!isOptimistic}
            name="decrease-quantity"
            value={prevQuantity}
            className="w-8 h-8 flex items-center justify-center text-twilight-indigo-700 hover:bg-ash-brown-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            &#8722;
          </button>
        </CartLineUpdateButton>
        <span className="px-2 text-sm font-medium text-twilight-indigo-900 min-w-[1.5rem] text-center">
          {quantity}
        </span>
        <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
          <button
            aria-label="Increase quantity"
            name="increase-quantity"
            value={nextQuantity}
            disabled={!!isOptimistic}
            className="w-8 h-8 flex items-center justify-center text-twilight-indigo-700 hover:bg-ash-brown-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            &#43;
          </button>
        </CartLineUpdateButton>
      </div>
      <CartLineRemoveButton lineIds={[lineId]} disabled={!!isOptimistic} />
    </div>
  );
}

function CartLineRemoveButton({lineIds, disabled}) {
  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button
        disabled={disabled}
        type="submit"
        className="text-xs text-twilight-indigo-400 hover:text-powder-blush-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Remove
      </button>
    </CartForm>
  );
}

function CartLineUpdateButton({children, lines}) {
  const lineIds = lines.map((line) => line.id);

  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

function getUpdateKey(lineIds) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}
