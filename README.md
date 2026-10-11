<p align="center">
  <img src="https://inspectcn.arhamkhnz.com/og" alt="inspectcn banner" />
</p>

<h1 align="center">inspectcn</h1>

<p align="center">
  Chrome extension to inspect and extract shadcn-style theme tokens from any website, then bring them into your project.
  <br />
  <br />
  <a href="https://github.com/shadcn-labs/inspectcn"><img src="https://www.shieldcn.dev/github/stars/shadcn-labs/inspectcn.svg?variant=secondary&size=xs&theme=zinc" alt="GitHub Stars" /></a>
  <a href="https://github.com/shadcn-labs/inspectcn/actions"><img src="https://www.shieldcn.dev/github/ci/shadcn-labs/inspectcn.svg?variant=secondary&size=xs&theme=zinc" alt="CI" /></a>
  <a href="https://discord.com/invite/N6G36KhYK4"><img src="https://www.shieldcn.dev/discord/online-members/N6G36KhYK4.svg?variant=secondary&size=xs&theme=zinc" alt="Discord Members" /></a>
  <a href="https://x.com/Arhamkhnz"><img src="https://www.shieldcn.dev/x/follow/Arhamkhnz.svg?variant=branded&size=xs&theme=zinc" alt="X Follow" /></a>
</p>

## Features

- 🎨 **Theme inspector** - Inspect active shadcn-style theme tokens, copy CSS, and save captured themes
- 📚 **Documentation site** - Beautiful docs powered by Fumadocs
- 📦 **Sample shadcn registry** - Website includes a component registry compatible with `npx shadcn add`
- 🤖 **Agent ready** - Includes `llms.txt`, `llms-full.txt`, agent skills discovery routes, and API catalog endpoints
- 🔊 **[Web audio feedback](https://audio.raphaelsalaja.com/)** - Built-in sound effects powered by `@web-kits/audio`
- 📳 **[Web haptics](https://haptics.lochie.me/)** - Optional haptic feedback hooks for supported devices via `web-haptics`
- ✨ **[Motion animations](https://motion.dev/)** - `motion`-powered UI polish for copy states, text transitions, and interactive elements
- 🎯 **[Animated icons](https://lucide-animated.com/)** - Reusable animated icons for navigation, sharing, sponsorship, and CTAs
- 🔄 **[View transitions](https://nextjs.org/docs/app/api-reference/config/next-config-js/viewTransition)** - Next.js view transitions enabled for smoother navigation between pages
- 🚀 **Deploy ready** - Deploy anywhere

## Built In

- `Next.js 16` with the App Router
- `React 19` and `TypeScript`
- `Tailwind CSS 4`
- `Fumadocs` for documentation
- `shiki` + `rehype-pretty-code` for code blocks
- `sonner` for toasts
- `radix-ui` + `vaul` for accessible primitives
- `@vercel/analytics` for analytics

## Quick Start

Run commands from the workspace root. Use Node.js `^20.19.0 || >=22.18.0`
and pnpm `10.28.2`.

1. **Clone or fork** [inspectcn](https://github.com/shadcn-labs/inspectcn)

2. **Install dependencies**:

```bash
pnpm install
```

3. **Start both apps in development**:

```bash
pnpm dev
```

To start only the website, use `pnpm --filter inspectcn-web dev`. To start only
the extension, use `pnpm --filter inspectcn dev`.

See the [extension README](apps/extension/README.md) for extension features and development commands.

The website is deployed at [inspectcn.arhamkhnz.com](https://inspectcn.arhamkhnz.com/).

## Usage

Open the extension badge on a website to inspect its active theme tokens, copy
the CSS, or save a captured theme. Saved themes can be previewed on localhost.

The website also includes a sample component registry. To install its example component:

```bash
npx shadcn@latest add https://inspectcn.arhamkhnz.com/r/your-component.json
```

## Project Structure

```
├── apps/
│   ├── web/                # Next.js website and sample registry (inspectcn-web)
│   │   ├── registry/new-york/your-component.tsx
│   │   ├── registry.json   # Component registry manifest
│   │   ├── content/docs/   # Documentation (MDX)
│   │   ├── app/            # Next.js app
│   │   └── public/r/       # Built registry files (auto-generated)
│   └── extension/          # WXT browser extension (inspectcn)
├── package.json            # Workspace commands and shared tooling
├── pnpm-workspace.yaml     # Workspace package paths
└── turbo.json              # Shared task configuration
```

## Scripts

- `pnpm dev` - Start the website and extension development servers
- `pnpm build` - Build both apps for production (also rebuilds the registry)
- `pnpm registry:build` - Rebuild the component registry
- `pnpm typecheck` - Check types in both apps
- `pnpm check` - Run the app lint and formatting checks
- `pnpm format` - Format both apps and workspace root files through Turbo
- `pnpm format:check` - Check formatting in both apps and workspace root files
- `pnpm zip` - Package the Chrome extension
- `pnpm zip:firefox` - Package the Firefox extension

## License

[MIT](./LICENSE)
