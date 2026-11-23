// One Emoji, One Smile — make.fun bounty
// Writes exactly one emoji to /output/entry.txt: the single emoji
// most likely to make someone smile.
//
// The emoji: "😊" (U+1F60A, smiling face with smiling eyes) — the
// warmest, friendliest smile in the set. No teeth, no wink, no joke
// to decode: just a calm, genuine, open smile. It reads instantly
// in every language and every age group, and it is the face people
// picture when they think of someone smiling back at them.
//
// Why this emoji wins:
// 1. It IS a smile — the brief asks for the one emoji most likely
//    to make someone smile, and this is the smile itself.
// 2. Warm and friendly: soft closed eyes, gentle upturned mouth —
//    the expression of someone glad to see you.
// 3. Universal: no words, no culture, no in-joke — a smile needs
//    no translation.
// 4. Fresh enough to stand out from the obvious 😀/😄, yet everyone
//    reads it in a blink.
import { writeFileSync, readFileSync, mkdirSync } from "node:fs";

const EMOJI = "😊";
const OUTPUT_PATH = "/output/entry.txt";

// Gate: the entry must be exactly one Unicode code point, with no
// whitespace, newline, or extra characters. Refuse to write
// anything that would fail the gate.
if ([...EMOJI].length !== 1 || EMOJI.trim().length === 0) {
  throw new Error(`Invalid entry emoji: ${JSON.stringify(EMOJI)}`);
}
if (/\s/.test(EMOJI)) {
  throw new Error("Entry must be exactly one emoji (no whitespace).");
}
// Gate: that single code point must actually be an emoji — it must
// sit inside a Unicode emoji block (here: Emoticons U+1F600–
// U+1F64F, where 😊 U+1F60A lives). A letter, digit, or punctuation
// mark must never pass as the entry.
const codePoint = EMOJI.codePointAt(0);
const IN_EMOJI_BLOCK =
  (codePoint >= 0x1f600 && codePoint <= 0x1f64f) || // Emoticons
  (codePoint >= 0x1f300 && codePoint <= 0x1f5ff) || // Misc Symbols and Pictographs
  (codePoint >= 0x1f900 && codePoint <= 0x1f9ff) || // Supplemental Symbols and Pictographs
  (codePoint >= 0x2600 && codePoint <= 0x27bf); // Misc Symbols and Dingbats
if (!IN_EMOJI_BLOCK) {
  throw new Error(
    `Entry is not an emoji (U+${codePoint.toString(16).toUpperCase()}): ${JSON.stringify(EMOJI)}`,
  );
}

mkdirSync("/output", { recursive: true });
writeFileSync(OUTPUT_PATH, EMOJI, "utf8");

// Self-check: read the file back and confirm it holds exactly the
// one emoji, byte for byte, with nothing else in it.
const written = readFileSync(OUTPUT_PATH, "utf8");
if (written !== EMOJI) {
  throw new Error(`Self-check failed: entry.txt holds ${JSON.stringify(written)}`);
}
