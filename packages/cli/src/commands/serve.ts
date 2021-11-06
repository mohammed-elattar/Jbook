import path from 'path';
import {Command} from 'commander';
import {serve} from 'local-api';
export const serveCommand = new Command()
.command('serve [fileName]')
.option('-p, --port <number>', 'port to run server on', '4005')
.description('Open file for editing')
.action((fileName = 'notebook.js', options: {port:string})=> {
    const dir = path.join(process.cwd(), path.dirname(fileName));
    serve(parseInt(options.port), path.basename(fileName), dir);
})
;
