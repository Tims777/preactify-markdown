/// <reference no-default-lib="true" />
/// <reference lib="deno.ns" />

import MarkdownPreactifier from "./mod.ts";
import { assertEquals, renderToString } from "./test-deps.ts";
import { type ComponentChildren, type DirectiveOptions, type JSX } from "./types.d.ts";

const CustomDirective = (props: { name?: string; children?: ComponentChildren }) => {
  return <div name={props.name}>{props.children}</div>
};

const directives: DirectiveOptions = {
  custom: {
    component: CustomDirective,
  }
};

async function assertParseResult(markdown: string, html: JSX.Element) {
  const preactifier = new MarkdownPreactifier(directives);
  const hast = preactifier.parse(markdown);
  const configured = await preactifier.configure(hast);
  const jsx = preactifier.preactify(configured);
  const actual = renderToString(jsx ?? <></>);
  const expected = renderToString(html);
  assertEquals(actual, expected);
}

async function parseHeading() {
  await assertParseResult("# Heading", <h1>Heading</h1>);
}

async function parseInlineDirective() {
  await assertParseResult(
    ":custom[content]{name=0}",
    <p>
      <div name="0">content</div>
    </p>,
  );
}

async function parseBlockDirective() {
  await assertParseResult(
    "::custom[content]{name=0}",
    <div name="0">content</div>,
  );
}

async function parseContainerDirective() {
  await assertParseResult(
    ":::custom{name=0}\n\ncontent1\n\ncontent2\n\n:::",
    <div name="0">
      <p>content1</p>
      <p>content2</p>
    </div>,
  );
}

async function plainText() {
  await assertParseResult(
    "Nothing special",
    <p>Nothing special</p>,
  );
}

Deno.test(parseHeading);
Deno.test(parseInlineDirective);
Deno.test(parseBlockDirective);
Deno.test(parseContainerDirective);
Deno.test(plainText);
