<!--datocms-autoinclude-header start-->

<a href="https://www.datocms.com/"><img src="https://www.datocms.com/images/full_logo.svg" height="60"></a>

👉 [Visit the DatoCMS homepage](https://www.datocms.com) or see [What is DatoCMS?](#what-is-datocms)

---

<!--datocms-autoinclude-header end-->

# Next.js Starter Kit

This project aims to be a great starting point for your Next.js projects that need to interact with DatoCMS.

- 🔍 **Fully commented code** — Every file is commented and explained in detail, it will be impossible to get lost!
- 💯 **100% TypeScript** — Thanks to [gql.tada](https://gql-tada.0no.co/) every GraphQL query is fully typed, and your IDE will help you complete the GraphQL queries.
- 🛠️ **Minimal boilerplate** — The project is minimal and exposes only what is necessary to get started, without complicated models that need to be removed.
- 🚫 **Zero CSS** — There is only one CSS import, which you can remove to use your preferred CSS tool.
- 📝 **Full support for Next.js Draft Mode** — Your editors can always view the latest draft version of the content.
- ✏️ **Click-to-edit overlays** — Integrated [@datocms/content-link](https://www.npmjs.com/package/@datocms/content-link) for intuitive content editing. Click on any content element on your website to instantly open the DatoCMS editor for that specific field.
- 🧩 **Plugin ready** — Full integration with the [Web Previews](https://www.datocms.com/marketplace/plugins/i/datocms-plugin-web-previews) plugin, including Visual Editing mode for seamless in-context editing, and [SEO/Readability Analysis](https://www.datocms.com/marketplace/plugins/i/datocms-plugin-seo-readability-analysis).
- 🔄 **DatoCMS's Real-time Updates API** — Your editors can see updated content instantly as soon as you save a new version on DatoCMS.
- 🗑️ **Cache invalidation** — No need to re-deploy your website after each modification to your content, as it will be automatically updated thanks to DatoCMS webhooks.
- 🌐 **SEO Metadata** — Full integration between Next.js and the SEO settings coming from DatoCMS.

## How to use

### Quick start

1. [Create an account on DatoCMS](https://datocms.com).

2. Make sure that you have set up the [Github integration on Vercel](https://vercel.com/docs/git/vercel-for-github).

3. Let DatoCMS set everything up for you clicking this button below:

[![Deploy with DatoCMS](https://dashboard.datocms.com/deploy/button.svg)](https://dashboard.datocms.com/deploy?repo=datocms%2Fnextjs-starter-kit%3Amain)

### Local setup

Once the setup of the project and repo is done, clone the repo locally.

#### Set up environment variables

Copy the sample .env file:

```bash
cp .env.local.example .env.local
```

In your DatoCMS' project, go to the **Settings** menu at the top and click **API tokens**.

Copy the values of the following tokens into the specified environment variable:

- `DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN`: CDA Only (Published)
- `DATOCMS_DRAFT_CONTENT_CDA_TOKEN`: CDA Only (Draft)
- `DATOCMS_CMA_TOKEN`: CMA Only (Read)

Then set the following additional variables:

- `DATOCMS_BASE_EDITING_URL`: Your DatoCMS project URL (e.g., `https://your-project.admin.datocms.com`). This enables click-to-edit overlays that link content directly to the DatoCMS editor.
- `SECRET_API_TOKEN`: A secure string (you can use `openssl rand -hex 32` or any other cryptographically-secure random string generator). It will be used to safeguard all route handlers from incoming requests from untrusted sources.

#### Run your project locally

```bash
npm install
npm run dev
```

Your website should be up and running on [http://localhost:3000](http://localhost:3000)!

## VS Code

It is highly recommended to follow [these instructions](https://gql-tada.0no.co/get-started/installation#vscode-setup) for an optimal experience with Visual Studio Code, including features like diagnostics, auto-completions, and type hovers for GraphQL.

## Click-to-edit overlays

This starter kit includes [@datocms/content-link](https://www.npmjs.com/package/@datocms/content-link), which provides intuitive click-to-edit overlays for your content.

### How to use

When viewing your website in draft mode, **press and hold the Alt/Option key** to enable click-to-edit mode. Interactive overlays will appear on all editable content. Release the key to disable the overlays.

This feature works in two powerful ways:

### 1. Standalone website editing

Click on any content element to instantly open the DatoCMS editor for that specific field in a new tab. This makes it incredibly easy for editors to jump directly to the content they want to modify.

### 2. Web Previews plugin Visual Editing mode

When using the [Web Previews plugin](https://www.datocms.com/marketplace/plugins/i/datocms-plugin-web-previews) in Visual Editing mode, clicking on content opens the field editor in a side panel right next to your preview. The integration also enables:

- **In-plugin navigation**: Users can navigate to different URLs within the Visual mode interface (like a browser navigation bar), and the preview automatically updates to show the corresponding page
- **Synchronized state**: The preview and DatoCMS interface stay in perfect sync

This bidirectional communication is established automatically when your preview runs inside the Web Previews plugin—no additional configuration needed.

### How it works

The implementation consists of three parts:

1. **Data fetching** (`src/lib/datocms/executeQuery.ts:21`): When fetching draft content, the `contentLink: 'v1'` option embeds stega-encoded metadata into text fields
2. **ContentLink component** (`src/components/ContentLink/index.tsx`): Creates interactive overlays and handles the Web Previews plugin integration
3. **Layout integration** (`src/app/layout.tsx:41`): The ContentLink component is rendered only in draft mode

For more details, see the [package documentation](https://www.npmjs.com/package/@datocms/content-link).

## Updating the GraphQL schema

When the DatoCMS schema, which includes various models and fields, undergoes any updates or modifications, it is essential to ensure that these changes are properly reflected in your local development environment. To accomplish this, you should locally run the following command:

```
npm run generate-schema
```

Executing this task will automatically update the `schema.graphql` file for you. This crucial step ensures that gql.tada will have access to the most current and accurate version of the GraphQL schema, allowing your application to function correctly with the latest data structures and relationships defined within your DatoCMS setup.

## Updating CMA types (Content Management API)

In addition to the GraphQL schema for content delivery, this project also provides type safety for the [Content Management API (CMA)](https://www.datocms.com/docs/content-management-api). This is useful when you need to programmatically create, update, or manage records.

When your DatoCMS schema changes, regenerate the CMA types by running:

```
npm run generate-cma-types
```

This command uses the [DatoCMS CLI](https://www.datocms.com/docs/cli) to generate TypeScript types in `src/lib/datocms/cma-types.ts` based on your project's schema. The generated types give you:

- **Full autocomplete** for record attributes in your IDE
- **Compile-time errors** when accessing non-existent fields
- **No manual type casts** when working with record properties

### End-to-end type safety

This starter kit provides complete type safety for both DatoCMS APIs:

| API               | Purpose                     | Type Generation              | Output File                    |
| ----------------- | --------------------------- | ---------------------------- | ------------------------------ |
| **CDA** (GraphQL) | Content delivery/fetching   | `npm run generate-schema`    | `schema.graphql`               |
| **CMA** (REST)    | Content management/creation | `npm run generate-cma-types` | `src/lib/datocms/cma-types.ts` |

Both commands are automatically run during `npm install` via the `prepare` script.

For more information, see the [Type-safe Development with TypeScript](https://www.datocms.com/docs/content-management-api/using-the-nodejs-clients#type-safe-development-with-typescript) documentation.

## Next.js 16

This starter kit uses Next.js 16, which includes React 19 and all the latest features and improvements from the Next.js ecosystem.

## <!--datocms-autoinclude-footer start-->

---

# What is DatoCMS?

<a href="https://www.datocms.com/"><img src="https://www.datocms.com/images/full_logo.svg" height="60" alt="DatoCMS - The Headless CMS for the Modern Web"></a>

[DatoCMS](https://www.datocms.com/) is Headless CMS for the modern web. Trusted by 25,000+ businesses, agencies, and individuals, it gives your team one place to manage content and ship it to any website, app, or device via API.

**New here?** Start with [Create free account](https://dashboard.datocms.com/signup) and the [Documentation](https://www.datocms.com/docs). Stuck? Ask the [Community](https://community.datocms.com/). Curious what's new? [Product Updates](https://www.datocms.com/product-updates).

**Building with AI:** [Agent Skills](https://www.datocms.com/docs/agent-skills) turn coding assistants (Claude Code, Cursor) into expert DatoCMS developers, with full read/write via the auto-installed CLI. No local terminal? Use the [MCP Server](https://www.datocms.com/docs/mcp-server) instead.

**Talking to DatoCMS from code:**

- [Content Delivery API](https://www.datocms.com/docs/content-delivery-api) (CDA) — the fast, read-only GraphQL API your website/app uses to **fetch** published content.
- [Content Management API](https://www.datocms.com/docs/content-management-api) (CMA) — the REST API for **creating and updating** content, models, and project settings (think scripts, migrations, integrations).
- [CLI](https://www.datocms.com/docs/scripting-migrations/installing-the-cli) — terminal tool for schema migrations and importing from Contentful/WordPress.

**Framework guides:** end-to-end recipes for fetching content, rendering Structured Text, optimizing images/video, handling SEO, and setting up live preview with visual editing in [Next.js](https://www.datocms.com/docs/next-js), [Nuxt](https://www.datocms.com/docs/nuxt), [Svelte](https://www.datocms.com/docs/svelte), and [Astro](https://www.datocms.com/docs/astro).

**Want a head start?** Browse our [starter projects](https://www.datocms.com/marketplace/starters) — ready-to-deploy example sites for popular frameworks.

<!--datocms-autoinclude-footer end-->
