import { type ZodSafeParseResult, z } from 'zod'

export const formatZodError = <T>(
	name: string,
	result: ZodSafeParseResult<T>,
): string => {
	if (result.success) {
		return ''
	}
	const count = result.error.issues.length
	const errText = z
		.prettifyError(result.error)
		.split('\n')
		.map((s) => ` ${s}`)
		.join('\n')
	return `${name} did not match expected schema.\n\nValidation Error${count > 1 ? `s (${count})` : ''}:\n${errText}`
}
