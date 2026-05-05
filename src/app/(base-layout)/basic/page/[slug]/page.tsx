import { Text } from '@/components/Text';
import ImageBlock, { ImageBlockFragment } from '@/components/blocks/ImageBlock';
import ImageGalleryBlock, {
  ImageGalleryBlockFragment,
} from '@/components/blocks/ImageGalleryBlock';
import { VideoBlockFragment } from '@/components/blocks/VideoBlock';
import PageInline, { PageInlineFragment } from '@/components/inlineRecords/PageInline';
import PageLink, { PageLinkFragment } from '@/components/linkToRecords/PageLink';
import { TagFragment } from '@/lib/datocms/commonFragments';
import { executeQuery } from '@/lib/datocms/executeQuery';
import { generateMetadataFn } from '@/lib/datocms/generateMetadataFn';
import { graphql, type ResultOf, type VariablesOf } from '@/lib/datocms/graphql';
import dynamic from 'next/dynamic';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';

/**
 * Caching behavior:
 *
 * This page is dynamically rendered on each request (due to the `draftMode()`
 * call), but the GraphQL data is cached via `executeQuery()` using
 * `cache: 'force-cache'` with the tag 'datocms'. This means that regular
 * visitors won't generate additional calls to DatoCMS.
 *
 * Cache invalidation happens when DatoCMS sends a webhook that triggers
 * `revalidateTag('datocms')`. Note that on Vercel, the Data Cache persists
 * across deployments — new deploys alone won't invalidate cached data. If you
 * need fresh data after deploy, trigger the webhook or purge the cache manually.
 *
 * @see src/lib/datocms/executeQuery.ts for caching implementation details
 * @see src/app/api/invalidate-cache/route.tsx for webhook-based cache invalidation
 */

/*
 * By using next/dynamic, the components will not be included in the page's
 * initial JavaScript bundle. It allows you to defer loading of Client
 * Components and imported libraries, and only include them in the client bundle
 * when they're needed.
 */
const VideoBlock = dynamic(() => import('@/components/blocks/VideoBlock'));

/**
 * The GraphQL query that will be executed for this route to generate the page
 * content and metadata.
 *
 * The page composes one query from the fragments exported by every
 * sub-component it renders: the imports list mirrors the second argument of
 * `graphql(...)` — adding `...FooFragment` to the query string means also
 * adding `FooFragment` to the imports and to the composition array.
 *
 * Thanks to gql.tada, the result will be fully typed!
 */
const query = graphql(
  /* GraphQL */ `
    query BasicPageQuery($slug: String!) {
      page(filter: { slug: { eq: $slug } }) {
        _seoMetaTags {
          ...TagFragment
        }
        title
        _firstPublishedAt
        structuredText {
          value
          blocks {
            ... on RecordInterface {
              id
              __typename
            }
            ...ImageBlockFragment
            ...ImageGalleryBlockFragment
            ...VideoBlockFragment
          }
          links {
            ... on RecordInterface {
              id
              __typename
            }
            ...PageInlineFragment
            ...PageLinkFragment
          }
        }
      }
    }
  `,
  [
    TagFragment,
    ImageBlockFragment,
    ImageGalleryBlockFragment,
    VideoBlockFragment,
    PageInlineFragment,
    PageLinkFragment,
  ],
);

type PageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * We use a helper to generate function that fits the Next.js
 * `generateMetadata()` format, automating the creation of meta tags based on
 * the `_seoMetaTags` present in a DatoCMS GraphQL query.
 */
export const generateMetadata = generateMetadataFn<
  PageProps,
  ResultOf<typeof query>,
  VariablesOf<typeof query>
>({
  query,
  // A callback that picks the SEO meta tags from the result of the query
  pickSeoMetaTags: (data) => data.page?._seoMetaTags,
  buildQueryVariables: async ({ params }) => {
    const { slug } = await params;
    return { slug };
  },
});

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const { isEnabled: isDraftModeEnabled } = await draftMode();

  const { page } = await executeQuery(query, {
    variables: { slug },
    includeDrafts: isDraftModeEnabled,
  });

  if (!page) {
    notFound();
  }

  return (
    <>
      <h1>{page.title}</h1>
      {/*
       * Structured Text is a JSON format similar to HTML, but with the advantage
       * of a significantly reduced and tailored set of possible tags
       * for editorial content, along with the capability to create hyperlinks
       * to other DatoCMS records and embed custom DatoCMS blocks.
       *
       * `<Text />` is the project-wide wrapper around `<StructuredText />` from
       * `react-datocms`. It bakes in:
       *   - the `data-datocms-content-link-group` attribute (required by Visual
       *     Editing click-to-edit)
       *   - default `customNodeRules` (e.g. code blocks, headings with anchor
       *     links)
       *
       * Per-route concerns — `renderBlock`, `renderInlineRecord`,
       * `renderLinkToRecord`, which depend on which models THIS specific
       * structured-text field accepts — are still passed in here.
       */}
      <Text
        data={page.structuredText}
        renderBlock={
          /*
           * If the structured text embeds any blocks, it's up to you to decide
           * how to render them:
           */
          ({ record }) => {
            switch (record.__typename) {
              case 'VideoBlockRecord':
                return <VideoBlock data={record} />;
              case 'ImageBlockRecord':
                return <ImageBlock data={record} />;
              case 'ImageGalleryBlockRecord':
                return <ImageGalleryBlock data={record} />;
              default:
                return null;
            }
          }
        }
        renderInlineRecord={
          /*
           * If the structured text includes a reference to another DatoCMS
           * record, it's up to you to decide how to render them:
           */
          ({ record }) => {
            switch (record.__typename) {
              case 'PageRecord':
                return <PageInline record={record} />;
              default:
                return null;
            }
          }
        }
        renderLinkToRecord={
          /*
           * If the structured text includes a link to another DatoCMS record,
           * it's your decision to determine where the link should lead, or if
           * you wish to customize its appearance:
           */
          ({ transformedMeta, record, children }) => {
            switch (record.__typename) {
              case 'PageRecord':
                return (
                  <PageLink record={record} transformedMeta={transformedMeta}>
                    {children}
                  </PageLink>
                );
              default:
                return null;
            }
          }
        }
      />
      <footer>Published at {page._firstPublishedAt}</footer>
    </>
  );
}
