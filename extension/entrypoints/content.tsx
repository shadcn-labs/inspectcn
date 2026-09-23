import "@/assets/content-ui.css";

import ReactDOM from "react-dom/client";

import { ContentBadgeApp } from "@/components/content-badge-app";

export default defineContentScript({
  matches: ["<all_urls>"],
  cssInjectionMode: "ui",
  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: "inspectcn-badge",
      position: "overlay",
      anchor: "body",
      onMount(container, shadow) {
        container.dataset.inspectcnUi = "true";

        const app = document.createElement("div");
        app.id = "root";
        app.className = "dark";
        app.dataset.inspectcnUi = "true";
        container.append(app);

        const root = ReactDOM.createRoot(app);
        root.render(<ContentBadgeApp shadowRoot={shadow} />);

        return root;
      },
      onRemove(root) {
        root?.unmount();
      },
    });

    ui.mount();
  },
});
