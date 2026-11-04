import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

test("homepage uses the approved concept scene and labels it accessibly", () => {
  const homepage = fs.readFileSync("src/app/[locale]/page.tsx", "utf8");
  assert.match(homepage, /src=\"\/images\/hero\/reach-home-cinema-concept\.png\"/);
  assert.match(homepage, /alt=\"Premium home cinema living room with a large projection screen at dusk\"/);
  assert.equal(fs.existsSync("public/images/hero/reach-home-cinema-concept.png"), true);
});
