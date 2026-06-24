import { ApiError } from '@datocms/cma-client';
import { NextResponse } from 'next/server';
import { serializeError } from 'serialize-error';

export function withCORS(responseInit?: ResponseInit): ResponseInit {
  return {
    ...responseInit,
    headers: {
      ...responseInit?.headers,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  };
}

export function handleUnexpectedError(error: unknown) {
  try {
    throw error;
  } catch (e) {
    console.error(e);
  }

  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        request: error.request,
        response: error.response,
      },
      withCORS({ status: 500 }),
    );
  }

  return invalidRequestResponse(serializeError(error), 500);
}

export function invalidRequestResponse(error: unknown, status = 422) {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    withCORS({ status }),
  );
}

export function successfulResponse(data?: unknown, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    withCORS({ status }),
  );
}

import { cookies } from 'next/headers';

/**
 * This function should not exist :) Its only purpose is to correct an issue
 * currently present in Next.js!
 *
 * You may not know this, but third-party cookies as we know them are in the
 * process of being eliminated by browsers to improve user privacy and security.
 *
 * The new secure way of setting cookies involves using CHIPS, or a partitioned
 * storage system, with separate cookie jars for each top-level site.
 *
 * Implementation is very simple: you just need to add a new cookie attribute to
 * the old Set-Cookie call:
 *
 * - Set-Cookie: __Host-name=value; Secure; Path=/; SameSite=None;
 * + Set-Cookie: __Host-name=value; Secure; Path=/; SameSite=None; Partitioned;
 *
 * The activation of Next.js's Draft Mode currently sets the cookie WITHOUT this
 * attribute... but our website needs to be accessible within the iframe of the
 * "Web Previews" plugin! Setting a cookie inside an iframe is considered a
 * third-party cookie... so we need to rewrite the cookie set by
 * `draft.enable()`, manually adding the partitioned attribute.
 *
 * Third-party cookie deprecation: https://developers.google.com/privacy-sandbox/3pcd
 * CHIPS: https://developers.google.com/privacy-sandbox/3pcd/chips
 */

export async function makeDraftModeWorkWithinIframes() {
  // Read the cookie just set by draft.enable() or draft.disable()...
  const cookie = (await cookies()).get('__prerender_bypass')!;

  // and reapply it with `partitioned: true`
  (await cookies()).set({
    name: '__prerender_bypass',
    value: cookie?.value,
    httpOnly: true,
    path: '/',
    secure: true,
    sameSite: 'none',
    partitioned: true,
  });
}

/**
 * Determine whether a user-supplied redirect target is safe to follow — i.e. it
 * points to the same host as the current request.
 *
 * This guards against open-redirect attacks. A naive `url.startsWith('http')`
 * check — and even a plain "is it a relative URL?" check — fails to catch
 * protocol-relative targets like `//evil.com` or backslash variants like
 * `/\evil.com`, both of which browsers happily send off-site.
 *
 * Instead, we resolve the candidate against the current request URL and require
 * the resulting hostname to match. Relative paths (`/foo`, `/a?b=1#c`) resolve
 * to the same host and pass; anything that escapes to another host — or fails to
 * parse — is rejected. The scheme is irrelevant: we only compare hostnames.
 */
export function isSafeRedirectUrl(
  candidate: string,
  requestUrl: URL,
): boolean {
  try {
    const target = new URL(candidate, requestUrl);
    return target.hostname === requestUrl.hostname;
  } catch {
    return false;
  }
}
