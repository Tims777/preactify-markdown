import MarkdownPreactifier from "./mod.ts";
import { assertEquals, renderToString } from "./test-deps.ts";
import {
  type ComponentChildren,
  type ComponentConfigurator,
  type DirectiveOptions,
  type JSX,
} from "./types.d.ts";

const CustomDirective = (
  props: { name?: string; configured?: string; children?: ComponentChildren },
) => {
  return (
    <div name={props.name} data-configured={props.configured}>
      {props.children}
    </div>
  );
};

const customConfigurator: ComponentConfigurator = async (directive) => {
  await Promise.all([]);
  directive.attributes ??= {};
  directive.attributes.name = "1";
  directive.attributes.configured = "true";
};

const directives: DirectiveOptions = {
  custom: {
    component: CustomDirective,
  },
  customWithConfigurator: {
    component: CustomDirective,
    configure: customConfigurator,
  },
};

async function assertParseResult(markdown: string, html: JSX.Element) {
  const preactifier = new MarkdownPreactifier(directives);
  const hast = preactifier.parse(markdown);
  await preactifier.configure(hast);
  const jsx = preactifier.preactify(hast);
  const actual = renderToString(jsx ?? <></>);
  const expected = renderToString(html);
  assertEquals(actual, expected);
}

async function plainText() {
  await assertParseResult(
    "Nothing special",
    <p>Nothing special</p>,
  );
}

async function heading() {
  await assertParseResult("# Heading", <h1>Heading</h1>);
}

async function inlineDirective() {
  await assertParseResult(
    ":custom[content]{name=0}",
    <p>
      <div name="0">content</div>
    </p>,
  );
}

async function blockDirective() {
  await assertParseResult(
    "::custom[content]{name=0}",
    <div name="0">content</div>,
  );
}

async function containerDirective() {
  await assertParseResult(
    ":::custom{name=0}\n\ncontent1\n\ncontent2\n\n:::",
    <div name="0">
      <p>content1</p>
      <p>content2</p>
    </div>,
  );
}

async function inlineDirectiveWithConfigurator() {
  await assertParseResult(
    ":customWithConfigurator[content]{name=0}",
    <p>
      <div name="1" data-configured="true">content</div>
    </p>,
  );
}

async function blockDirectiveWithConfigurator() {
  await assertParseResult(
    "::customWithConfigurator[content]{name=0}",
    <div name="1" data-configured="true">content</div>,
  );
}

async function containerDirectiveWithConfigurator() {
  await assertParseResult(
    ":::customWithConfigurator{name=0}\n\ncontent1\n\ncontent2\n\n:::",
    <div name="1" data-configured="true">
      <p>content1</p>
      <p>content2</p>
    </div>,
  );
}

Deno.test(plainText);
Deno.test(heading);
Deno.test(inlineDirective);
Deno.test(blockDirective);
Deno.test(containerDirective);
Deno.test(inlineDirectiveWithConfigurator);
Deno.test(blockDirectiveWithConfigurator);
Deno.test(containerDirectiveWithConfigurator);
