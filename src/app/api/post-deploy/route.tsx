import { type Client, buildClient } from '@datocms/cma-client';
import type { NextRequest, NextResponse } from 'next/server';
import {
  handleUnexpectedError,
  invalidRequestResponse,
  successfulResponse,
  withCORS,
} from '../utils';

/*
 * This endpoint is called only once, immediately after the initial deployment of
 * this project, to set up some DatoCMS settings. Feel free to remove it!
 */

export async function OPTIONS() {
  return new Response('OK', withCORS());
}

/**
 * Install the private plugin hosted by this same project. The plugin entry
 * point is the /private-datocms-plugin page, which DatoCMS loads in an iframe.
 */
async function installPrivatePlugin(client: Client, baseUrl: string) {
  await client.plugins.create({
    name: 'Private Plugin',
    url: new URL('/private-datocms-plugin', baseUrl).toString(),
  });
}

/**
 * Install and configure the "Web Previews" plugin
 *
 * https://www.datocms.com/marketplace/plugins/i/datocms-plugin-web-previews
 */
async function installWebPreviewsPlugin(client: Client, baseUrl: string) {
  const webPreviewsPlugin = await client.plugins.create({
    package_name: 'datocms-plugin-web-previews',
  });

  await client.plugins.update(webPreviewsPlugin, {
    parameters: {
      frontends: [
        {
          name: 'Production',
          previewWebhook: new URL('/api/preview-links', baseUrl).toString(),
          customHeaders: [
            { name: 'Authorization', value: `Bearer ${process.env.SECRET_API_TOKEN}` },
          ],
          visualEditing: {
            enableDraftModeUrl: new URL(
              `/api/draft-mode/enable?token=${process.env.SECRET_API_TOKEN}`,
              baseUrl,
            ).toString(),
            initialPath: '/real-time-updates/home',
          },
        },
      ],
      startOpen: true,
    },
  });
}

/**
 * Install and configure the "SEO/Readability Analysis" plugin
 *
 * https://www.datocms.com/marketplace/plugins/i/datocms-plugin-seo-readability-analysis
 */
async function installSEOAnalysisPlugin(client: Client, baseUrl: string) {
  const seoPlugin = await client.plugins.create({
    package_name: 'datocms-plugin-seo-readability-analysis',
  });

  await client.plugins.update(seoPlugin.id, {
    parameters: {
      htmlGeneratorUrl: new URL('/api/seo-analysis', baseUrl).toString(),
      customHeaders: [{ name: 'Authorization', value: `Bearer ${process.env.SECRET_API_TOKEN}` }],
      autoApplyToFieldsWithApiKey: 'seo_analysis',
      setSeoReadabilityAnalysisFieldExtensionId: true,
    },
  });
}

/**
 * Setup a webhook to be notified when anything changes, and invalidate Next.js cache
 */
async function createCacheInvalidationWebhook(client: Client, baseUrl: string) {
  await client.webhooks.create({
    name: '🔄 Invalidate Next.js Cache',
    url: new URL('/api/invalidate-cache', baseUrl).toString(),
    custom_payload: null,
    headers: { Authorization: `Bearer ${process.env.SECRET_API_TOKEN}` },
    events: [
      {
        filters: [],
        entity_type: 'cda_cache_tags',
        event_types: ['invalidate'],
      },
    ],
    http_basic_user: null,
    http_basic_password: null,
  });
}

/**
 * The DatoCMS API token arrives in the request body, so without this check the
 * endpoint would happily write our SECRET_API_TOKEN into any project a caller
 * names, and the caller could then read it back from their own project.
 */
async function ensureSameProject(client: Client, ourApiToken: string) {
  const ourClient = buildClient({ apiToken: ourApiToken });

  const [callerProject, ourProject] = await Promise.all([
    client.site.find(),
    ourClient.site.find(),
  ]);

  return callerProject.id === ourProject.id;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json();

  const client = buildClient({ apiToken: body.datocmsApiToken });
  const baseUrl = body.frontendUrl as string;

  try {
    if (!(await ensureSameProject(client, process.env.DATOCMS_CMA_TOKEN!))) {
      return invalidRequestResponse('Invalid token', 401);
    }

    await Promise.all([
      installWebPreviewsPlugin(client, baseUrl),
      createCacheInvalidationWebhook(client, baseUrl),
      installSEOAnalysisPlugin(client, baseUrl),
      installPrivatePlugin(client, baseUrl),
    ]);

    return successfulResponse();
  } catch (error) {
    return handleUnexpectedError(error);
  }
}
