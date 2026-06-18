import {Await, useLoaderData, Link} from 'react-router';
import {Suspense} from 'react';
import {Image} from '@shopify/hydrogen';
import {ProductItem} from '~/components/ProductItem';
import {MockShopNotice} from '~/components/MockShopNotice';
import {Hero} from '~/components/Hero';


export const meta = () => {
  return [{title: 'Snowboard Emporium'}];
};

export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context}) {
  const [{collections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
  ]);

  return {
    isShopLinked: Boolean(context.env.PUBLIC_STORE_DOMAIN),
    featuredCollection: collections.nodes[0],
  };
}

function loadDeferredData({context}) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData();
  return (
    <div>
      {data.isShopLinked ? null : <MockShopNotice />}
      <Hero />
      <CategoryStrip />
      <FeaturedCollection collection={data.featuredCollection} />
      <BrandBand />
      <RecommendedProducts products={data.recommendedProducts} />
      <TrustStrip />
    </div>
  );
}

const CATEGORIES = [
  {
    label: 'Snowboards',
    url: '/collections/all',
    img: '/snowboards-category.jpg',
    alt: 'Snowboarder carving down a mountain slope',
    credit: {name: 'Mattias Olsson', photo: 'photo-1478700485868-972b69dc3fc4'},
  },
  {
    label: 'Bindings',
    url: '/collections/all',
    img: '/bindings-category.jpg',
    alt: 'Close-up of a multicoloured snowboard in spring snow',
    credit: {name: 'Dane Deaner', photo: 'photo-1498146831523-fbe41acdc5ad'},
  },
  {
    label: 'Boots',
    url: '/collections/all',
    img: '/snowboard-boots.jpg',
    alt: 'Snowboard boots in the snow',
    credit: null,
  },
  {
    label: 'Apparel',
    url: '/collections/all',
    img: '/apparel-category.jpg',
    alt: 'Snowboarder in a yellow jacket on the mountain',
    credit: {name: 'Alessandro Maculotti', photo: 'photo-1625154869776-100eba31abbb'},
  },
];

function CategoryStrip() {
  return (
    <section>
      <div className="grid grid-cols-2 min-[45em]:grid-cols-4 gap-3">
        {CATEGORIES.map(({label, url, img, alt, credit}) => (
          <Link
            key={label}
            to={url}
            prefetch="intent"
            className="group relative rounded-xl overflow-hidden hover:no-underline"
          >
            <div className="aspect-[3/4]">
              <img
                src={img}
                alt={alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
            </div>
            <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent flex items-end p-4">
              <span className="font-heading font-bold text-white text-lg leading-tight group-hover:-translate-y-0.5 transition-transform duration-200">
                {label}
              </span>
            </div>
            {credit && (
              <p className="absolute bottom-1 right-2 text-[9px] text-white/35 m-0 pointer-events-none">
                {credit.name} / Unsplash
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}

function FeaturedCollection({collection}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <section>
      <Link
        className="block relative rounded-xl overflow-hidden hover:no-underline"
        to={`/collections/${collection.handle}`}
      >
        <div className="aspect-[16/7]">
          {image ? (
            <Image
              data={image}
              sizes="100vw"
              className="h-full w-full object-cover"
            />
          ) : (
            <img
              src="/featured-collection.jpg"
              alt="Snowboarder on a mountain slope"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/20 to-transparent flex flex-col justify-end p-8 min-[45em]:p-12">
          <p className="text-xs font-heading font-semibold uppercase tracking-widest text-powder-petal-200 mb-2 m-0">
            Featured Collection
          </p>
          <h2 className="text-white font-extrabold m-0">{collection.title}</h2>
          <span className="inline-block mt-5 text-sm font-heading font-semibold text-white border border-white/50 px-6 py-2 rounded-lg w-fit hover:bg-white/10 transition-colors">
            Explore &rarr;
          </span>
        </div>
        {!image && (
          <p className="absolute bottom-2 right-3 text-[10px] text-white/35 m-0 pointer-events-none">
            Damiano Lingauri / Unsplash
          </p>
        )}
      </Link>
    </section>
  );
}

function BrandBand() {
  return (
    <section className="-mx-4 bg-twilight-indigo-900 text-white px-8 min-[45em]:px-16 py-16 min-[45em]:py-24">
      <div className="max-w-2xl">
        <p className="text-xs font-heading font-semibold uppercase tracking-widest text-powder-blue-400 mb-4 m-0">
          Built for the mountain
        </p>
        <h2
          className="text-white font-extrabold leading-none tracking-tight m-0"
          style={{fontSize: 'clamp(2.5rem, 6vw, 5rem)'}}
        >
          Every board.
          <br />
          Every line.
          <br />
          Every descent.
        </h2>
        <p className="mt-6 text-powder-blue-200 text-base min-[45em]:text-lg leading-relaxed max-w-lg">
          From hand-picked shapes to precision-tuned gear &mdash; we exist for
          riders who take the mountain seriously.
        </p>
        <Link
          to="/collections/all"
          className="inline-block mt-8 bg-powder-petal-400 hover:bg-powder-petal-500 text-white font-heading font-semibold text-sm px-8 py-3 rounded-lg transition-colors hover:no-underline"
        >
          Shop All Products
        </Link>
      </div>
    </section>
  );
}

function RecommendedProducts({products}) {
  return (
    <section>
      <h2>Fresh Drops</h2>
      <Suspense
        fallback={
          <div className="h-64 animate-pulse bg-ash-brown-100 rounded-xl" />
        }
      >
        <Await resolve={products}>
          {(response) => (
            <div className="grid gap-4 grid-cols-2 min-[45em]:grid-cols-4">
              {response
                ? response.products.nodes.map((product) => (
                    <ProductItem key={product.id} product={product} />
                  ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
    </section>
  );
}

const TRUST_ITEMS = [
  {
    title: 'Free Shipping',
    body: 'On all orders over $150',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    title: 'Easy Returns',
    body: '30-day hassle-free returns',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="1 4 1 10 7 10" />
        <path d="M3.51 15a9 9 0 1 0 .49-4.5" />
      </svg>
    ),
  },
  {
    title: 'Board Warranty',
    body: '2-year manufacturer warranty',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
];

function TrustStrip() {
  return (
    <section className="border-t border-ash-brown-200">
      <div className="grid grid-cols-1 min-[45em]:grid-cols-3 gap-6">
        {TRUST_ITEMS.map(({icon, title, body}) => (
          <div key={title} className="flex items-start gap-4 py-2">
            <span className="text-twilight-indigo-500 mt-0.5 shrink-0">
              {icon}
            </span>
            <div>
              <p className="font-heading font-semibold text-twilight-indigo-900 text-sm m-0">
                {title}
              </p>
              <p className="text-sm text-twilight-indigo-500 m-0">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
`;
