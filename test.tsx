import MarkdownPreactifier from "./mod.ts";
import { assertEquals, renderToString } from "./test-deps.ts";
import {
  type ComponentChildren,
  type ComponentConfigurator,
  type DirectiveOptions,
  type VNode,
} from "./types.d.ts";

interface CustomDirectiveProps {
  value: number | string;
  configured?: boolean;
  directiveType?: string;
  children?: ComponentChildren;
}

const CustomDirective = (props: CustomDirectiveProps) => {
  return (
    <div
      data-value={props.value}
      data-value-type={typeof props.value}
      data-configured={props.configured}
      data-directive-type={props.directiveType}
    >
      {props.children}
    </div>
  );
};

const customConfigurator1: ComponentConfigurator<CustomDirectiveProps> = (
  directive,
) => {
  return {
    value: 1,
    configured: true,
    directiveType: directive.type,
  };
};

const customConfigurator2: ComponentConfigurator<CustomDirectiveProps> = (
  directive,
) => {
  return {
    ...directive.attributes,
    children: [<h1>new child</h1>],
  } as CustomDirectiveProps;
};

const directives: DirectiveOptions = {
  custom: {
    component: CustomDirective,
  },
  customWithConfigurator: {
    component: CustomDirective,
    configure: customConfigurator1,
  },
  customWithChildren: {
    component: CustomDirective,
    configure: customConfigurator2,
  },
};

async function assertParseResult(markdown: string, html: VNode) {
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
    ":custom[content]{value=0}",
    <p>
      <div data-value={0} data-value-type="string">content</div>
    </p>,
  );
}

async function blockDirective() {
  await assertParseResult(
    "::custom[content]{value=0}",
    <div data-value={0} data-value-type="string">content</div>,
  );
}

async function containerDirective() {
  await assertParseResult(
    ":::custom{value=0}\n\ncontent1\n\ncontent2\n\n:::",
    <div data-value={0} data-value-type="string">
      <p>content1</p>
      <p>content2</p>
    </div>,
  );
}

async function inlineDirectiveWithConfigurator() {
  await assertParseResult(
    ":customWithConfigurator[content]{value=0}",
    <p>
      <div
        data-value={1}
        data-value-type="number"
        data-configured={true}
        data-directive-type="textDirective"
      >
        content
      </div>
    </p>,
  );
}

async function blockDirectiveWithConfigurator() {
  await assertParseResult(
    "::customWithConfigurator[content]{value=0}",
    <div
      data-value={1}
      data-value-type="number"
      data-configured={true}
      data-directive-type="leafDirective"
    >
      content
    </div>,
  );
}

async function containerDirectiveWithConfigurator() {
  await assertParseResult(
    ":::customWithConfigurator{value=0}\n\ncontent1\n\ncontent2\n\n:::",
    <div
      data-value={1}
      data-value-type="number"
      data-configured={true}
      data-directive-type="containerDirective"
    >
      <p>content1</p>
      <p>content2</p>
    </div>,
  );
}

async function inlineDirectiveWithConfiguredChildren() {
  await assertParseResult(
    ":customWithChildren[content]{value=0}",
    <p>
      <div data-value={0} data-value-type="string">
        <h1>new child</h1>
      </div>
    </p>,
  );
}

async function blockDirectiveWithConfiguredChildren() {
  await assertParseResult(
    "::customWithChildren[content]{value=0}",
    <div data-value={0} data-value-type="string">
      <h1>new child</h1>
    </div>,
  );
}

async function containerDirectiveWithConfiguredChildren() {
  await assertParseResult(
    ":::customWithChildren{value=0}\n\ncontent1\n\ncontent2\n\n:::",
    <div data-value={0} data-value-type="string">
      <h1>new child</h1>
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
Deno.test(inlineDirectiveWithConfiguredChildren);
Deno.test(blockDirectiveWithConfiguredChildren);
Deno.test(containerDirectiveWithConfiguredChildren);
