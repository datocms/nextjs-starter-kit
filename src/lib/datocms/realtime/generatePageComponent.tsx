import type { TadaDocumentNode } from 'gql.tada';
import { draftMode } from 'next/headers';
import type { ComponentType } from 'react';
import { executeQuery } from '../executeQuery';
import type { BuildQueryVariablesFn } from '../generateMetadataFn';
import type { RealtimeComponentType } from './generateRealtimeComponent';

/**
 * Generates a Next.js page component that executes a DatoCMS query, and then
 * refers to either the `contentComponent` or `realtimeComponent` for the actual
 * rendering.
 *
 * When Draft Mode is ON:
 * - DatoCMS returns the draft content;
 * - the page displays `realtimeComponent`.
 *
 * When Draft Mode is OFF:
 * - DatoCMS returns the published content;
 * - the page displays `contentComponent`, or `realtimeComponent` subscribed to
 *   published content if `shouldSubscribeToPublishedContent` is set.
 */
export function generatePageComponent<PageProps, Result, Variables>(
  options: GeneratePageComponentOptions<PageProps, Result, Variables>,
) {
  return async function Page(unsanitizedPageProps: PageProps) {
    const { isEnabled: isDraftModeEnabled } = await draftMode();

    /*
     * Since props passed from the server to client components must be
     * serializable, we extract the non-serializable `searchParams` property
     * from the original object.
     */
    const { searchParams, ...pagePropsWithoutSearchParams } = unsanitizedPageProps as PageProps & {
      searchParams: unknown;
    };

    const pageProps = pagePropsWithoutSearchParams as unknown as PageProps;

    const variables = options.buildQueryVariables
      ? await options.buildQueryVariables(pageProps)
      : ({} as Variables);

    const data = await executeQuery(options.query, {
      variables,
      includeDrafts: isDraftModeEnabled,
    });

    const { realtimeComponent: RealTimeComponent, contentComponent: ContentComponent } = options;

    if (isDraftModeEnabled) {
      return (
        <RealTimeComponent
          token={process.env.DATOCMS_DRAFT_CONTENT_CDA_TOKEN!}
          query={options.query}
          variables={variables}
          initialData={data}
          pageProps={pageProps}
          includeDrafts={true}
          contentLink="v1"
          baseEditingUrl={process.env.DATOCMS_BASE_EDITING_URL}
          excludeInvalid={true}
        />
      );
    }

    if (options.shouldSubscribeToPublishedContent) {
      /*
       * The published-content token is read-only and only sees published
       * records, so it is safe to hand to every visitor's browser.
       */
      return (
        <RealTimeComponent
          token={process.env.DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN!}
          query={options.query}
          variables={variables}
          initialData={data}
          pageProps={pageProps}
          excludeInvalid={true}
        />
      );
    }

    return <ContentComponent {...pageProps} data={data} />;
  };
}

export type ContentComponentType<PageProps, Result> = ComponentType<
  PageProps & {
    data: Result;
  }
>;

export type GeneratePageComponentOptions<PageProps, Result, Variables> = {
  /** The GraphQL query to fetch data for the page. */
  query: TadaDocumentNode<Result, Variables>;

  /** A function that takes page props and builds and returns the variables
   * required by the GraphQL query. */
  buildQueryVariables?: BuildQueryVariablesFn<PageProps, Variables>;

  /** A React component that will be rendered if Draft Mode is OFF. */
  contentComponent: ContentComponentType<PageProps, Result>;

  /** A React component that will be rendered if Draft Mode is ON. */
  realtimeComponent: RealtimeComponentType<PageProps, Result, Variables>;

  /** If true, regular visitors also get `realtimeComponent`, subscribed to
   * published content, so the page updates as soon as editors publish. */
  shouldSubscribeToPublishedContent?: boolean;
};
