import {Image} from '@shopify/hydrogen';
import {ImagePlaceholder} from '~/components/ImagePlaceholder';

const THUMBS = [
  {
    src: '/product-thumb-detail.jpg',
    alt: 'Close-up detail of snowboard surface',
    credit: 'Dane Deaner',
  },
  {
    src: '/product-thumb-action.jpg',
    alt: 'Snowboarder performing a trick on slope',
    credit: 'Sebastian Staines',
  },
  {
    src: '/product-thumb-topsheet.jpg',
    alt: 'Snowboarder jumping on a mountain slope',
    credit: 'Matthieu Pétiard',
  },
];

export function ProductImage({image}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl overflow-hidden aspect-square bg-ash-brown-50">
        {image ? (
          <Image
            alt={image.altText || 'Product Image'}
            aspectRatio="1/1"
            data={image}
            key={image.id}
            sizes="(min-width: 45em) 50vw, 100vw"
            className="h-full w-full object-cover"
          />
        ) : (
          <ImagePlaceholder label="Main product shot" />
        )}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {THUMBS.map(({src, alt, credit}) => (
          <div key={src} className="rounded-lg overflow-hidden aspect-square opacity-70 relative group/thumb">
            <img src={src} alt={alt} className="w-full h-full object-cover" />
            <p className="absolute bottom-0.5 right-1 text-[8px] text-white/40 m-0 opacity-0 group-hover/thumb:opacity-100 transition-opacity">
              {credit} / Unsplash
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
