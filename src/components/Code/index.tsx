'use client';

import type { Code as CodeNode } from 'datocms-structured-text-utils';
import hljs from 'highlight.js';
import { useEffect, useRef } from 'react';

type Props = {
  node: CodeNode;
};

export default function Code({ node }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current || ref.current.dataset.highlighted) {
      return;
    }

    hljs.highlightElement(ref.current);
  }, []);

  return (
    <pre className={`language-${node.language}`}>
      <code ref={ref}>{node.code}</code>
    </pre>
  );
}
