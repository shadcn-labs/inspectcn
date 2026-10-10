<p align="center">
  <img src="https://startercn.vercel.app/og" alt="startercn banner" />
</p>

<h1 align="center">startercn</h1>

<p align="center">
  A template for building and publishing your own custom shadcn registry components. Includes documentation, landing page, and everything you need to deploy your component registry.
  <br />
  <br />
  <a href="https://github.com/shadcn-labs/startercn"><img src="https://www.shieldcn.dev/github/stars/shadcn-labs/startercn.svg?variant=secondary&size=xs&theme=zinc" alt="GitHub Stars" /></a>
  <a href="https://github.com/shadcn-labs/startercn/actions"><img src="https://www.shieldcn.dev/github/ci/shadcn-labs/startercn.svg?variant=secondary&size=xs&theme=zinc" alt="CI" /></a>
  <a href="https://discord.com/invite/N6G36KhYK4"><img src="https://www.shieldcn.dev/discord/online-members/N6G36KhYK4.svg?variant=secondary&size=xs&theme=zinc" alt="Discord Members" /></a>
  <a href="https://x.com/shadcnlabs"><img src="https://www.shieldcn.dev/x/follow/shadcnlabs.svg?variant=branded&size=xs&theme=zinc" alt="X Follow" /></a>
</p>

## Features

- 📦 **Ready-to-use template** - Fork and start building immediately
- 📚 **Documentation site** - Beautiful docs powered by Fumadocs
- 🎨 **Shadcn registry compatible** - Works with `npx shadcn add`
- 🤖 **[Agent ready](https://www.mintlify.com/score/startercn)** - Includes `llms.txt`, `llms-full.txt`, agent skills discovery routes, and API catalog endpoints
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

1. **Use this template** - Click "Use this template" on GitHub

2. **Install dependencies**:

```bash
pnpm install
```

3. **Replace the placeholder component** at `apps/web/registry/new-york/your-component.tsx`

4. **Update `apps/web/registry.json`** with your component details

5. **Build the registry**:

```bash
pnpm registry:build
```

6. **Start both apps in development**:

```bash
pnpm dev
```

To start only the website, use `pnpm --filter startercn dev`. To start only
the extension, use `pnpm --filter inspectcn dev`.

7. **Deploy** and share your component!

## Usage

Once deployed, users can install your component with:

```bash
npx shadcn@latest add https://your-domain.com/r/your-component.json
```

## Project Structure

```
├── apps/
│   ├── web/                # Next.js website and component registry (startercn)
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
