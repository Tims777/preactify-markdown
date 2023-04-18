/// <reference no-default-lib="true" />
/// <reference lib="deno.ns" />

export type { Root as Mdast } from "https://esm.sh/v114/@types/mdast@3.0.11/index.d.ts";

import type {
  Comment,
  DocType,
  Element,
  ElementContent,
  Root,
  Text,
} from "https://esm.sh/v113/@types/hast@2.3.4/index.d.ts";

export type HastNode = Root | Element | DocType | Comment | Text;

export type {
  ComponentChildren,
  ComponentType,
  VNode,
} from "https://esm.sh/v114/preact@10.13.2/src/index.d.ts";

import type {
  ContainerDirective,
  Directive,
  LeafDirective,
  TextDirective,
} from "https://esm.sh/v114/mdast-util-directive@2.2.4/index.d.ts";

export type { Directive };

declare module "https://esm.sh/v114/@types/mdast@3.0.11/index.d.ts" {
  interface StaticPhrasingContentMap {
    textDirective: TextDirective;
  }
  interface BlockContentMap {
    containerDirective: ContainerDirective;
    leafDirective: LeafDirective;
  }
}

import type {
  ComponentType,
  JSX,
} from "https://esm.sh/v114/preact@10.13.2/src/index.d.ts";

// deno-lint-ignore ban-types no-explicit-any
export interface DirectiveHandler<P extends {} = any, C = any> {
  component: ComponentType<P> | keyof JSX.IntrinsicElements;
  configure?: ComponentConfigurator<P, C>;
}

export type MaybePromise<T> = Promise<T> | T;
export type ComponentConfigurator<TResult, TContext = void> = (
  directive: Directive,
  context?: TContext,
) => MaybePromise<TResult | false>;
export type DirectiveOptions = Record<string, DirectiveHandler>;

export interface ConfiguredDirective {
  type: "configuredDirective";
  name: string;
  properties: Record<string, unknown>;
  children: ElementContent[];
}

export interface SkippedDirective {
  type: "skippedDirective";
}
