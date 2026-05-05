import { PageUrlFragment, buildUrlForPage } from '@/lib/datocms/gqlUrlBuilder/page';
import { type FragmentOf, graphql, readFragment } from '@/lib/datocms/graphql';
import Link from 'next/link';

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
export const PageInlineFragment = graphql(
  /* GraphQL */ `
    fragment PageInlineFragment on PageRecord {
      title
      ...PageUrlFragment
    }
  `,
  [PageUrlFragment],
);

/*
 * If a structured text includes a reference to another DatoCMS record, it's
 * up to you to decide how to render them. The visual representation lives
 * here; the URL is owned by the per-model URL builder, composed via the URL
 * fragment.
 */

type Props = {
  record: FragmentOf<typeof PageInlineFragment>;
};

export default function PageInline({ record }: Props) {
  const unmaskedRecord = readFragment(PageInlineFragment, record);

  return (
    <Link
      href={buildUrlForPage(unmaskedRecord)}
      className="pill"
      data-datocms-content-link-boundary
    >
      {unmaskedRecord.title}
    </Link>
  );
}
