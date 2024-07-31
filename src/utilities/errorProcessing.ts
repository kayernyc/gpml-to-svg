export default function errorProcessing(err: unknown) {
	if (err instanceof Error) {
		console.trace(err.message);
	} else {
		console.warn("UNKNOWN ERR", err);
	}
}
