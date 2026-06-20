import {Link} from 'react-router';
import {Image, Money, CartForm} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {WishlistButton} from '~/components/WishlistButton';
import {ImagePlaceholder} from '~/components/ImagePlaceholder';

export function ProductItem({product, loading}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  const firstVariant = product.variants?.nodes?.[0];

  const wishlistSnapshot = {
    id: product.id,
    handle: product.handle,
    title: product.title,
    featuredImage: product.featuredImage,
    priceRange: product.priceRange,
  };

  return (
    <div className="relative rounded-md overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300 flex flex-col">
      <Link prefetch="intent" to={variantUrl} className="group block hover:no-underline">
        <div className="overflow-hidden aspect-square">
          {image ? (
            <Image
              alt={image.altText || product.title}
              aspectRatio="1/1"
              data={image}
              loading={loading}
              sizes="(min-width: 45em) 400px, 100vw"
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <ImagePlaceholder label={`${product.title} — product shot`} />
          )}
        </div>
      </Link>
      <div className="p-4 pb-5 bg-powder-blue-200 flex flex-col flex-1">
        <Link prefetch="intent" to={variantUrl} className="hover:no-underline flex flex-col flex-1">
          <h4 className="font-heading font-semibold text-base leading-snug text-twilight-indigo-900 mb-2 line-clamp-3 min-h-[4.125rem] m-0">
            {product.title}
          </h4>
          <div className="flex items-center gap-3 mt-auto">
            <p className="text-sm font-medium text-twilight-indigo-600 m-0">
              <Money data={product.priceRange.minVariantPrice} />
            </p>
            {firstVariant && (
              <span className={`flex items-center gap-1 text-xs font-medium ${firstVariant.availableForSale ? 'text-pine-green' : 'text-mustard-yellow'}`}>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                {firstVariant.availableForSale ? 'In stock' : 'Out of stock'}
              </span>
            )}
          </div>
        </Link>
      </div>
      {firstVariant && (
        <CartForm
          route="/cart"
          inputs={{lines: [{merchandiseId: firstVariant.id, quantity: 1}]}}
          action={CartForm.ACTIONS.LinesAdd}
        >
          {(fetcher) => (
            <button
              type="submit"
              aria-label="Add to cart"
              disabled={!firstVariant.availableForSale || fetcher.state !== 'idle'}
              className="absolute bottom-4 right-4 w-9 h-9 rounded-lg bg-powder-petal-500 hover:bg-powder-petal-400 text-white flex items-center justify-center transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <CartIcon />
            </button>
          )}
        </CartForm>
      )}
      <WishlistButton product={wishlistSnapshot} />
    </div>
  );
}

function CartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
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
