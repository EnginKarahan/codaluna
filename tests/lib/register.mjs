// Aktiviert root-hooks.mjs: node --import ./tests/lib/register.mjs …
import { register } from "node:module";

register("./root-hooks.mjs", import.meta.url);
