import { type Client, buildClient } from '@datocms/cma-client';
import type { NextRequest, NextResponse } from 'next/server';
import { handleUnexpectedError, successfulResponse, withCORS } from '../utils';

/*
 * This endpoint is called only once, immediately after the initial deployment of
 * this project, to set up some DatoCMS settings. Feel free to remove it!
 */

export async function OPTIONS() {
  return new Response('OK', withCORS());
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
          previewWebhook: new URL(
            `/api/preview-links?token=${process.env.SECRET_API_TOKEN}`,
            baseUrl,
          ).toString(),
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
      htmlGeneratorUrl: new URL(
        `/api/seo-analysis?token=${process.env.SECRET_API_TOKEN}`,
        baseUrl,
      ).toString(),
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
    url: new URL(`/api/invalidate-cache?token=${process.env.SECRET_API_TOKEN}`, baseUrl).toString(),
    custom_payload: null,
    headers: {},
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

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json();

  const client = buildClient({ apiToken: body.datocmsApiToken });
  const baseUrl = body.frontendUrl as string;

  try {
    await Promise.all([
      installWebPreviewsPlugin(client, baseUrl),
      createCacheInvalidationWebhook(client, baseUrl),
      installSEOAnalysisPlugin(client, baseUrl),
    ]);

    return successfulResponse();
  } catch (error) {
    return handleUnexpectedError(error);
  }
}
