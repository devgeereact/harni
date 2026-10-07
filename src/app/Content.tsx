import { createElement, useEffect, useState } from "react";
import { propsFor, type ContentNode, type ElementNode } from "./tree";
import { Navigation, useNavigation } from "../features/navigation/Navigation";
import { useCatalogue } from "../features/catalogue/Catalogue";
import { MailForm, useMailForm } from "../features/forms/MailForm";
import { useConsent } from "../features/consent/Consent";

export function Content({ nodes }: { nodes: ContentNode[] }) {
  return nodes.map((node, key) =>
    typeof node === "string" ? node : <Element key={key} node={node} />,
  );
}
function Year({ node }: { node: ElementNode }) {
  const [year, setYear] = useState(node.children.join(""));
  useEffect(() => setYear(String(new Date().getFullYear())), []);
  return createElement(node.tag, propsFor(node), year);
}
function Element({ node }: { node: ElementNode }) {
  const nav = useNavigation();
  const catalogue = useCatalogue();
  const form = useMailForm();
  const consent = useConsent();
  const children = <Content nodes={node.children} />;
  if ("data-head" in node.attrs)
    return <Navigation node={node}>{children}</Navigation>;
  if ("data-join-form" in node.attrs || "data-contact-form" in node.attrs)
    return <MailForm node={node}>{children}</MailForm>;
  if ("data-year" in node.attrs) return <Year node={node} />;
  const props = propsFor(node);
  if ("data-nav-toggle" in node.attrs && nav)
    Object.assign(props, {
      ref: nav.button,
      "aria-expanded": nav.open,
      onClick: nav.toggle,
    });
  if ("data-nav" in node.attrs && nav)
    props["data-open"] = nav.open ? "" : undefined;
  if ("data-consent" in node.attrs) props.hidden = !consent.open;
  if ("data-consent-open" in node.attrs)
    props.onClick = (event: React.MouseEvent<HTMLElement>) =>
      consent.show(event.currentTarget);
  if ("data-consent-accept" in node.attrs)
    props.onClick = () => consent.choose("accepted");
  if ("data-consent-reject" in node.attrs)
    props.onClick = () => consent.choose("rejected");
  if (
    node.tag === "button" &&
    node.attrs.class?.split(" ").includes("chip") &&
    "data-group" in node.attrs
  ) {
    Object.assign(props, {
      "aria-pressed": catalogue.group === node.attrs["data-group"],
      onClick: () =>
        catalogue.setGroup(
          catalogue.group === node.attrs["data-group"]
            ? null
            : (node.attrs["data-group"] ?? null),
        ),
    });
  }
  if (
    node.attrs.class
      ?.split(" ")
      .some((name) => name === "card" || name === "feature") &&
    "data-group" in node.attrs
  )
    props.className = `${node.attrs.class}${catalogue.group && catalogue.group !== node.attrs["data-group"] ? " is-dim" : ""}`;
  if ("data-chips-note" in node.attrs && catalogue.group) {
    // This element is a live region. Its source text is replaced by the selected chip's public blurb.
    return <CatalogueNote node={node} group={catalogue.group} />;
  }
  if ("data-form-status" in node.attrs && form)
    return createElement(node.tag, props, form.status);
  if (node.tag === "button" && node.attrs.type === "submit" && form) {
    props.disabled = form.pending;
    props.className = `${node.attrs.class ?? ""} disabled:cursor-wait disabled:opacity-60`;
  }
  if (node.tag === "noscript")
    return createElement(node.tag, {
      ...props,
      dangerouslySetInnerHTML: { __html: node.children.join("") },
    });
  if (node.tag === "script" || node.tag === "style")
    return createElement(node.tag, props, node.children.join(""));
  if (node.tag === "textarea") return createElement(node.tag, props);
  return createElement(
    node.tag,
    props,
    node.children.length ? children : undefined,
  );
}
function CatalogueNote({ node, group }: { node: ElementNode; group: string }) {
  const [text, setText] = useState(node.children.join(""));
  useEffect(
    () =>
      setText(
        document.querySelector<HTMLElement>(
          `.chip[data-group="${CSS.escape(group)}"]`,
        )?.dataset.blurb ?? node.children.join(""),
      ),
    [group, node],
  );
  return createElement(node.tag, propsFor(node), text);
}
