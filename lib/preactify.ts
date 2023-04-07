import { Fragment, jsx, jsxs } from "preact/jsx-runtime";
import { toHast, toJsxRuntime } from "../deps.ts";
import {
  type DirectiveOptions,
  type JSX,
  JsxComponents,
  type JsxOptions,
  type Mdast,
} from "../types.d.ts";

export function preactify(
  mdast: Mdast,
  directives: DirectiveOptions,
): JSX.Element | null {
  const hast = toHast(mdast);
  if (!hast) return null;

  const components: JsxComponents = {};
  for (const [k, v] of Object.entries(directives)) {
    components[k] = v.component;
  }

  const options = {
    Fragment,
    jsx,
    jsxs,
    components,
    elementAttributeNameCase: "html",
  } as JsxOptions;

  return toJsxRuntime(hast, options);
}
