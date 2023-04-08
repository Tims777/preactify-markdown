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

function defaultConfigurator(directive: Directive) {
  return directive.attributes;
}

export async function configure(
  directive: Directive,
  handler?: DirectiveHandler,
) {
  const configure = handler?.configure ?? defaultConfigurator;
  const result = await configure(directive);
  if (!result) return; // TODO: remove node if result === false
  directive.data ??= {};
  directive.data.hName = directive.name;
  directive.data.hProperties = result;
  if ("children" in result) directive.data.hChildren = result.children;
}
