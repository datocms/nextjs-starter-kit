import DraftModeToggler from '@/components/DraftModeToggler';
import { TagFragment } from '@/lib/datocms/commonFragments';
import { executeQuery } from '@/lib/datocms/executeQuery';
import { graphql } from '@/lib/datocms/graphql';
import { draftMode } from 'next/headers';
import { toNextMetadata } from 'react-datocms';

import './global.css';

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

export async function generateMetadata() {
  const { isEnabled: isDraftModeEnabled } = draftMode();
  const data = await executeQuery(query, { includeDrafts: isDraftModeEnabled });
  return toNextMetadata(data._site.faviconMetaTags);
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header>
          <h1>DatoCMS + Next.js Starter Kit</h1>
          <nav>
            <a className="navlink" href="https://www.datocms.com/docs/next-js">
              📚 Full Integration Guide
            </a>
            <a className="navlink" href="/basic">
              🔧 Basic Route
            </a>
            <a className="navlink" href="/real-time-updates">
              ⚡️ Real-time Updates Route
            </a>
          </nav>
          <DraftModeToggler draftModeEnabled={draftMode().isEnabled} />
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
