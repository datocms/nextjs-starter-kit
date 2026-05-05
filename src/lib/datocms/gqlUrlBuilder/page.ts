import { type FragmentOf, graphql, readFragment } from '@/lib/datocms/graphql';

/**
 * Per-model URL builder for `PageRecord`: the single source of truth for
 * "given a page record, what is its URL".
 *
 * The fragment is always declared even when only `slug` is needed: callers
 * compose the fragment, never raw fields, so the URL shape can grow (e.g. to
 * `/basic/page/[year]/[slug]`) without touching any caller. The builder
 * accepts the masked fragment and unmasks internally.
 */
export const PageUrlFragment = graphql(/* GraphQL */ `
  fragment PageUrlFragment on PageRecord {
    slug
  }
`);

export function buildUrlForPage(page: FragmentOf<typeof PageUrlFragment>) {
  const data = readFragment(PageUrlFragment, page);
  return `/basic/page/${data.slug}`;
}
