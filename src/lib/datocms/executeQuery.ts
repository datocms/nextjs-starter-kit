import { executeQuery as libExecuteQuery } from '@datocms/cda-client';
import type { TadaDocumentNode } from 'gql.tada';

export const cacheTag = 'datocms';

/**
 * Executes a GraphQL query using the DatoCMS Content Delivery API, and caches
 * the result in Next.js Data Cache using the `cache: 'force-cache'` option.
 * This means that regular visitors won't generate additional calls to DatoCMS.
 *
 * Cache invalidation happens when DatoCMS sends a webhook that triggers
 * `revalidateTag('datocms')`. Note that on Vercel, the Data Cache persists
 * across deployments — new deploys alone won't invalidate cached data. If you
 * need fresh data after deploy, trigger the webhook or purge the cache manually.
 *
 * @see src/app/api/invalidate-cache/route.tsx for webhook-based cache invalidation
 */
export async function executeQuery<Result, Variables>(
  query: TadaDocumentNode<Result, Variables>,
  options?: ExecuteQueryOptions<Variables>,
) {
  const result = await libExecuteQuery(query, {
    variables: options?.variables,
    excludeInvalid: true,
    includeDrafts: options?.includeDrafts,
    token: options?.includeDrafts
      ? process.env.DATOCMS_DRAFT_CONTENT_CDA_TOKEN!
      : process.env.DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN!,
    /*
     * Enable content-link for draft content only. This embeds stega-encoded
     * metadata in text fields, which the @datocms/content-link package uses
     * to create click-to-edit overlays. When editors click on content, they're
     * taken directly to the corresponding field in the DatoCMS editor.
     *
     * This works both:
     * - On the standalone website (opens DatoCMS in a new tab)
     * - Inside the Web Previews plugin Visual mode (opens field in side panel)
     *
     * Only enabled for draft content to avoid the overhead in production.
     */
    contentLink: options?.includeDrafts ? 'v1' : undefined,
    baseEditingUrl: options?.includeDrafts ? process.env.DATOCMS_BASE_EDITING_URL : undefined,
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
