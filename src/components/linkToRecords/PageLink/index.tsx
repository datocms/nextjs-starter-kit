import { PageUrlFragment, buildUrlForPage } from '@/lib/datocms/gqlUrlBuilder/page';
import { type FragmentOf, graphql, readFragment } from '@/lib/datocms/graphql';
import type { TransformedMeta } from 'datocms-structured-text-generic-html-renderer';
import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * Let's define the GraphQL fragment needed for the component to function.
 *
 * GraphQL fragment colocation keeps queries near the components using them,
 * improving maintainability and encapsulation. Fragment composition enables
 * building complex queries from reusable parts, promoting code reuse and
 * efficiency. Together, these practices lead to more modular, maintainable, and
 * performant GraphQL implementations by allowing precise data fetching and
 * easier code management.
 *
 * Routing fields (e.g. `slug`) are not declared here directly: instead, the
 * fragment composes `PageUrlFragment` so that this component and the URL
 * builder stay in sync as the routing scheme evolves.
 *
 * Learn more: https://gql-tada.0no.co/guides/fragment-colocation
 */
export const PageLinkFragment = graphql(
  /* GraphQL */ `
    fragment PageLinkFragment on PageRecord {
      ...PageUrlFragment
    }
  `,
  [PageUrlFragment],
);

/*
 * Link-to-record components own their visual representation; the URL is
 * built by the per-model URL builder. Renderer-provided meta (e.g. target,
 * rel) is honored via {...transformedMeta}. Note: no
 * `data-datocms-content-link-boundary` on link-to-record components — the
 * renderer handles those boundaries.
 */

type Props = {
  record: FragmentOf<typeof PageLinkFragment>;
  transformedMeta: TransformedMeta;
  children: ReactNode;
};

export default function PageLink({ record, transformedMeta, children }: Props) {
  const unmaskedRecord = readFragment(PageLinkFragment, record);

  return (
    <Link {...transformedMeta} href={buildUrlForPage(unmaskedRecord)}>
      {children}
    </Link>
  );
}
