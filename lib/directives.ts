import { unistVisit } from "../deps.ts";
import {
  type Directive,
  type DirectiveHandler,
  type DirectiveOptions,
  type Mdast,
} from "../types.d.ts";

enum DirectiveType {
  "textDirective",
  "leafDirective",
  "containerDirective",
}

export function isDirective(node: { type: string }): node is Directive {
  return node.type in DirectiveType;
}

export async function configureAll<T extends Mdast>(
  tree: T,
  handlers: DirectiveOptions,
) {
  const directives: Directive[] = [];
  unistVisit(tree, isDirective, (node) => {
    directives.push(node);
  });

  for (const directive of directives) {
    await configure(directive, handlers[directive.name]);
  }
}

export async function configure(
  directive: Directive,
  handler?: DirectiveHandler,
) {
  if (handler?.configure) await handler.configure(directive);
  directive.data ??= {};
  directive.data.hName = directive.name;
  directive.data.hProperties = directive.attributes;
}
