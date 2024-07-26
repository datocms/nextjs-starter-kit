import HeadingWithAnchorLink from '@/components/HeadingWithAnchorLink';
import ImageBlock from '@/components/blocks/ImageBlock';
import ImageGalleryBlock from '@/components/blocks/ImageGalleryBlock';
import type { ResultOf } from '@/lib/datocms/graphql';
import type { ContentComponentType } from '@/lib/datocms/realtime/generatePageComponent';
import { isCode, isHeading } from 'datocms-structured-text-utils';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { StructuredText, renderNodeRule } from 'react-datocms';
import type { PageProps, query } from './common';

/*
 * By using next/dynamic, the components will not be included in the page's
 * initial JavaScript bundle. It allows you to defer loading of Client
 * Components and imported libraries, and only include them in the client bundle
 * when they're needed.
 */
const VideoBlock = dynamic(() => import('@/components/blocks/VideoBlock'));
const Code = dynamic(() => import('@/components/Code'));

/**
 * This component is responsible for defining the actual content of the route,
 * and will be incorporated into the final page by the page.tsx component.
 *
 * Besides the standard props that you can typically use in your page components
 * (https://nextjs.org/docs/app/api-reference/file-conventions/page#props), a
 * `data` prop is also available, which already contains the result of the
 * GraphQL query to DatoCMS.
 */
const Content: ContentComponentType<PageProps, ResultOf<typeof query>> = ({ data, params }) => {
  if (!data.page) {
    notFound();
  }

  return (
    <>
      <h1>{data.page.title}</h1>
      {/*
       * Structured Text is a JSON format similar to HTML, but with the advantage
       * of a significantly reduced and tailored set of possible tags
       * for editorial content, along with the capability to create hyperlinks
       * to other DatoCMS records and embed custom DatoCMS blocks.
       */}
      <StructuredText
        data={data.page.structuredText}
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
      <footer>Published at {data.page._firstPublishedAt}</footer>
    </>
  );
};

export default Content;
