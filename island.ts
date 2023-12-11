import { Plugin } from "$fresh/server.ts";
import fileUrl from "npm:file-url";
import { yellow } from "std/fmt/colors.ts";
import { expandGlob } from "std/fs/expand_glob.ts";

const start = performance.now();
const islands = new Set<string>();

const denoJson = JSON.parse(await Deno.readTextFile("deno.json"));
// const decoder = new TextDecoder();
for await (
  const file of expandGlob("**/*.tsx", {
    exclude: denoJson.exclude ?? [],
  })
) {
  if ((await Deno.readTextFile(file.path)).match(/['"]use client['"]/)) {
    islands.add(fileUrl(file.path));
  }

  // const of = await Deno.open(file.path);
  // const buffer = new Uint8Array(11);
  // await Deno.read(of.rid, buffer);
  // if (decoder.decode(buffer.slice(1)) === "use client") {
  //   islands.add(fileUrl(file.path));
  // }
  // Deno.close(of.rid);
}

console.log(
  yellow(
    `\u26A1 Found ${islands.size} islands in ${
      Math.floor(performance.now() - start)
    }ms`,
  ),
);

export default function islandsPlugin(): Plugin {
  return {
    name: "@island",
    islands: {
      baseLocation: "",
      paths: [...islands],
    },
  };
}
