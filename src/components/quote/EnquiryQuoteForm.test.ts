import assert from "node:assert/strict";
import test from "node:test";
import { createElement, Fragment } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { EnquiryQuoteForm } from "./EnquiryQuoteForm";

test("page and modal form labels target unique fields", () => {
  const html = renderToStaticMarkup(createElement(Fragment, null,
    createElement(EnquiryQuoteForm, { variant: "page" }),
    createElement(EnquiryQuoteForm, { variant: "modal" }),
  ));
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  const labels = [...html.matchAll(/<label\b[^>]*\bfor="([^"]+)"/g)].map((m) => m[1]);
  assert(ids.length > 0 && labels.length > 0);
  assert.equal(new Set(ids).size, ids.length, "coexisting forms must not duplicate IDs");
  for (const target of labels) {
    assert.equal(ids.filter((id) => id === target).length, 1, `label target ${target} must identify one field`);
  }
  assert.equal(labels.length, ids.length, "every rendered input/select has a label");
});
