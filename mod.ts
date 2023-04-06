import { mapDirectives, parseMarkdown, preactify } from "./deps.ts";
import {
  type Directive,
  type JSX,
  type MdastContent,
  type MdastRoot,
} from "./types.d.ts";

export default class MarkdownPreactifier {
  private map(directive: Directive) {
    const type: string = directive.type;
    const children = directive.children;
    const data = {
      hName: `directive-${directive.name}`,
      hProperties: directive.attributes,
    };
    return { type, children, data } as MdastContent;
  }

  public parse(markdown: string): MdastRoot {
    return parseMarkdown(markdown);
  }

  public async configure(mdast: MdastRoot): Promise<MdastRoot> {
    return await mapDirectives(mdast, this.map);
  }

  public preactify(mdast: MdastRoot): JSX.Element | null {
    return preactify(mdast);
  }
}
