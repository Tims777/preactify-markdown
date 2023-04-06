import { stringifyPosition as keyify, unistMap, unistVisit } from "../deps.ts";
import {
  type Directive,
  type InclusiveDescendant,
  type UnistNode,
} from "../types.d.ts";

enum DirectiveType {
  "textDirective",
  "leafDirective",
  "containerDirective",
}

export function isDirective(node: { type: string }): node is Directive {
  return node.type in DirectiveType;
}

type MapFn<X, Y> = (x: X) => Promise<Y> | Y;

export async function mapDirectives<T extends UnistNode>(
  tree: T,
  mapper: MapFn<Directive, InclusiveDescendant<T>>,
): Promise<T> {
  const directives: Record<string, Directive> = {};
  unistVisit(tree, isDirective, (node: Directive) => {
    const key = keyify(node);
    directives[key] = node;
  });

  const mapped: Record<string, InclusiveDescendant<T>> = {};
  for (const key in directives) {
    mapped[key] = await mapper(directives[key]);
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
