import { type GenerateMetadataFnOptions, generateMetadataFn } from '../generateMetadataFn';
import { type GeneratePageComponentOptions, generatePageComponent } from './generatePageComponent';

/**
 * A simple wrapper that reduces the code to be written for each route. It takes
 * care of generating both the page component and the `generateMetadata()`
 * function from a common set of options.
 */
export function generatePageComponentAndMetadataFn<PageProps, Result, Variables>(
  options: GeneratePageComponentOptions<PageProps, Result, Variables> &
    Partial<GenerateMetadataFnOptions<PageProps, Result, Variables>>,
) {
  const Page = generatePageComponent(options);

  const metadataFn = options.pickSeoMetaTags
    ? generateMetadataFn({
        ...options,
        pickSeoMetaTags: options.pickSeoMetaTags,
      })
    : undefined;

  return { Page, generateMetadataFn: metadataFn };
}
