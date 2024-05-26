import { Command } from "commander";

import path from "path";
import fs from "fs";

const program = new Command();
program
  .version("0.0.1")
  .description("An example CLI for managing a directory")
  .option("-l, --ls  [value]", "List directory contents")
  .option("-m, --mkdir <value>", "Create a directory")
  .option("-t, --touch <value>", "Create a file")
  .parse(process.argv);

const options = program.opts();
