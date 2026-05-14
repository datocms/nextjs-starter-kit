/*
 * Type-safe record handling using DatoCMS's generated types.
 *
 * This file uses types generated from your DatoCMS schema via `npm run generate-cma-types`.
 * The generated types provide full autocomplete and compile-time safety when
 * accessing record fields.
 *
 * See: https://www.datocms.com/docs/content-management-api/resources/item#type-safe-development-with-typescript
 */
import type { RawApiTypes } from '@datocms/cma-client';
import { type AnyModel, Page } from './cma-types';

/*
 * Both the "Web Previews" and "SEO/Readability Analysis" plugins from DatoCMS
 * need to know the URL of the site that corresponds to each DatoCMS record to
 * work properly. These two functions are responsible for returning this
 * information, and are utilized by the route handlers associated with the two
 * plugins:
 *
 * - src/app/api/seo-analysis/route.tsx
 * - src/app/api/preview-links/route.tsx
 */

export async function recordToWebsiteRoute(
  item: RawApiTypes.Item<AnyModel>,
  locale: string,
): Promise<string | null> {
  switch (item.__itemTypeId) {
    case Page.ID: {
      const slug = await recordToSlug(item, locale);
      return slug ? `/real-time-updates/${slug}` : null;
    }
    /*
     * Add more cases here as you add more models to your DatoCMS schema.
     * Switching on `item.__itemTypeId` and referencing the generated `.ID`
     * constants gives TypeScript the discriminant it needs to narrow
     * `item.attributes` to the right model. Always derive the slug via
     * `recordToSlug()` so the two helpers stay in sync. Example:
     *
     * case Article.ID: {
     *   const slug = await recordToSlug(item, locale);
     *   return slug ? `/blog/${slug}` : null;
     * }
     */
    default:
      return null;
  }
}

export async function recordToSlug(
  item: RawApiTypes.Item<AnyModel>,
  _locale: string,
): Promise<string | null> {
  switch (item.__itemTypeId) {
    case Page.ID: {
      /*
       * Using generated types, TypeScript knows exactly which fields exist.
       * `item.attributes.slug` is fully typed - no casts needed!
       */
      return item.attributes.slug;
    }
    /*
     * Add more cases here as you add more models to your DatoCMS schema.
     * Example for an article model with a slug field:
     *
     * case Article.ID: {
     *   return item.attributes.slug;
     * }
     */
    default:
      return null;
  }
}
