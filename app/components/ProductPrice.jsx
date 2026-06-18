import {Money} from '@shopify/hydrogen';

export function ProductPrice({price, compareAtPrice}) {
  return (
    <div>
      {compareAtPrice ? (
        <div className="flex gap-2">
          {price ? <Money data={price} /> : null}
          <s className="opacity-50">
            <Money data={compareAtPrice} />
          </s>
        </div>
      ) : price ? (
        <Money data={price} />
      ) : (
        <span>&nbsp;</span>
      )}
    </div>
  );
}
