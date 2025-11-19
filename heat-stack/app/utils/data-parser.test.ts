import { describe, expect, it } from 'vitest'
import { replacer, reviver, replacedMapToObject } from './data-parser.ts'

describe('data-parser', () => {
	describe('replacer', () => {
		it('should serialize Map objects', () => {
			const testMap = new Map([['a', 1], ['b', 2]])
			const result = replacer('testKey', testMap)
			
			expect(result).toEqual({
				dataType: 'Map',
				value: [['a', 1], ['b', 2]]
			})
		})

		it('should pass through non-Map values unchanged', () => {
			const testObject = { foo: 'bar' }
			const result = replacer('testKey', testObject)
			
			expect(result).toBe(testObject)
		})

		it('should handle primitive values', () => {
			expect(replacer('key', 'string')).toBe('string')
			expect(replacer('key', 42)).toBe(42)
			expect(replacer('key', true)).toBe(true)
			expect(replacer('key', null)).toBe(null)
		})

		it('should handle arrays', () => {
			const testArray = [1, 2, 3]
			const result = replacer('key', testArray)
			
			expect(result).toBe(testArray)
		})
	})

	describe('reviver', () => {
		it('should reconstruct Map objects', () => {
			const serializedMap = {
				dataType: 'Map',
				value: [['a', 1], ['b', 2]]
			}
			const result = reviver('testKey', serializedMap)
			
			expect(result).toBeInstanceOf(Map)
			expect(result.get('a')).toBe(1)
			expect(result.get('b')).toBe(2)
		})

		it('should pass through non-Map objects unchanged', () => {
			const testObject = { foo: 'bar' }
			const result = reviver('testKey', testObject)
			
			expect(result).toBe(testObject)
		})

		it('should handle primitive values', () => {
			expect(reviver('key', 'string')).toBe('string')
			expect(reviver('key', 42)).toBe(42)
			expect(reviver('key', true)).toBe(true)
			expect(reviver('key', null)).toBe(null)
		})

		it('should handle objects without dataType property', () => {
			const testObject = { someProperty: 'value' }
			const result = reviver('key', testObject)
			
			expect(result).toBe(testObject)
		})
	})

	describe('full round-trip serialization', () => {
		it('should serialize and deserialize Map correctly', () => {
			const originalMap = new Map<string, any>([
				['key1', 'value1'],
				['key2', { nested: 'object' }],
				['key3', [1, 2, 3]]
			])

			const serialized = JSON.stringify(originalMap, replacer)
			const deserialized = JSON.parse(serialized, reviver) as Map<string, any>

			expect(deserialized).toBeInstanceOf(Map)
			expect(deserialized.get('key1')).toBe('value1')
			expect(deserialized.get('key2')).toEqual({ nested: 'object' })
			expect(deserialized.get('key3')).toEqual([1, 2, 3])
		})

		it('should handle nested Maps', () => {
			const innerMap = new Map<string, any>([['inner', 'value']])
			const outerMap = new Map<string, any>([['outer', innerMap]])

			const serialized = JSON.stringify(outerMap, replacer)
			const deserialized = JSON.parse(serialized, reviver) as Map<string, any>

			expect(deserialized).toBeInstanceOf(Map)
			expect(deserialized.get('outer')).toBeInstanceOf(Map)
			expect((deserialized.get('outer') as Map<string, any>).get('inner')).toBe('value')
		})
	})

	describe('replacedMapToObject', () => {
		it('should convert Map-like objects to plain objects', () => {
			const mapLikeObject = {
				dataType: 'Map',
				value: [
					['key1', 'value1'],
					['key2', 'value2']
				]
			}

			const result = replacedMapToObject(mapLikeObject)

			expect(result).toEqual({
				key1: 'value1',
				key2: 'value2'
			})
		})

		it('should handle nested Map-like objects', () => {
			const nestedMapLikeObject = {
				dataType: 'Map',
				value: [
					['outer', {
						dataType: 'Map',
						value: [['inner', 'value']]
					}]
				]
			}

			const result = replacedMapToObject(nestedMapLikeObject)

			expect(result).toEqual({
				outer: {
					inner: 'value'
				}
			})
		})

		it('should handle arrays of Map-like objects', () => {
			const arrayWithMaps = [
				{
					dataType: 'Map',
					value: [['key1', 'value1']]
				},
				{
					dataType: 'Map',
					value: [['key2', 'value2']]
				}
			]

			const result = replacedMapToObject(arrayWithMaps)

			expect(result).toEqual([
				{ key1: 'value1' },
				{ key2: 'value2' }
			])
		})

		it('should pass through primitive values unchanged', () => {
			expect(replacedMapToObject('string')).toBe('string')
			expect(replacedMapToObject(42)).toBe(42)
			expect(replacedMapToObject(true)).toBe(true)
			expect(replacedMapToObject(null)).toBe(null)
		})

		it('should pass through regular objects unchanged', () => {
			const regularObject = { foo: 'bar', num: 123 }
			const result = replacedMapToObject(regularObject)
			
			expect(result).toBe(regularObject)
		})

		it('should handle arrays with mixed content', () => {
			const mixedArray = [
				'string',
				42,
				{
					dataType: 'Map',
					value: [['mapKey', 'mapValue']]
				},
				{ regularObject: 'value' }
			]

			const result = replacedMapToObject(mixedArray)

			expect(result).toEqual([
				'string',
				42,
				{ mapKey: 'mapValue' },
				{ regularObject: 'value' }
			])
		})

		it('should handle complex nested structures', () => {
			const complexStructure = {
				dataType: 'Map',
				value: [
					['level1', {
						dataType: 'Map',
						value: [
							['level2', [
								{
									dataType: 'Map',
									value: [['level3', 'deepValue']]
								}
							]]
						]
					}]
				]
			}

			const result = replacedMapToObject(complexStructure)

			expect(result).toEqual({
				level1: {
					level2: [
						{ level3: 'deepValue' }
					]
				}
			})
		})
	})
})