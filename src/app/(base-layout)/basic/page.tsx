import HeadingWithAnchorLink from '@/components/HeadingWithAnchorLink';
import ImageBlock, { ImageBlockFragment } from '@/components/blocks/ImageBlock';
import ImageGalleryBlock, {
  ImageGalleryBlockFragment,
} from '@/components/blocks/ImageGalleryBlock';
import { VideoBlockFragment } from '@/components/blocks/VideoBlock';
import { TagFragment } from '@/lib/datocms/commonFragments';
import { executeQuery } from '@/lib/datocms/executeQuery';
import { generateMetadataFn } from '@/lib/datocms/generateMetadataFn';
import { graphql } from '@/lib/datocms/graphql';
import { isCode, isHeading } from 'datocms-structured-text-utils';
import dynamic from 'next/dynamic';
import { draftMode } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { StructuredText, renderNodeRule, toNextMetadata } from 'react-datocms';

/*
 * By using next/dynamic, the components will not be included in the page's
 * initial JavaScript bundle. It allows you to defer loading of Client
 * Components and imported libraries, and only include them in the client bundle
 * when they're needed.
 */
const VideoBlock = dynamic(() => import('@/components/blocks/VideoBlock'));
const Code = dynamic(() => import('@/components/Code'));

/**
 * The GraphQL query that will be executed for this route to generate the page
 * content and metadata.
 *
 * Thanks to gql.tada, the result will be fully typed!
 */
const query = graphql(
  /* GraphQL */ `
    query BasicPageQuery {
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

/**
 * We use a helper to generate function that fits the Next.js
 * `generateMetadata()` format, automating the creation of meta tags based on
 * the `_seoMetaTags` present in a DatoCMS GraphQL query.
 */
export const generateMetadata = generateMetadataFn({
  query,
  // A callback that picks the SEO meta tags from the result of the query
  pickSeoMetaTags: (data) => data.page?._seoMetaTags,
});

export default async function Page() {
  const { isEnabled: isDraftModeEnabled } = draftMode();

  const { page } = await executeQuery(query, {
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
       */}
      <StructuredText
        data={page.structuredText}
        customNodeRules={
          /*
           * Although the component knows how to convert all "standard" elements
           * (headings, bullet lists, etc.) into HTML, it's possible to
           * customize the rendering of each node.
           */
          [
            renderNodeRule(isCode, ({ node, key }) => <Code key={key} node={node} />),
            renderNodeRule(isHeading, ({ node, key, children }) => (
              <HeadingWithAnchorLink node={node} key={key}>
                {children}
              </HeadingWithAnchorLink>
            )),
          ]
        }
        renderBlock={
          /*
           * If the structured text embeds any blocks, it's up to you to decide
           * how to render them:
           */
          ({ record }) => {
            switch (record.__typename) {
              case 'VideoBlockRecord': {
                return <VideoBlock data={record} />;
              }
              case 'ImageBlockRecord': {
                return <ImageBlock data={record} />;
              }
              case 'ImageGalleryBlockRecord': {
                return <ImageGalleryBlock data={record} />;
              }
              default: {
                return null;
              }
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
              case 'PageRecord': {
                return (
                  <Link href="/" className="pill">
                    {record.title}
                  </Link>
                );
              }
              default: {
                return null;
              }
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
              case 'PageRecord': {
                return (
                  <Link {...transformedMeta} href="/">
                    {children}
                  </Link>
                );
              }
              default: {
                return null;
              }
            }
          }
        }
      />
      <footer>Published at {page._firstPublishedAt}</footer>
    </>
  );
}
