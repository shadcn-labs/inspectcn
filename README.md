<p align="center">
  <img src="https://inspectcn.arhamkhnz.com/og" alt="inspectcn banner" />
</p>

<h1 align="center">inspectcn</h1>

<p align="center">
  Chrome extension to inspect and extract shadcn-style theme tokens from any website, then bring them into your project.
  <br />
  <br />
  <a href="https://github.com/shadcn-labs/inspectcn"><img src="https://www.shieldcn.dev/github/stars/shadcn-labs/inspectcn.svg?variant=secondary&size=xs&theme=zinc" alt="GitHub Stars" /></a>
  <a href="https://discord.com/invite/N6G36KhYK4"><img src="https://www.shieldcn.dev/discord/online-members/N6G36KhYK4.svg?variant=secondary&size=xs&theme=zinc" alt="Discord Members" /></a>
  <a href="https://x.com/Arhamkhnz"><img src="https://www.shieldcn.dev/x/follow/Arhamkhnz.svg?variant=branded&size=xs&theme=zinc" alt="X Follow" /></a>
</p>

<p align="center">
  <a href="https://chromewebstore.google.com/detail/inspectcn/jmpjlakfdenblabkjbdcepoolnphdgen">Add to Chrome</a> ·
  <a href="https://inspectcn.arhamkhnz.com/">Live Demo</a> ·
  <a href="https://inspectcn.arhamkhnz.com/docs">Documentation</a>
</p>

## Features

- **Inspect tokens** — View active colors, surfaces, borders, radius, charts, and sidebar tokens.
- **Copy CSS** — Copy individual tokens or the current theme as a CSS block.
- **Capture themes** — Save a theme and reuse it in your project.
- **Preview on localhost** — Apply a captured theme and reset to the original styles.
- **Try the demo** — Capture and apply themes in the website's interactive demo.

Inspectcn is in early development. Theme detection may vary depending on a website's CSS variables and theme setup.

## Usage

Install the extension, open a website, and click the Inspectcn badge to inspect or capture its theme. Open your project on localhost to preview the capture, or copy the CSS into your theme stylesheet.

Previews change CSS variables in the browser; they do not edit your project files. Theme data is processed locally. See the [installation guide](https://inspectcn.arhamkhnz.com/docs/installation) and [privacy policy](https://inspectcn.arhamkhnz.com/docs/privacy).

## Tech Stack

- **Extension:** WXT, React, TypeScript, Tailwind CSS, and shadcn/ui.
- **Website:** Next.js, React, Tailwind CSS, and Fumadocs.
- **Workspace:** pnpm and Turborepo, with shared brand and inspector packages.

## Development

Use Node.js `^20.19.0 || >=22.18.0` and pnpm `10.28.2`.

```bash
git clone https://github.com/shadcn-labs/inspectcn.git
cd inspectcn
pnpm install
pnpm dev
```

Run commands from the workspace root:

| Command | Description |
| --- | --- |
| `pnpm --filter inspectcn dev` | Start the extension |
| `pnpm --filter inspectcn-web dev` | Start the website |
| `pnpm build` | Build both apps |
| `pnpm zip` | Build and package the Chrome extension |
| `pnpm lint` | Check lint rules |
| `pnpm typecheck` | Check types |
| `pnpm format` | Format the workspace |

See the [extension README](apps/extension/README.md) for more details.

## Project Structure

```text
apps/
  extension/       # WXT browser extension
  web/             # Website, MDX docs, and interactive demo
packages/
  brand/           # Shared logo and assets
  inspector/       # Shared theme reader and inspector UI
```

## Contributing

Issues and pull requests are welcome. [Report a bug or suggest a feature](https://github.com/shadcn-labs/inspectcn/issues), including the website URL when reporting theme detection issues.

## License

[MIT](./LICENSE)
