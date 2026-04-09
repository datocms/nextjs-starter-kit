/*
 * This page is rendered inside a DatoCMS iframe as a private plugin. It must be
 * a bare HTML shell — no site layout, no site CSS — because the plugin SDK
 * manages its own styling via the <Canvas> component.
 *
 * To install this plugin in your DatoCMS project, go to Configuration > Plugins,
 * create a new private plugin, and point it to the URL of this page
 * (e.g. https://your-site.com/private-datocms-plugin).
 *
 * For more information on private plugins:
 * https://www.datocms.com/docs/plugin-sdk/build-your-first-plugin#install-your-plugin-in-the-datocms-web-app
 */

import PluginEntry from './_plugin/main';

export default function PrivatePluginPage() {
  return (
    <>
      <div id="root" />
      <PluginEntry />
    </>
  );
}
