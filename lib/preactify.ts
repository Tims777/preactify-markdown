import { createElement, Fragment } from "preact";
import { toHast } from "../deps.ts";
import {
  type ConfiguredDirective,
  type DirectiveOptions,
  type HastNode,
  type Mdast,
  type SkippedDirective,
  type VNode,
} from "../types.d.ts";

export function preactify(
  mdast: Mdast,
  directives: DirectiveOptions,
): VNode | null {
  const passThrough: (ConfiguredDirective | SkippedDirective)["type"][] = [
    "configuredDirective",
    "skippedDirective",
  ];
  const hast = toHast(mdast, { passThrough });
  return hast ? preactifyHastNode(hast, directives) : null;
}

function preactifyHastNode(
  node: HastNode | ConfiguredDirective,
  directives: DirectiveOptions,
): VNode | null {
  if (node.type == "configuredDirective") {
    return createElement(
      directives[node.name].component,
      node.properties,
      node.properties.children ?? preactifyChildren(node, directives),
    );
  } else if (node.type == "element") {
    return createElement(
      node.tagName,
      node.properties ?? {},
      preactifyChildren(node, directives),
    );
  } else if (node.type == "root") {
    return createElement(Fragment, {}, preactifyChildren(node, directives));
  } else if (node.type == "text") {
    return createElement(Fragment, {}, node.value);
  } else {
    return null;
  }
}

function notNull<T>(x: T | null): x is T {
  return x !== null;
}

function preactifyChildren(
  node: { children: HastNode[] },
  directives: DirectiveOptions,
): VNode[] {
  return node.children.map((n) => preactifyHastNode(n, directives)).filter(
    notNull,
  );
}
