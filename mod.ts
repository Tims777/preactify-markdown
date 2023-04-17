import { configureAll, parseMarkdown, preactify } from "./deps.ts";
import { type DirectiveOptions, type Mdast, type VNode } from "./types.d.ts";

export default class MarkdownPreactifier<TContext = void> {
  constructor(private directives: DirectiveOptions) {}

  public parse(markdown: string): Mdast {
    return parseMarkdown(markdown);
  }

  public async configure(mdast: Mdast, context?: TContext): Promise<void> {
    await configureAll(mdast, this.directives, context);
  }

  public preactify(mdast: Mdast): VNode | null {
    return preactify(mdast, this.directives);
  }
}
