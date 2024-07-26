import type { TadaDocumentNode } from 'gql.tada';
import type { ComponentType } from 'react';
import { type EnabledQueryListenerOptions, useQuerySubscription } from 'react-datocms';
import type { ContentComponentType } from './generatePageComponent';

/**
 * Generates a Client Component that subscribes to DatoCMS's Real-time Updates
 * API using the `useQuerySubscription` hook. The generated component receives
 * updates on content changes, and re-renders the `contentComponent`.
 */
export function generateRealtimeComponent<PageProps, Result, Variables>({
  query,
  contentComponent: ContentComponent,
}: GenerateRealtimeComponentOptions<PageProps, Result, Variables>) {
  const RealtimeComponent: RealtimeComponentType<PageProps, Result, Variables> = ({
    pageProps,
    ...subscriptionOptions
  }) => {
    const { data, error } = useQuerySubscription(subscriptionOptions);

    // Feel free to customize your way of rendering the error
    if (error) {
      return (
        <div>
          <pre>{error.code}</pre>: {error.message}
        </div>
      );
    }

    if (!data) return null;

    return <ContentComponent {...pageProps} data={data} />;
  };

  return RealtimeComponent;
}

type GenerateRealtimeComponentOptions<PageProps, Result, Variables> = {
  query: TadaDocumentNode<Result, Variables>;
  contentComponent: ContentComponentType<PageProps, Result>;
};

export type RealtimeComponentType<PageProps, Result, Variables> = ComponentType<
  EnabledQueryListenerOptions<Result, Variables> & {
    pageProps: PageProps;
  }
>;
