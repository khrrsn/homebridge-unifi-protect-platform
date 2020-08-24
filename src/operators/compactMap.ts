import { filter, map } from 'rxjs/operators'

import { OperatorFunction } from 'rxjs'

export default function compactMap<T, R>(
	project: (value: T, index: number) => R | undefined | null,
): OperatorFunction<T, R> {
	return function mapOperation(source) {
		return <any>source.pipe(
			map(project),
			filter(value => value !== undefined && value !== null),
		)
	}
}
