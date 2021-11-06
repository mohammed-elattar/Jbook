import * as esBuild from "esbuild-wasm";
import { unpkgPathPlugin } from "./plugin/unpkg-path-plugin";
import { fetchPlugin } from "./plugin/fetch-plugin";

let service: esBuild.Service;
const Bundle = async (rawCode: string) => {
  if (!service) {
    service = await esBuild.startService({
      wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm",
      worker: true,
    });
  }
  try {
    const result = await service.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
      define: {
        "process.env.NODE_ENV": '"production"',
        global: "window",
      },
      jsxFactory: "_React.createElement",
      jsxFragment: "_React.Fragment",
    });

    return { code: result.outputFiles[0].text, error: "" };
  } catch (error: any) {
    return { code: "", error: error.message };
  }
};

export default Bundle;
