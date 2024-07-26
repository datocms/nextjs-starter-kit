import { generatePageComponentAndMetadataFn } from '@/lib/datocms/realtime/generatePageComponentAndMetadataFn';
import dynamic from 'next/dynamic';
import Content from './Content';
import { query } from './common';

/*
 * This Next.js route provides a starting point for handling routes that require
 * a query to DatoCMS to generate the page's content and metadata. Feel free to
 * modify this pattern, or create your own custom solution, following the
 * general guidelines in our documentation: https://www.datocms.com/docs/next-js
 *
 * The actual content of the page is specified in the `Content` component,
 * which in addition to the classic page props, will also receive a `data` prop
 * containing the result of the GraphQL query.
 *
 * Depending on whether Draft Mode is enabled or not for the visitor, the route
 * will behave differently:
 *
 * When Draft Mode is OFF:
 * - the content returned from DatoCMS is the published one;
 * - the rendering of `<Content />` occurs on the server side;
 * - the page is static and cached until the next change of content on DatoCMS.
 *
 * When Draft Mode is ON:
 * - the content returned from DatoCMS will be those in draft;
 * - a subscription to DatoCMS's Real-time Updates API is used to display
 *   changes made to the content reflected on the page in real time, without the
 *   need to refresh the page;
 * - as a result, the rendering of `<Content />` will occur on the client side.
 */

const { generateMetadataFn, Page } = generatePageComponentAndMetadataFn({
  // The actual GraphQL query we want to execute
  query,
  // If the GraphQL query requires some variables, you can use this function to
  // fill in the values, starting from the route parameters
  buildQueryVariables: ({ params }) => ({ someVariable: 'foobar' }),
  // If the query contains `_seoMetaTags`, you can use this function to
  // automatically associate them with the route's metadata.
  pickSeoMetaTags: (data) => data.page?._seoMetaTags,
  // The actual content of the page. In addition to the classic page props, will
  // also receive a `data` prop containing the result of the GraphQL query
  contentComponent: Content,
  // The Client Component to use in case Draft Mode is active
  realtimeComponent: dynamic(() => import('./RealTime')),
});

export const generateMetadata = generateMetadataFn;
export default Page;
