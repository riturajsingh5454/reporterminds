import sanitizeHtml from "sanitize-html";

export function sanitizeArticleHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "iframe"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "title", "width", "height"],
      a: ["href", "name", "target", "rel"],
      iframe: ["src", "width", "height", "allow", "allowfullscreen", "frameborder"],
    },
    allowedIframeHostnames: ["www.youtube.com", "player.vimeo.com"],
  });
}
