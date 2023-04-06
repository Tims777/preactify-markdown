import {
  directive,
  directiveFromMarkdown,
  fromMarkdown,
  gfm,
  gfmFromMarkdown,
} from "../deps.ts";
import { type MdastRoot } from "../types.d.ts";

export function parseMarkdown(markdown: string): MdastRoot {
  return fromMarkdown(markdown, "utf-8", {
    extensions: [directive(), gfm()],
    mdastExtensions: [directiveFromMarkdown, gfmFromMarkdown()],
  });
}
