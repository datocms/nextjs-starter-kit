import { render as structuredTextToPlainText } from 'datocms-structured-text-to-plain-text';
import type { Heading } from 'datocms-structured-text-utils';
import type { ReactNode } from 'react';

type Props = {
  node: Heading;
  children: ReactNode;
};

/**
 * Returns a slugified version of the string by converting the input to
 * lowercase, eliminating non-alphanumeric characters, and removing any hyphens
 * at the beginning or end of the string.
 */
const slugify = (str: string | null) =>
  str
    ? str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    : undefined;

/**
 * Renders a Structured Text heading node as an heading with anchor link.
 * https://www.datocms.com/docs/structured-text/dast#heading
 */
export default function HeadingWithAnchorLink({ node, children }: Props) {
  const Tag = `h${node.level}` as const;

  // Convert the node to plain text, and then slugify
  const slug = slugify(structuredTextToPlainText(node));

  return slug ? (
    <Tag id={slug} tabIndex={-1}>
      <a href={`#${slug}`}>{children}</a>
    </Tag>
  ) : (
    <Tag>{children}</Tag>
  );
}
