import { colorGradient } from "@commands/colorGradient";
import { convert } from "@commands/convert";
import { Command } from "commander";
import {
	BORDER_COLOR_DECLARATION,
	BORDER_COLOR_DESCRIPTION,
	DESTINATION_DECLARATION,
	DESTINATION_DESCRIPTION,
	FILL_COLOR_DECLARATION,
	FILL_COLOR_DEFAULT,
	FILL_COLOR_DESCRIPTION,
	GENERATED_FILE_NAME_DECLARATION,
	GENERATED_FILE_NAME_DESCRIPTION,
	MULTI_COLOR_DECLARATION,
	MULTI_COLOR_DESCRIPTION,
	ROTATION_FILE_DECLARATION,
	ROTATION_FILE_DESCRIPTION,
	TIME_DECLARATION,
	TIME_DESCRIPTION,
} from "constants/COMMANDER_CONSTANTS";

import * as dotenv from "dotenv";
dotenv.config({ path: `${__dirname}/../.env` });

const program = new Command();

program.enablePositionalOptions();

program.enablePositionalOptions().option("-p, --progress");

program
	.version("0.0.1")
	.description("A CLI for converting GPLates GPML files to SVGs.");

program
	.command("convert")
	.requiredOption(TIME_DECLARATION, TIME_DESCRIPTION)
	.requiredOption(DESTINATION_DECLARATION, DESTINATION_DESCRIPTION)
	.option(FILL_COLOR_DECLARATION, FILL_COLOR_DESCRIPTION, FILL_COLOR_DEFAULT)
	.option(ROTATION_FILE_DECLARATION, ROTATION_FILE_DESCRIPTION)
	.option(GENERATED_FILE_NAME_DECLARATION, GENERATED_FILE_NAME_DESCRIPTION)
	.option(MULTI_COLOR_DECLARATION, MULTI_COLOR_DESCRIPTION)
	.option(BORDER_COLOR_DECLARATION, BORDER_COLOR_DESCRIPTION)
	.argument("<filepaths...>")
	.action(async (filepaths, options) => {
		convert(filepaths, options);
	});

program
	.command("color-gradient")
	.requiredOption(TIME_DECLARATION, TIME_DESCRIPTION)
	.requiredOption(DESTINATION_DECLARATION, DESTINATION_DESCRIPTION)
	.requiredOption(
		"-cr, --color-ramp <string>",
		"file for gradient or color ramp",
	)
	.option(ROTATION_FILE_DECLARATION, ROTATION_FILE_DESCRIPTION)
	.option(GENERATED_FILE_NAME_DECLARATION, GENERATED_FILE_NAME_DESCRIPTION)
	.option(BORDER_COLOR_DECLARATION, BORDER_COLOR_DESCRIPTION)
	.option("-f, --file-path <string>", "file to color with a gradient")
	.action(async (options) => {
		colorGradient(options);
	});

program.parse(process.argv);
