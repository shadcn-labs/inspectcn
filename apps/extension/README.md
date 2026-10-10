# Inspectcn

Inspectcn is a Chrome extension to inspect and extract shadcn-style theme tokens from any website, then bring them into your project.

It adds a small badge to the page. Open it, inspect the active tokens, copy the generated CSS block, or save a theme and preview it on localhost.

## What it does

- Reads the active shadcn-style theme tokens from the page you are viewing
- Shows grouped tokens like surface, semantic, charts, and sidebar values
- Copies the current theme as CSS
- Saves a captured theme so you can reuse it later
- Applies a saved theme to localhost for quick preview during development

## How to use

1. Open any website.
2. Click the Inspectcn badge.
3. Review the detected tokens in the popover.
4. Copy the active theme CSS, or capture the theme for later use.
5. To apply a saved theme, open a localhost URL and use the local preview actions there.

## How Inspectcn reads colors

Inspectcn does not try to parse a website's source code manually.

Instead, it asks the browser for the values that are currently active on the page:

- it injects a small UI badge into the page
- it samples visible parts of the current page
- it reads CSS custom properties from those visible elements using computed styles
- it groups the detected values into known shadcn-style tokens
- it builds a CSS block from the active values you see on screen

This approach is intentional.

Many websites support multiple theme presets, nested theme wrappers, or token overrides that do not live directly on `:root`. On those sites, reading only `:root` often gives incomplete or incorrect values.

In simple terms: Inspectcn reads the colors the browser is actually using on the visible page, not just what may be defined at the root level.

## Current status

Inspectcn is still in development.

It can sometimes read or capture the wrong colors, especially on websites with unusual theme systems, nested overrides, overlays, or non-standard token setups.

If you find a website where Inspectcn gives the wrong result, please open an issue and include the website URL and a short description of what went wrong.

## Planned features

- Ability to copy colors in different formats
- Modify colors directly inside the extension UI
- Font Capture
- Share saved presets
- Apply saved themes on non-localhost URLs in future releases

## Development

```bash
pnpm install
pnpm dev
```

Useful scripts:

```bash
pnpm check
pnpm compile
pnpm build
pnpm zip
```

## Tech

- WXT
- React
- Tailwind CSS
- shadcn/ui
