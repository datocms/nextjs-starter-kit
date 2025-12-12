import type { ItemTypeDefinition } from '@datocms/cma-client';
type EnvironmentSettings = {
  locales: 'en';
};
export type ImageGalleryBlock = ItemTypeDefinition<
  EnvironmentSettings,
  'CoOdvsbUR8GLtGeuenXzMw',
  {
    assets: {
      type: 'gallery';
    };
  }
>;
export type Page = ItemTypeDefinition<
  EnvironmentSettings,
  'JdG722SGTSG_jEB1Jx-0XA',
  {
    title: {
      type: 'string';
    };
    structured_text: {
      type: 'structured_text';
      blocks: ImageGalleryBlock | ImageBlock | VideoBlock;
      inline_blocks: Page;
    };
    slug: {
      type: 'slug';
    };
    seo_settings_social: {
      type: 'seo';
    };
    seo_analysis: {
      type: 'json';
    };
  }
>;
export type ImageBlock = ItemTypeDefinition<
  EnvironmentSettings,
  'dZOhbVOTSpeaaA-wQMgPCA',
  {
    asset: {
      type: 'file';
    };
  }
>;
export type VideoBlock = ItemTypeDefinition<
  EnvironmentSettings,
  'duRvS1PrT4u6QGJZUmyINA',
  {
    asset: {
      type: 'file';
    };
  }
>;
export type AnyBlock = ImageGalleryBlock | ImageBlock | VideoBlock;
export type AnyModel = Page;
export type AnyBlockOrModel = AnyBlock | AnyModel;
