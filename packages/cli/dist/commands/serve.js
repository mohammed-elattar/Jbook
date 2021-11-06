"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serveCommand = void 0;
var path_1 = __importDefault(require("path"));
var commander_1 = require("commander");
var local_api_1 = require("local-api");
exports.serveCommand = new commander_1.Command()
    .command('serve [fileName]')
    .option('-p, --port <number>', 'port to run server on', '4005')
    .description('Open file for editing')
    .action(function (fileName, options) {
    if (fileName === void 0) { fileName = 'notebook.js'; }
    var dir = path_1.default.join(process.cwd(), path_1.default.dirname(fileName));
    (0, local_api_1.serve)(parseInt(options.port), path_1.default.basename(fileName), dir);
});
