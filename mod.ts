/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import {
  createElement,
  Fragment,
  type Plugin,
  type Processor,
  remarkDirective,
  remarkDirectiveRehype,
  remarkGfm,
  remarkParse,
  remarkRehype,
  unified,
  type VNode,
} from "./deps.ts";

import {
  type Comment,
  type DocType,
  type Element,
  type Root,
  type Text,
} from "https://esm.sh/v113/@types/hast@2.3.4/index.d.ts";

export type Factory<T> = (
  props: Record<string, unknown>,
  children: T[],
) => Promise<T> | T;

type HastNode = Root | Element | DocType | Comment | Text;

type PluginArgs = [Record<string, Factory<VNode>>];

const defined = (x: unknown) => x !== null && x !== undefined;

const rehypePreactify: Plugin<PluginArgs, Root, VNode> = function (this, map) {
  async function preactify(node: HastNode): Promise<VNode | null> {
    if (node.type == "element") {
      return preactifyElement(
        node.tagName,
        node.properties ?? {},
        await preactifyMany(node.children),
      );
    } else if (node.type == "root") {
      return createElement(Fragment, {}, await preactifyMany(node.children));
    } else if (node.type == "text") {
      return createElement(Fragment, {}, node.value);
    } else {
      return null;
    }
  }

  async function preactifyMany(nodes: HastNode[]) {
    const vnodes = await Promise.all(nodes.map(preactify));
    return vnodes.filter(defined) as VNode[];
  }

  async function preactifyElement(
    type: string,
    props: Record<string, unknown>,
    children: VNode[],
  ) {
    const factory: Factory<VNode> = type in map
      ? map[type]
      : (props, children) => createElement(type, props, children);
    return await factory(props, children);
  }

  this.Compiler = preactify;
};

export class MarkdownPreactifier {
  // deno-lint-ignore no-explicit-any
  private processor: Processor<any, any, any, VNode>;

  constructor(...args: PluginArgs) {
    this.processor = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkDirective)
      .use(remarkDirectiveRehype)
      .use(remarkRehype)
      .use(rehypePreactify, ...args);
  }

  public async parse(markdown: string) {
    const file = await this.processor.process(markdown);
    return file.result;
  }
}
