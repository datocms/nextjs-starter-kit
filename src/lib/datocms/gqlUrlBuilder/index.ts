import type { FragmentOf } from '@/lib/datocms/graphql';
import { PageUrlFragment, buildUrlForPage } from './page';

/**
 * Discriminated-union dispatcher for record URL building. Use this any time
 * generic record-handling code (related-content cards, search-result items,
 * etc.) needs to render a link without knowing the type at compile time.
 *
 * To make a new model routable:
 *   1. Create `./<model>.ts` exporting `<Model>UrlFragment` and
 *      `buildUrlFor<Model>()`.
 *   2. Add the `__typename` case to the switch below.
 *   3. Add the union member to `RoutableRecord`.
 *
 * Callers must select `__typename` themselves: per-model URL fragments don't
 * declare it (it's not part of the URL data), so any query feeding this
 * dispatcher has to spread the URL fragment *and* select `__typename` —
 * typically via the project's `... on RecordInterface { id __typename }`
 * inline spread.
 *
 * Type-specific call sites should keep importing `buildUrlFor<Model>` directly.
 */
type RoutableRecord = FragmentOf<typeof PageUrlFragment> & {
  __typename: 'PageRecord';
};

export function buildUrlFromGql(record: RoutableRecord): string {
  switch (record.__typename) {
    case 'PageRecord':
      return buildUrlForPage(record);
  }
}

export { PageUrlFragment, buildUrlForPage };
