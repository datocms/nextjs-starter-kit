import { buildRequestInit, executeQuery as libExecuteQuery } from '@datocms/cda-client';
import type { TadaDocumentNode } from 'gql.tada';

export const cacheTag = 'datocms';

/**
 * Executes a GraphQL query using the DatoCMS Content Delivery API, and caches
 * the result in Next.js Data Cache using the `cache: 'force-cache'` option.
 */
export async function executeQuery<Result, Variables>(
  query: TadaDocumentNode<Result, Variables>,
  options?: ExecuteQueryOptions<Variables>,
) {
  buildRequestInit;
  const result = await libExecuteQuery(query, {
    variables: options?.variables,
    excludeInvalid: true,
    includeDrafts: options?.includeDrafts,
    token: options?.includeDrafts
      ? process.env.DATOCMS_DRAFT_CONTENT_CDA_TOKEN!
      : process.env.DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN!,
    requestInitOptions: {
      cache: 'force-cache',
      /*
       * This project utilizes an extremely basic cache invalidation
       * technique: by using the `next.tags` option, all requests to DatoCMS
       * are tagged with "datocms" in the Next.js Data Cache. Whenever DatoCMS
       * notifies us of any updates via webhook, we invalidate all requests
       * with the same tag.
       *
       * Although this caching strategy may be sufficient for smaller
       * websites, it is not advised for larger projects. Fortunately, with
       * DatoCMS and Next, it is possible to implement a much more detailed
       * invalidation strategy!
       *
       * For more info: https://www.datocms.com/docs/next-js/using-cache-tags
       */
      next: {
        tags: [cacheTag],
      },
    },
  });

  return result;
}

type ExecuteQueryOptions<Variables> = {
  variables?: Variables;
  includeDrafts?: boolean;
};
