import { mapDirectives, parseMarkdown, preactify } from "./deps.ts";
import { type DirectiveOptions, type JSX, type MdastRoot } from "./types.d.ts";

export default class MarkdownPreactifier {
  constructor(private directives: DirectiveOptions) {}

  public parse(markdown: string): MdastRoot {
    return parseMarkdown(markdown);
  }

  public async configure(mdast: MdastRoot): Promise<MdastRoot> {
    return await mapDirectives(mdast, this.directives);
  }

  public preactify(mdast: MdastRoot): JSX.Element | null {
    return preactify(mdast, this.directives);
  }
}
