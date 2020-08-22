const extensions = ['ts', 'js', 'cjs', 'json', 'yaml', 'yml', 'markdown'].join(',')

module.exports = {
	[`**/*.{${extensions}}`]: 'prettier --write',
	[`*.{${extensions}}`]: 'prettier --write',
}
