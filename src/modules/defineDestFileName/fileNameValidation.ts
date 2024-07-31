// from gist https://gist.github.com/doctaphred/d01d05291546186941e1b7ddc02034d3
/*
    - The following reserved characters:

        < (less than)
        > (greater than)
        : (colon)
        " (double quote)
        / (forward slash)
        \ (backslash)
        | (vertical bar or pipe)
        ? (question mark)
        * (asterisk)

        - Do not use the following reserved names for the name of a file:
        
        CON, PRN, AUX, NUL, COM1, COM2, COM3, COM4, COM5, COM6, COM7, COM8,
        COM9, LPT1, LPT2, LPT3, LPT4, LPT5, LPT6, LPT7, LPT8, and LPT9.
*/

export enum ValidateFileNameResult {
	InvalidCharacter = "invalidCharacter",
	InvisibleFile = "invisibleFile",
	ReservedWord = "reservedWord",
	TooShort = "tooShort",
	Valid = "valid",
}

type validationResponse = {
	validationResult: ValidateFileNameResult[];
	message?: string;
};

const reservedCharacters = ["<", ">", ":", '"', "/", "\\", "|", "?", "*"];
const reservedWords = [
	"CON",
	"PRN",
	"AUX",
	"NUL",
	"COM1",
	"COM2",
	"COM3",
	"COM4",
	"COM5",
	"COM6",
	"COM7",
	"COM8",
	"COM9",
	"LPT1",
	"LPT2",
	"LPT3",
	"LPT4",
	"LPT5",
	"LPT6",
	"LPT7",
	"LPT8",
	"LPT9",
];

export function validateFileName(fileName: string): validationResponse {
	const formattedFileName = fileName.trim();

	const validationResponses: ValidateFileNameResult[] = [];
	const userMessage: string[] = [];

	if (formattedFileName.length < 3) {
		validationResponses.push(ValidateFileNameResult.TooShort);
		userMessage.push(
			`The proposed filename "${formattedFileName}" is too short. Please make the filename at least 3 characters long.`,
		);
	}

	const firstChar = formattedFileName.charAt(0);
	const lastChar = formattedFileName.charAt(formattedFileName.length - 1);

	if (firstChar === "." || lastChar === ".") {
		validationResponses.push(ValidateFileNameResult.InvisibleFile);
		userMessage.push(
			"File names should not begin or end with periods. In some file systems these files would become invisible.",
		);
	}

	// Check for reserved characters
	const invalidCharacters = reservedCharacters.filter((char) =>
		fileName.includes(char),
	);

	if (invalidCharacters.length > 0) {
		validationResponses.push(ValidateFileNameResult.InvalidCharacter);

		const message =
			invalidCharacters.length === 1
				? `The character ${invalidCharacters[0]} is invalid.`
				: `The characters ${invalidCharacters.join(",")} are invalid.`;

		userMessage.push(message);
	}

	// Check for reserved names
	if (reservedWords.includes(fileName.toUpperCase())) {
		validationResponses.push(ValidateFileNameResult.ReservedWord);
		userMessage.push(
			`The word ${fileName} is a reserved word in some file systems.`,
		);
	}

	if (validationResponses.length === 0) {
		return {
			validationResult: [ValidateFileNameResult.Valid],
		};
	}

	return {
		validationResult: validationResponses,
		message: userMessage.join("\n"),
	};
}
