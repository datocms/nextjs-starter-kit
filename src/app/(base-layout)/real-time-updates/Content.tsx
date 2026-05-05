import { Text } from '@/components/Text';
import ImageBlock from '@/components/blocks/ImageBlock';
import ImageGalleryBlock from '@/components/blocks/ImageGalleryBlock';
import PageInline from '@/components/inlineRecords/PageInline';
import PageLink from '@/components/linkToRecords/PageLink';
import type { ResultOf } from '@/lib/datocms/graphql';
import type { ContentComponentType } from '@/lib/datocms/realtime/generatePageComponent';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import type { PageProps, query } from './common';

/*
 * By using next/dynamic, the components will not be included in the page's
 * initial JavaScript bundle. It allows you to defer loading of Client
 * Components and imported libraries, and only include them in the client bundle
 * when they're needed.
 */
const VideoBlock = dynamic(() => import('@/components/blocks/VideoBlock'));

/**
 * This component is responsible for defining the actual content of the route,
 * and will be incorporated into the final page by the page.tsx component.
 *
 * Besides the standard props that you can typically use in your page components
 * (https://nextjs.org/docs/app/api-reference/file-conventions/page#props), a
 * `data` prop is also available, which already contains the result of the
 * GraphQL query to DatoCMS.
 */
const Content: ContentComponentType<PageProps, ResultOf<typeof query>> = ({ data }) => {
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
        data={data.page.structuredText}
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
      <footer>Published at {data.page._firstPublishedAt}</footer>
    </>
  );
};

export default Content;
