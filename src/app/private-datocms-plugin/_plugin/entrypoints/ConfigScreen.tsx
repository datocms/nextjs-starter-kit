/*
 * This entrypoint renders the plugin's global configuration screen, accessible
 * under Settings > Plugins > [your plugin]. It demonstrates the basic pattern:
 * read current parameters from ctx.plugin.attributes.parameters, let the user
 * edit them, and persist changes via ctx.updatePluginParameters().
 *
 * Every rendered entrypoint must be wrapped in <Canvas ctx={ctx}>, which injects
 * CSS custom properties for theming and starts the auto-resizer so the iframe
 * adapts to its content height.
 *
 * https://www.datocms.com/docs/plugin-sdk/config-screen
 */

import type { RenderConfigScreenCtx } from 'datocms-plugin-sdk';
import { Canvas, Button, TextField, FieldGroup, Form, Section } from 'datocms-react-ui';
import { useState } from 'react';

const docsBaseUrl = 'https://www.datocms.com/docs/plugin-sdk';

export default function ConfigScreen({ ctx }: { ctx: RenderConfigScreenCtx }) {
  const saved = ctx.plugin.attributes.parameters as Record<string, unknown>;
  const [apiKey, setApiKey] = useState((saved.apiKey as string) || '');
  const [saving, setSaving] = useState(false);

  const canEdit = ctx.currentRole.meta.final_permissions.can_edit_schema;

  const handleSave = async () => {
    setSaving(true);
    await ctx.updatePluginParameters({ apiKey });
    ctx.notice('Settings saved!');
    setSaving(false);
  };

  const dirty = apiKey !== ((saved.apiKey as string) || '');

  return (
    <Canvas ctx={ctx}>
      <Section title="Getting started">
        <p>
          This is a <strong>starter plugin</strong> included in your project as a starting point for
          building your own DatoCMS plugins. The source code lives in your project under{' '}
          <code>src/app/private-datocms-plugin/_plugin/</code>:
        </p>
        <ul>
          <li>
            <code>main.tsx</code> — the entry point where you register hooks via{' '}
            <code>connect()</code>
          </li>
          <li>
            <code>entrypoints/ConfigScreen.tsx</code> — this settings screen (you're looking at it!)
          </li>
          <li>
            <code>utils/render.tsx</code> — shared React render utility
          </li>
        </ul>
        <p>
          To learn more about what plugins can do, check out the{' '}
          <a href={`${docsBaseUrl}/introduction`} target="_blank" rel="noreferrer">
            Plugin SDK docs
          </a>
          . For a walkthrough of building your first plugin, see the{' '}
          <a href={`${docsBaseUrl}/build-your-first-plugin`} target="_blank" rel="noreferrer">
            Build your first plugin
          </a>{' '}
          guide. For an overview of all available hooks (field extensions, sidebar panels, custom
          pages, and more) see{' '}
          <a href={`${docsBaseUrl}/what-hooks-are`} target="_blank" rel="noreferrer">
            What hooks are
          </a>
          .
        </p>
      </Section>
      <Section title="Example settings form">
        <Form onSubmit={handleSave}>
          <FieldGroup>
            <TextField
              id="apiKey"
              name="apiKey"
              label="API Key"
              hint="Your external service API key"
              placeholder="sk-..."
              required
              value={apiKey}
              onChange={setApiKey}
              textInputProps={{ disabled: !canEdit }}
            />
          </FieldGroup>
          {canEdit && (
            <Button
              type="submit"
              fullWidth
              buttonSize="l"
              buttonType="primary"
              disabled={saving || !apiKey || !dirty}
            >
              {saving ? 'Saving...' : 'Save settings'}
            </Button>
          )}
        </Form>
      </Section>
    </Canvas>
  );
}
