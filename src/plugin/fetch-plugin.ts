import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localforage from 'localforage';
var fileCache = localforage.createInstance({
    name: "filecache"
  });


interface AxiosResponse {
    data: string,
    request: any
}

export const fetchPlugin = (inputCode: string) => {
    return {
        name: 'fetch-plugin',
        setup(build: esbuild.PluginBuild) {
        build.onLoad({ filter: /^index\.js$/ }, async (args: any) => {
            return {
                loader: 'jsx',
                contents:inputCode,
              };
        })

    build.onLoad({ filter: /.*/ }, async (args: any) => {
            
    
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path);
    
        if(cachedResult) return cachedResult;
      });


    build.onLoad({ filter: /\.css$/ }, async (args: any) => {
            const { data, request }: AxiosResponse =  await axios.get(args.path);
            const escaped = data.replace(/\n/g, "").replace(/"/g, '\\"').replace(/'/g, "\\'");
            const contents =  `
            const style = document.createElement('style');
            style.innerText = '${escaped}';
            document.head.appendChild(style);
            `
            const output: esbuild.OnLoadResult =  {
                loader: 'jsx',
                contents,
                resolveDir: new URL('./',request.responseURL).pathname
              };
        
              await fileCache.setItem(args.path, output);
        
              return output;
    });
        build.onLoad({ filter: /.*/ }, async (args: any) => {    
            const { data, request }: AxiosResponse =  await axios.get(args.path);

            const output: esbuild.OnLoadResult =  {
                loader: 'jsx',
                contents: data,
                resolveDir: new URL('./',request.responseURL).pathname
              };
        
              await fileCache.setItem(args.path, output);
        
              return output;
          });
        }
    }
}
