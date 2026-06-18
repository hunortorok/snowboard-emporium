import {useLoaderData, Link} from 'react-router';
import {getPaginationVariables, Image} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {ImagePlaceholder} from '~/components/ImagePlaceholder';

export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, request}) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 4,
  });

  const [{collections}] = await Promise.all([
    context.storefront.query(COLLECTIONS_QUERY, {
      variables: paginationVariables,
    }),
  ]);

  return {collections};
}

function loadDeferredData() {
  return {};
}

export default function Collections() {
  const {collections} = useLoaderData();

  return (
    <div>
      <h1>Collections</h1>
      <PaginatedResourceSection
        connection={collections}
        resourcesClassName="grid gap-4 grid-cols-2 min-[45em]:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] mb-8"
      >
        {({node: collection, index}) => (
          <CollectionItem
            key={collection.id}
            collection={collection}
            index={index}
          />
        )}
      </PaginatedResourceSection>
    </div>
  );
}

function CollectionItem({collection, index}) {
  return (
    <Link
      key={collection.id}
      to={`/collections/${collection.handle}`}
      prefetch="intent"
      className="group relative rounded-xl overflow-hidden hover:no-underline"
    >
      <div className="aspect-square">
        {collection?.image ? (
          <Image
            alt={collection.image.altText || collection.title}
            aspectRatio="1/1"
            data={collection.image}
            loading={index < 3 ? 'eager' : undefined}
            sizes="(min-width: 45em) 400px, 100vw"
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <ImagePlaceholder
            label={`${collection.title} — collection image`}
          />
        )}
      </div>
      <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent flex items-end p-5">
        <h5 className="font-heading font-bold text-white text-xl m-0 group-hover:translate-y-[-2px] transition-transform duration-200">
          {collection.title}
        </h5>
      </div>
    </Link>
  );
}

const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }
  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;
