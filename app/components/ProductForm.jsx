import {Link, useNavigate} from 'react-router';
import {AddToCartButton} from './AddToCartButton';
import {useUIStore} from '~/stores/ui.store';

export function ProductForm({productOptions, selectedVariant}) {
  const navigate = useNavigate();
  const openCart = useUIStore((s) => s.openCart);
  return (
    <div>
      {productOptions.map((option) => {
        if (option.optionValues.length === 1) return null;

        return (
          <div key={option.name}>
            <p className="text-xs font-heading font-semibold uppercase tracking-widest text-twilight-indigo-500 mb-2 mt-0">
              {option.name}
            </p>
            <div className="flex flex-wrap gap-2">
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                const hasSwatch = swatch?.color || swatch?.image;
                const pillClass = [
                  'inline-flex items-center justify-center rounded-md border-2 text-sm font-sans transition-all duration-150',
                  hasSwatch ? 'p-1' : 'px-4 py-2',
                  selected
                    ? 'border-twilight-indigo-800 bg-twilight-indigo-50 text-twilight-indigo-900 font-semibold'
                    : 'border-ash-brown-200 bg-white text-twilight-indigo-700',
                  exists && !selected
                    ? 'hover:border-twilight-indigo-500 cursor-pointer'
                    : '',
                  !available ? 'opacity-35 line-through' : '',
                ].join(' ');

                if (isDifferentProduct) {
                  return (
                    <Link
                      className={`${pillClass} hover:no-underline`}
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </Link>
                  );
                } else {
                  return (
                    <button
                      type="button"
                      className={pillClass}
                      key={option.name + name}
                      disabled={!exists}
                      onClick={() => {
                        if (!selected) {
                          void navigate(`?${variantUriQuery}`, {
                            replace: true,
                            preventScrollReset: true,
                          });
                        }
                      }}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </button>
                  );
                }
              })}
            </div>
            <br />
          </div>
        );
      })}
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          openCart();
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  selectedVariant,
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
      </AddToCartButton>
    </div>
  );
}

function ProductOptionSwatch({swatch, name}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return name;

  return (
    <div
      aria-label={name}
      className="w-5 h-5 my-1"
      style={{
        backgroundColor: color || 'transparent',
      }}
    >
      {!!image && <img src={image} alt={name} className="w-full" />}
    </div>
  );
}
