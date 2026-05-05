import { ImageBlockFragment } from '@/components/blocks/ImageBlock';
import { ImageGalleryBlockFragment } from '@/components/blocks/ImageGalleryBlock';
import { VideoBlockFragment } from '@/components/blocks/VideoBlock';
import { PageInlineFragment } from '@/components/inlineRecords/PageInline';
import { PageLinkFragment } from '@/components/linkToRecords/PageLink';
import { TagFragment } from '@/lib/datocms/commonFragments';
import { graphql } from '@/lib/datocms/graphql';

/*
 * Define here the props that the page component will receive from Next.js
 * https://nextjs.org/docs/app/api-reference/file-conventions/page#props
 */
export type PageProps = {
  params: Promise<{ slug: string }>;
};

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
export const query = graphql(
  /* GraphQL */ `
    query RealtimeUpdatesPageQuery($slug: String!) {
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
