import assert from "node:assert/strict";
import test from "node:test";
import { moveArrayItem, parseProductDescription } from "../../src/lib/product-presentation";

test("moves a selected image to the main position without mutating input", () => {
  const images = ["front.webp", "side.webp", "rear.webp"];
  assert.deepEqual(moveArrayItem(images, 2, 0), ["rear.webp", "front.webp", "side.webp"]);
  assert.deepEqual(images, ["front.webp", "side.webp", "rear.webp"]);
});

test("keeps the image order for invalid moves", () => {
  const images = ["front.webp", "side.webp"];
  assert.equal(moveArrayItem(images, 0, -1), images);
  assert.equal(moveArrayItem(images, 3, 0), images);
});

test("structures product copy into headings, paragraphs, and lists", () => {
  assert.deepEqual(
    parseProductDescription("Picture quality:\n- 4K resolution\n- Triple laser\n\nSetup is straightforward.\nUse the supplied remote."),
    [
      { type: "heading", text: "Picture quality" },
      { type: "list", ordered: false, items: ["4K resolution", "Triple laser"] },
      { type: "paragraph", text: "Setup is straightforward. Use the supplied remote." },
    ]
  );
});

test("supports markdown headings and numbered lists", () => {
  assert.deepEqual(parseProductDescription("## Before buying\n1. Confirm voltage\n2) Confirm plug"), [
    { type: "heading", text: "Before buying" },
    { type: "list", ordered: true, items: ["Confirm voltage", "Confirm plug"] },
  ]);
});
