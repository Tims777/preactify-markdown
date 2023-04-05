import { createElement, type VNode } from "https://esm.sh/preact@10.13.2";
import { assertEquals } from "https://deno.land/std@0.182.0/testing/asserts.ts";
import { renderToString } from "https://esm.sh/preact-render-to-string@5.2.6";
import { type Factory, MarkdownPreactifier } from "./mod.ts";

const customElements: Record<string, Factory<VNode>> = {
  custom: (props, children) => createElement("div", props, children),
};

async function assertParseResult(markdown: string, html: VNode) {
  const preactifier = new MarkdownPreactifier(customElements);
  const actual = renderToString(await preactifier.parse(markdown));
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
