import { Plugin } from "$fresh/server.ts";
import fileUrl from "npm:file-url";
import { expandGlob } from "std/fs/expand_glob.ts";

const islands = new Set<string>();
const denoJson = JSON.parse(Deno.readTextFileSync("deno.json"));

for await (
  const file of expandGlob("**/*.tsx", {
    exclude: denoJson.exclude ?? [],
  })
) {
  if (!file.isFile) throw new Error(`${file.path} is not a file`);

  if ((await Deno.readTextFile(file.path)).match(/['"]use client['"]/)) {
    islands.add(fileUrl(file.path));
  }
}

export default function (): Plugin {
  return {
    name: "@island",
    islands: {
      baseLocation: "",
      paths: [...islands],
    },
  };
}
