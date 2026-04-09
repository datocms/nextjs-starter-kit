/*
 * Shared render utility. Every render hook in connect() calls this function to
 * mount its entrypoint component into the single #root element. A single
 * createRoot is reused across all hooks because only one iframe — and therefore
 * one hook — is active at a time.
 */

import type React from 'react';
import { StrictMode } from 'react';
import { createRoot, type Root } from 'react-dom/client';

let root: Root | null = null;

function getRoot(): Root {
  if (!root) {
    const container = document.getElementById('root');
    root = createRoot(container!);
  }
  return root;
}

export function render(component: React.ReactNode): void {
  getRoot().render(<StrictMode>{component}</StrictMode>);
}
