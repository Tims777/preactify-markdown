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

export async function configureAll<TTree extends Mdast, TContext>(
  tree: TTree,
  handlers: DirectiveOptions,
  context?: TContext,
) {
  const directives: Directive[] = [];
  unistVisit(tree, isUnprocessedDirective, (node) => {
    directives.push(node);
  });

  for (const directive of directives) {
    await configure(directive, handlers[directive.name], context);
  }
}

function defaultConfigurator(directive: Directive) {
  return directive.attributes;
}

export async function configure<TContext>(
  directive: Directive,
  handler?: DirectiveHandler,
  context?: TContext
) {
  const result = handler
    ? await (handler.configure ?? defaultConfigurator)(directive, context)
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
