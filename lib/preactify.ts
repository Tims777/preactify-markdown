import { Fragment, jsx, jsxs, toHast, toJsxRuntime } from "../deps.ts";
import { type JSX, type JsxOptions, type MdastRoot } from "../types.d.ts";

export function preactify(mdast: MdastRoot): JSX.Element | null {
  const hast = toHast(mdast);
  const options = {
    Fragment,
    jsx,
    jsxs,
    components: {},
    elementAttributeNameCase: "html",
  } as JsxOptions;
  return hast ? toJsxRuntime(hast, options) : null;
}
