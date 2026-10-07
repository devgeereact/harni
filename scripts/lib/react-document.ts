import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { parseFragment, type DefaultTreeAdapterMap } from "parse5";
import { Application } from "../../src/app/Application.tsx";
import type { ContentNode, ElementNode } from "../../src/app/tree.ts";

type HtmlNode = DefaultTreeAdapterMap["node"];
const protectEmailLinks = (html: string): string =>
  html.replace(
    /<a\b[^>]*href="mailto:[^"]+"[^>]*>[\s\S]*?<\/a>/g,
    "<!--email_off-->$&<!--/email_off-->",
  );

/** Convert only repository-owned content at build time. This is not an untrusted HTML API. */
export function contentTree(body: string): ContentNode[] {
  function convert(node: HtmlNode): ContentNode | null {
    if (node.nodeName === "#text") return "value" in node ? node.value : null;
    if (!("tagName" in node)) return null;
    const attrs = Object.fromEntries(
      node.attrs.map((attr) => [attr.name, attr.value]),
    );
    if (node.tagName === "script" && attrs.type !== "application/ld+json")
      throw new Error(
        "Executable scripts must use the application entry, not content.",
      );
    for (const [name, value] of Object.entries(attrs)) {
      if (/^on/i.test(name) || /^(?:javascript|vbscript):/i.test(value.trim()))
        throw new Error(`Executable content attribute rejected: ${name}`);
    }
    if (node.tagName === "noscript") {
      const fallback = node.childNodes
        .map((child) => ("value" in child ? child.value : ""))
        .join("");
      parseFragment(fallback, { scriptingEnabled: false }).childNodes.forEach(
        convert,
      );
    }
    const children = node.childNodes
      .map(convert)
      .filter((child): child is ContentNode => child !== null);
    if (node.tagName === "noscript") {
      // Raw fallback HTML must be identical in SSR and the hydration payload.
      for (let index = 0; index < children.length; index++) {
        const child = children[index];
        if (typeof child === "string")
          children[index] = protectEmailLinks(child);
      }
    }
    const result: ElementNode = { tag: node.tagName, attrs, children };
    if (node.tagName === "select") {
      for (const option of children) {
        if (
          typeof option !== "string" &&
          option.tag === "option" &&
          "selected" in option.attrs
        ) {
          attrs.value = option.attrs.value ?? option.children.join("");
          delete option.attrs.selected;
        }
      }
    }
    return result;
  }
  return parseFragment(body)
    .childNodes.map(convert)
    .filter((node): node is ContentNode => node !== null);
}

export function reactDocument(document: string): string {
  const match = /<body([^>]*)>([\s\S]*?)<\/body>/.exec(document);
  if (!match) throw new Error("Content document has no body.");
  const tree = contentTree(match[2] ?? "");
  // JSON is inert and script-safe even when source wording includes a closing script tag.
  const payload = JSON.stringify(tree)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
  const rendered = renderToString(createElement(Application, { tree }));
  // Keep Cloudflare's existing email-obfuscation exclusions. Comments are not React DOM nodes.
  const protectedEmail = rendered
    .split(/(<noscript\b[^>]*>[\s\S]*?<\/noscript>)/g)
    .map((part, index) => (index % 2 === 1 ? part : protectEmailLinks(part)))
    .join("");
  return document
    .replace(
      /<script type="module" src="\/src\/(?:site|main)\.ts"><\/script>/,
      '<script type="module" src="/src/app/main.tsx"></script>',
    )
    .replace(
      match[0],
      `<body${match[1] ?? ""}><div id="harni-root" class="contents">${protectedEmail}</div><script id="harni-page" type="application/json">${payload}</script></body>`,
    );
}
