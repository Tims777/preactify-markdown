import { unistMap, unistVisit } from "../deps.ts";
import {
  type ComponentConfiguration,
  type Directive,
  type DirectiveOptions,
  type InclusiveDescendant,
  type UnistNode,
} from "../types.d.ts";

enum DirectiveType {
  "textDirective",
  "leafDirective",
  "containerDirective",
}

function createConfiguredNode(name: string, config: ComponentConfiguration): UnistNode {
  return {
    type: "mappedDirective",
    data: {
      hName: name,
      hProperties: config.props,
    },
    // TODO: Children
  };
}

function keyify(x: unknown) {
  // TODO: This is very inefficient
  return JSON.stringify(x);
}

export function isDirective(node: { type: string }): node is Directive {
  return node.type in DirectiveType;
}

export async function mapDirectives<T extends UnistNode>(
  tree: T,
  handlers: DirectiveOptions,
): Promise<T> {
  const directives: Record<string, Directive> = {};
  unistVisit(tree, isDirective, (node: Directive) => {
    const key = keyify(node);
    directives[key] = node;
  });

  const mapped: Record<string, InclusiveDescendant<T>> = {};
  for (const key in directives) {
    const directive = directives[key];
    if (directive.name in handlers) {
      const handler = handlers[directive.name];
      let config: ComponentConfiguration;
      if (handler.configure) {
        config = await handler.configure(directive);
      } else {
        config = {
          children: directive.children,
          props: directive.attributes ?? {},
        };
      }
      mapped[key] = createConfiguredNode(
        directive.name,
        config,
      ) as InclusiveDescendant<T>;
    }
  }

  return unistMap(tree, (node) => {
    const key = keyify(node);
    if (key in mapped) {
      return mapped[key];
    } else {
      return node;
    }
  });
}
