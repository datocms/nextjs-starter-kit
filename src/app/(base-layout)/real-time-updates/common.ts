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
  /*
   * If, as in this case, the page does not have dynamic route parameters, just
   * define the type in this way:
   */
  params: Record<never, never>;
};

/**
 * The GraphQL query that will be executed for this route to generate the page
 * content and metadata.
 *
 * Thanks to gql.tada, the result will be fully typed!
 */
export const query = graphql(
  /* GraphQL */ `
    query RealtimeUpdatesPageQuery {
      page {
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
            }
          }
        }
      }
    }
  `,
  [TagFragment, ImageBlockFragment, ImageGalleryBlockFragment, VideoBlockFragment],
);
