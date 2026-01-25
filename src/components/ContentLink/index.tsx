'use client';

import { ContentLink as DatoCMSContentLink } from 'react-datocms';
import { usePathname, useRouter } from 'next/navigation';
import { useSyncExternalStore } from 'react';

/**
 * ContentLink component enables click-to-edit overlays for DatoCMS content.
 *
 * This component provides two powerful editing experiences:
 *
 * 1. **Standalone website editing**: When viewing your draft content on the website,
 *    editors can click on any content element to open the DatoCMS editor and modify
 *    that specific field. This works by detecting stega-encoded metadata in the content
 *    and creating interactive overlays.
 *
 * 2. **Web Previews plugin integration**: When your preview runs inside the Visual Editing
 *    mode of the DatoCMS Web Previews plugin, this component automatically establishes
 *    bidirectional communication with the plugin. This enables:
 *    - Clicking content to instantly open the correct field in the side panel
 *    - In-plugin navigation: users can navigate to different URLs within Visual mode
 *      (like a browser navigation bar), and the preview updates accordingly
 *    - Synchronized state between the preview and the DatoCMS interface
 *
 * The component handles client-side routing by:
 * - Listening to navigation requests from the Web Previews plugin via `onNavigateTo`
 * - Notifying the plugin when the URL changes via `currentPath`
 *
 * This integration is completely automatic when running inside the plugin's iframe,
 * with graceful fallback to opening edit URLs in a new tab when running standalone.
 *
 * @see https://www.datocms.com/marketplace/plugins/i/datocms-plugin-web-previews
 */
const hasHover = () => window.matchMedia('(hover: hover)').matches;
const subscribe = () => () => {};

export default function ContentLink() {
  const router = useRouter();
  const pathname = usePathname();
  const enableClickToEdit = useSyncExternalStore(subscribe, hasHover, () => false);

  return (
    <DatoCMSContentLink
      // Handle navigation requests from the Web Previews plugin
      // Inside Visual mode, users can navigate to different URLs (like a browser bar)
      // and the plugin will request the preview to navigate accordingly
      onNavigateTo={(path: string) => {
        router.push(path);
      }}
      // Notify the Web Previews plugin when the URL changes
      // This keeps the plugin in sync with the current page being previewed
      currentPath={pathname}
      // Click-to-edit overlays are enabled only on devices with hover capability,
      // since they interfere with normal touch interactions on mobile devices.
      //
      // To disable overlays by default on all devices, simply omit this prop.
      // Users can always toggle overlays on/off temporarily by pressing Alt/Option.
      enableClickToEdit={enableClickToEdit}
    />
  );
}
