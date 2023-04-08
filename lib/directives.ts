import { unistVisit } from "../deps.ts";
import {
  type ConfiguredDirective,
  type Directive,
  type DirectiveHandler,
  type DirectiveOptions,
  type Mdast,
  type SkippedDirective,
} from "../types.d.ts";

enum DirectiveType {
  "textDirective",
  "leafDirective",
  "containerDirective",
}

function isUnprocessedDirective(node: { type: string }): node is Directive {
  return node.type in DirectiveType;
}

export async function configureAll<T extends Mdast>(
  tree: T,
  handlers: DirectiveOptions,
) {
  const directives: Directive[] = [];
  unistVisit(tree, isUnprocessedDirective, (node) => {
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
  const result = handler
    ? await (handler.configure ?? defaultConfigurator)(directive)
    : false;
  if (result === false) {
    overwrite(directive, { type: "skippedDirective" });
  } else {
    overwrite(directive, {
      type: "configuredDirective",
      properties: result,
    });
  }
}

function overwrite(
  oldNode: Directive,
  newNode: Partial<ConfiguredDirective | SkippedDirective>,
) {
  Object.assign(oldNode, newNode);
}
