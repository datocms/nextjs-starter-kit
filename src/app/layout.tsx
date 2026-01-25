import ContentLink from '@/components/ContentLink';
import DraftModeToggler from '@/components/DraftModeToggler';
import { TagFragment } from '@/lib/datocms/commonFragments';
import { executeQuery } from '@/lib/datocms/executeQuery';
import { graphql } from '@/lib/datocms/graphql';
import { draftMode } from 'next/headers';
import { toNextMetadata } from 'react-datocms';

import './global.css';
import { Metadata } from 'next';

const query = graphql(
  /* GraphQL */ `
    query query {
      _site {
        faviconMetaTags {
          ...TagFragment
        }
      }
    }
  `,
  [TagFragment],
);

export async function generateMetadata(): Promise<Metadata> {
  const { isEnabled: isDraftModeEnabled } = await draftMode();
  const data = await executeQuery(query, { includeDrafts: isDraftModeEnabled });
  return toNextMetadata(data._site.faviconMetaTags);
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isEnabled: isDraftModeEnabled } = await draftMode();

  return (
    <html lang="en">
      <body>
        {/*
          Enable click-to-edit overlays in draft mode only.

          The ContentLink component provides two editing experiences:
          1. On the standalone website: Click any content to open DatoCMS editor in a new tab
          2. Inside Web Previews plugin Visual mode: Click content to instantly edit in the side panel

          Only rendered in draft mode since the required stega-encoded metadata
          is only included in draft content responses (see executeQuery.ts).
        */}
        {isDraftModeEnabled && <ContentLink />}
        <header>
          <h1>DatoCMS + Next.js Starter Kit</h1>
          <nav>
            <a href="https://www.datocms.com/docs/next-js">📚 Full Integration Guide</a>
            <a href="/basic">🔧 Basic Route</a>
            <a href="/real-time-updates">⚡️ Real-time Updates Route</a>
          </nav>
          <DraftModeToggler draftModeEnabled={isDraftModeEnabled} />
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
