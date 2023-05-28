import test from "ava";
import { formatLocaleString } from "./helpers";

test("formatLocaleString", (t) => {
  t.is(formatLocaleString("ro", "md"), "ro_md");
});
