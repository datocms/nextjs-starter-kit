import HeadingWithAnchorLink from '@/components/HeadingWithAnchorLink';
import { type CdaStructuredTextRecord, isCode, isHeading } from 'datocms-structured-text-utils';
import dynamic from 'next/dynamic';
import {
  StructuredText,
  type StructuredTextPropTypes,
  renderNodeRule,
} from 'react-datocms/structured-text';

/**
 * Project-wide wrapper around `<StructuredText />` from `react-datocms`,
 * exposed as `<Text />` to distinguish it from the upstream component.
 *
 * Always render structured text through this component instead of importing
 * `react-datocms` directly. Two reasons:
 *
 * 1. Every render needs `data-datocms-content-link-group` around it for
 *    Visual Editing to resolve clickable areas correctly. Centralizing the
 *    wrapper means no page can forget it.
 *
 * 2. Project-wide concerns — default node rules for headings and code
 *    blocks — are baked in here, so every structured-text field renders
 *    consistently without each caller restating them.
 *
 * Caller-supplied `customNodeRules` are *prepended* before the project
 * defaults: in `customNodeRules` earlier rules win, so caller rules must come
 * first to give them precedence and let callers opt out of any default.
 */

export function Text<
  BlockRecord extends CdaStructuredTextRecord = CdaStructuredTextRecord,
  LinkRecord extends CdaStructuredTextRecord = CdaStructuredTextRecord,
  InlineBlockRecord extends CdaStructuredTextRecord = CdaStructuredTextRecord,
>({
  customNodeRules,
  ...props
}: StructuredTextPropTypes<BlockRecord, LinkRecord, InlineBlockRecord>) {
  return (
    <div data-datocms-content-link-group>
      <StructuredText<BlockRecord, LinkRecord, InlineBlockRecord>
        {...props}
        customNodeRules={[
          ...(customNodeRules ?? []),
          renderNodeRule(isCode, ({ node, key }) => <Code key={key} node={node} />),
          renderNodeRule(isHeading, ({ node, key, children }) => (
            <HeadingWithAnchorLink node={node} key={key}>
              {children}
            </HeadingWithAnchorLink>
          )),
        ]}
      />
    </div>
  );
}

/*
 * By using next/dynamic, the components will not be included in the page's
 * initial JavaScript bundle. It allows you to defer loading of Client
 * Components and imported libraries, and only include them in the client bundle
 * when they're needed.
 */
const Code = dynamic(() => import('@/components/Code'));
