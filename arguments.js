let args = process.argv.slice(2);
let formattedArguments = {};
for (let i = 0; i < args.length; i++) {
	let argument = args[i];
	formattedArguments[i] = argument;
	if (argument.startsWith("--")) {
		let assignment = args[i + 1];
		argument = argument.replace("--", "");
		if (argument.includes("=")) {
			let [key, value] = argument.split("=");
			formattedArguments[key] = value;
		} else {
			formattedArguments[argument] = assignment;
			i += 1;
		}
	} else if (argument.startsWith("-")) {
		let assignment = args[i + 1];
		argument = argument.replace("-", "");
		if (argument.includes("=")) {
			let [key, value] = argument.split("=");
			formattedArguments[key] = value;
		} else {
			formattedArguments[argument] = assignment;
			i += 1;
		}
	} else {
		formattedArguments[argument] = true;
	}
}
module.exports = formattedArguments;
