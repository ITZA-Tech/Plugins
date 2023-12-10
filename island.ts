import { Plugin } from "$fresh/server.ts";
import fileUrl from "npm:file-url";
import { yellow } from "std/fmt/colors.ts";
import { expandGlobSync } from "std/fs/expand_glob.ts";

export default function islands(): Plugin {
  const start = performance.now();
  const islands = new Set<string>();
  const denoJson = JSON.parse(Deno.readTextFileSync("deno.json"));
  const decoder = new TextDecoder();

  const files = expandGlobSync("**/*.tsx", {
    exclude: denoJson.exclude ?? [],
  });
  for (const file of files) {
    const of = Deno.openSync(file.path);
    const buffer = new Uint8Array(11);
    Deno.readSync(of.rid, buffer);
    if (decoder.decode(buffer.slice(1)) === "use client") {
      islands.add(fileUrl(file.path));
    }
    Deno.close(of.rid);
  }

  console.log(
    yellow(
      `\u26A1 Found ${islands.size} islands in ${Math.floor(performance.now() - start)}ms`,
    ),
  );

  return {
    name: "@island",
    islands: {
      baseLocation: "",
      paths: [...islands],
    },
  };
}
