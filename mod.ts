import { configureAll, parseMarkdown, preactify } from "./deps.ts";
import { type DirectiveOptions, type JSX, type Mdast } from "./types.d.ts";

export default class MarkdownPreactifier {
  constructor(private directives: DirectiveOptions) {}

  public parse(markdown: string): Mdast {
    return parseMarkdown(markdown);
  }

  public async configure(mdast: Mdast): Promise<void> {
    await configureAll(mdast, this.directives);
  }

  public preactify(mdast: Mdast): JSX.Element | null {
    return preactify(mdast, this.directives);
  }
}
