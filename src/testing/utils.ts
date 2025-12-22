import { expect, type Mock, mock } from 'bun:test'
import { type ZodSafeParseResult, z } from 'zod'
import { type C4SClient, createC4SClient } from '../client/client'

const formatZodError = <T>(
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

type BaseSchema<T> = {
	safeParse: (data: unknown) => ZodSafeParseResult<T>
}

export const expectMatchesSchema = <T>(
	result: unknown,
	schema: BaseSchema<T>,
	nameContext?: string,
): T => {
	const parseResult = schema.safeParse(result)
	expect(
		parseResult.success,
		formatZodError(nameContext ?? 'Result', parseResult),
	).toBeTrue()

	// should not be thrown, due to above assertion, but provides type narrowing
	if (!parseResult.success) throw 1

	return parseResult.data
}

type MockedClient = C4SClient & { fetch: Mock<typeof globalThis.fetch> }
export const getMockClient = (): MockedClient => {
	const mockFetch = mock(fetch)
	const mockedClient = createC4SClient({
		fetch: mockFetch,
	})
	;(mockedClient as MockedClient).fetch = mockFetch
	return mockedClient as MockedClient
}

function cartesian(arrays: readonly unknown[][]): unknown[][] {
	return arrays.reduce<unknown[][]>(
		(acc, curr) => acc.flatMap((a) => curr.map((b) => [...a, b])),
		[[]],
	)
}

export const enumerateTestCases = <T extends Record<string, unknown>>(
	cases: Record<keyof T, unknown[]>,
): T[] => {
	const keys = [] as string[]
	const values = [] as unknown[][]

	for (const [k, v] of Object.entries(cases)) {
		keys.push(k)
		values.push(v)
	}

	return cartesian(values).map((v) => {
		return v.reduce(
			(acc, cur, i) => {
				;(acc as Record<string, unknown>)[keys[i] as string] = cur
				return acc
			},
			{} as Record<string, unknown>,
		)
	}) as T[]
}

export const prettyPrint = (obj: Record<string, unknown>): string =>
	Object.entries(obj)
		.filter((e) => typeof e[1] !== 'undefined')
		.map(([k, v]) => `${k}=${typeof v === 'object' ? JSON.stringify(v) : v}`)
		.join(', ')
