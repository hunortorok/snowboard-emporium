import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {WishlistButton} from '~/components/WishlistButton';
import {ImagePlaceholder} from '~/components/ImagePlaceholder';

export function ProductItem({product, loading}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;

  const wishlistSnapshot = {
    id: product.id,
    handle: product.handle,
    title: product.title,
    featuredImage: product.featuredImage,
    priceRange: product.priceRange,
  };

  return (
    <div className="group relative bg-white rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300">
      <Link prefetch="intent" to={variantUrl} className="block hover:no-underline">
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
        <div className="p-4 pb-5">
          <h4 className="font-heading font-semibold text-sm leading-snug text-twilight-indigo-900 mb-2 line-clamp-2 m-0">
            {product.title}
          </h4>
          <p className="text-base font-medium text-twilight-indigo-600 m-0">
            <Money data={product.priceRange.minVariantPrice} />
          </p>
        </div>
      </Link>
      <WishlistButton product={wishlistSnapshot} />
    </div>
  );
}
