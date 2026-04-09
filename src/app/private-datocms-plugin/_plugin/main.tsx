/*
 * Entry point for a DatoCMS plugin. The connect() call registers every hook the
 * plugin implements. Each render hook receives a context object (ctx) that
 * provides access to plugin parameters, the current user/role, and helpers.
 *
 * This example implements a renderConfigScreen hook, which adds a settings page
 * under Settings > Plugins > [your plugin]. You can extend this file by adding
 * more hooks to the connect() call — for example renderFieldExtension,
 * renderItemFormSidebarPanel, onBeforeItemUpsert, and many others.
 *
 * For an overview of all available hooks:
 * https://www.datocms.com/docs/plugin-sdk/what-hooks-are
 */

'use client';

import { useEffect } from 'react';
import { connect } from 'datocms-plugin-sdk';
import ConfigScreen from './entrypoints/ConfigScreen';
import { render } from './utils/render';
import 'datocms-react-ui/styles.css';

export default function PluginEntry() {
  useEffect(() => {
    connect({
      renderConfigScreen(ctx) {
        render(<ConfigScreen ctx={ctx} />);
      },
    });
  }, []);

  return null;
}
