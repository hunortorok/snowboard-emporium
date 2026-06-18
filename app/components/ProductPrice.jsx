import {Money} from '@shopify/hydrogen';

export function ProductPrice({price, compareAtPrice, size = 'default'}) {
  const priceClass =
    size === 'large'
      ? 'font-heading font-bold text-2xl text-twilight-indigo-900'
      : 'font-medium text-twilight-indigo-700';
  const compareClass =
    size === 'large'
      ? 'text-lg text-powder-blush-500 line-through opacity-75'
      : 'text-sm text-powder-blush-400 line-through opacity-75';

  return (
    <div className="flex items-baseline gap-3">
      {compareAtPrice ? (
        <>
          {price ? (
            <span className={priceClass}>
              <Money data={price} />
            </span>
          ) : null}
          <span className={compareClass}>
            <Money data={compareAtPrice} />
          </span>
        </>
      ) : price ? (
        <span className={priceClass}>
          <Money data={price} />
        </span>
      ) : (
        <span>&nbsp;</span>
      )}
    </div>
  );
}
