import { Logging } from 'homebridge'
import chalk from 'chalk'

const log = <Logging>{
	prefix: 'unifi',
	debug: console.log.bind(console, chalk.dim('debug')),
	info: console.log.bind(console, 'info'),
	warn: console.log.bind(console, chalk.yellow('warn')),
	error: console.log.bind(console, chalk.red('error')),
	log: console.log.bind(console, 'log'),
}

export default log
