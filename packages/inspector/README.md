# Shared inspector

The extension and website use the same token reader, panel, and Base UI primitives.
The extension keeps its existing hook, browser storage, dragging, and Shadow DOM mount.

The website runs `/demo/crm` and `/demo/kanban` in same-origin iframes so the document-wide
token reader can run unchanged. Captured themes are held in the parent component's memory
and shared only with those two frames. Apply and Reset affect the Kanban root only.
Refreshing the landing page clears the capture and applied theme.

`styles.css` pins the website inspector to the extension's dark palette. The extension
continues using its existing Shadow DOM stylesheet.
