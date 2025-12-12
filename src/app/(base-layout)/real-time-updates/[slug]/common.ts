import { ImageBlockFragment } from '@/components/blocks/ImageBlock';
import { ImageGalleryBlockFragment } from '@/components/blocks/ImageGalleryBlock';
import { VideoBlockFragment } from '@/components/blocks/VideoBlock';
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
            ... on ImageBlockRecord {
              ...ImageBlockFragment
            }
            ... on ImageGalleryBlockRecord {
              ...ImageGalleryBlockFragment
            }
            ... on VideoBlockRecord {
              ...VideoBlockFragment
            }
          }
          links {
            ... on RecordInterface {
              id
              __typename
            }
            ... on PageRecord {
              title
              slug
            }
          }
        }
      }
    }
  `,
  [TagFragment, ImageBlockFragment, ImageGalleryBlockFragment, VideoBlockFragment],
);
