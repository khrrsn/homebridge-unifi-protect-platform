import chalk from 'chalk'
import nopt from 'nopt'

export default function parseOptions(
	name: string,
	types: { [k: string]: Object },
): { [k: string]: Object } {
	types.help = Boolean
	const parsed = nopt(types)

	if (parsed.help) {
		console.log(
			chalk.dim(`yarn ${name}`),
			...Object.keys(types)
				.filter(value => value !== 'help')
				.map(value => chalk.dim(`[--${value}]`)),
		)

		process.exit(0)
	}

	return parsed
}
