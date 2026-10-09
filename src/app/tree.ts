/** Public, build-time content only. No HTML strings or executable attributes enter React. */
export interface ElementNode {
  tag: string;
  attrs: Record<string, string>;
  children: ContentNode[];
}
export type ContentNode = string | ElementNode;

const names: Record<string, string> = {
  class: "className",
  for: "htmlFor",
  tabindex: "tabIndex",
  autocomplete: "autoComplete",
  inputmode: "inputMode",
  maxlength: "maxLength",
  minlength: "minLength",
  readonly: "readOnly",
  novalidate: "noValidate",
  autofocus: "autoFocus",
  colspan: "colSpan",
  rowspan: "rowSpan",
  srcset: "srcSet",
  crossorigin: "crossOrigin",
  referrerpolicy: "referrerPolicy",
  fetchpriority: "fetchPriority",
  datetime: "dateTime",
  acceptcharset: "acceptCharset",
  allowfullscreen: "allowFullScreen",
  playsinline: "playsInline",
  formaction: "formAction",
};
const boolean = new Set([
  "hidden",
  "required",
  "disabled",
  "multiple",
  "checked",
  "selected",
  "readonly",
  "novalidate",
  "autofocus",
  "open",
  "controls",
  "muted",
  "loop",
  "playsinline",
  "allowfullscreen",
]);
const camel = (name: string): string =>
  name.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());

export function propsFor(node: ElementNode): Record<string, unknown> {
  const props: Record<string, unknown> = {};
  for (const [name, value] of Object.entries(node.attrs)) {
    const prop =
      names[name] ??
      (name.startsWith("aria-") || name.startsWith("data-")
        ? name
        : camel(name));
    if (name === "style") {
      props.style = Object.fromEntries(
        value
          .split(";")
          .filter(Boolean)
          .map((declaration) => {
            const colon = declaration.indexOf(":");
            const key = declaration.slice(0, colon).trim();
            return [
              key.startsWith("--") ? key : camel(key),
              declaration.slice(colon + 1).trim(),
            ];
          }),
      );
    } else if (name === "value" && ["input", "select"].includes(node.tag))
      props.defaultValue = value;
    else if (name === "checked") props.defaultChecked = true;
    else props[prop] = boolean.has(name) ? true : value;
  }
  if (node.tag === "textarea") props.defaultValue = node.children.join("");
  return props;
}
