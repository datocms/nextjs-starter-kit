'use client';

import { generateRealtimeComponent } from '@/lib/datocms/realtime/generateRealtimeComponent';
import Content from './Content';
import { query } from './common';

/*
 * This component is automatically generated. It must be declared in a separate
 * file because it is a Client Component, thus it is essential to specify the
 * 'use client' directive at the top of the file.
 */
export default generateRealtimeComponent({
  query,
  contentComponent: Content,
});
