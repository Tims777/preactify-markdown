export { type JSX } from "https://esm.sh/v114/preact@10.13.2/jsx-runtime/src/index.d.ts";
export { type Options as JsxOptions } from "https://esm.sh/v114/hast-util-to-jsx-runtime@1.2.0/lib/index.d.ts";
export { type InclusiveDescendant } from "https://esm.sh/v114/unist-util-map@3.1.3/lib/complex-types.d.ts";
export { type Node as UnistNode } from "https://esm.sh/v114/@types/unist@2.0.6/index.d.ts";
export { type Directive } from "https://esm.sh/v114/mdast-util-directive@2.2.4/index.d.ts";
export {
  type Content as MdastContent,
  type Root as MdastRoot,
} from "https://esm.sh/v114/@types/mdast@3.0.11/index.d.ts";

import { type Directive } from "https://esm.sh/v114/mdast-util-directive@2.2.4/index.d.ts";
import { type ComponentType } from "https://esm.sh/v114/preact@10.13.2/src/index.d.ts";

// deno-lint-ignore ban-types
export interface DirectiveHandler<P = {}> {
  component: ComponentType<P>;
  configure?: ComponentConfigurator;
}

export type ComponentConfigurator = (
  directive: Directive,
) => Promise<ComponentConfiguration>;

export interface ComponentConfiguration {
  props: Record<string, string>;
  children: unknown[];
}
