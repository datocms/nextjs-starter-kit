import { cookies, draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import type { NextRequest, NextResponse } from 'next/server';
import {
  handleUnexpectedError,
  invalidRequestResponse,
  makeDraftModeWorkWithinIframes,
} from '../../utils';

export const dynamic = 'force-dynamic';

/**
 * This route handler disables Next.js Draft Mode: we simply follow what the
 * guide says!
 *
 * https://nextjs.org/docs/app/building-your-application/configuring/draft-mode
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  // Parse query string parameters
  const url = request.nextUrl.searchParams.get('url') || '/';

  try {
    // Avoid open redirect vulnerabilities
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return invalidRequestResponse('URL must be relative!', 422);
    }

    draftMode().disable();
    makeDraftModeWorkWithinIframes();
  } catch (error) {
    return handleUnexpectedError(error);
  }

  redirect(url);
}
