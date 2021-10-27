import ReactDOM from "react-dom";
import { useState, useEffect, useRef } from "react";
import * as esBuild from "esbuild-wasm";
import { unpkgPathPlugin } from "./plugin/unpkg-path-plugin";
import { fetchPlugin } from "./plugin/fetch-plugin";
const App = () => {
  const [input, setInput] = useState("");
  const service = useRef<any>();
  const iframe = useRef<any>();
  const startService = async () => {
    service.current = await esBuild.startService({
      wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm",
      worker: true,
    });
  };

  const html = `
 <html>
 <head></head>
 <body>
    <div id="root"></div>
    <script>
    window.addEventListener('message', (event) => {
        try {
            eval(event.data)
        } catch(error) {
            const root = document.querySelector('#root');
            root.innerHTML = '<div style="color: red"><h4>Run time error</h4>'+ error + '</div>';
            throw error;
        }    
    }, false)
    </script>
 </body>
</html>
  `;
  useEffect(() => {
    startService();
  }, []);
  const onClick = async () => {
    if (!service.current) return;
    iframe.current.srcdoc = html;

    const result = await service.current.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        "process.env.NODE_ENV": '"production"',
        global: "window",
      },
    });

    iframe.current.contentWindow.postMessage(result.outputFiles[0].text, "*");
  };

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button type="submit" onClick={onClick}>
          Submit
        </button>
      </div>
      {/* <pre>{output}</pre> */}
      <iframe
        ref={iframe}
        srcDoc={html}
        title="execute html code"
        sandbox="allow-scripts"
      />
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
