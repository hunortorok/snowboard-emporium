import {Image} from '@shopify/hydrogen';

export function ProductImage({image}) {
  if (!image) {
    return <div />;
  }
  return (
    <div>
      <Image
        alt={image.altText || 'Product Image'}
        aspectRatio="1/1"
        data={image}
        key={image.id}
        sizes="(min-width: 45em) 50vw, 100vw"
        className="h-auto w-full"
      />
    </div>
  );
}
