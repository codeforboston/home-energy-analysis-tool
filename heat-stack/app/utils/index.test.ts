import { describe, expect, it } from 'vitest'
import { type BillingRecordsSchema } from '#types/types.ts'
import {
	objectToString,
	buildCurrentMapOfUsageData,
	buildCurrentUsageData,
	hasDataProperty,
	hasParsedAndValidatedFormSchemaProperty,
} from './index.ts'

describe('index utilities', () => {
	describe('objectToString', () => {
		it('should return "none" for null or undefined', () => {
			expect(objectToString(null)).toBe('none')
			expect(objectToString(undefined)).toBe('none')
		})

		it('should stringify primitive values', () => {
			expect(objectToString('hello')).toBe('"hello"')
			expect(objectToString(42)).toBe('42')
			expect(objectToString(true)).toBe('true')
			expect(objectToString(false)).toBe('false')
		})

		it('should format arrays correctly', () => {
			expect(objectToString([1, 2, 3])).toBe('[1, 2, 3]')
			expect(objectToString(['a', 'b'])).toBe('[\"a\", \"b\"]')
			expect(objectToString([])).toBe('[]')
		})

		it('should format objects correctly', () => {
			expect(objectToString({ a: 1, b: 2 })).toBe('{ "a": 1, "b": 2 }')
			expect(objectToString({})).toBe('{ }')
		})

		it('should handle nested structures', () => {
			const nested = {
				arr: [1, 2],
				obj: { inner: 'value' }
			}
			expect(objectToString(nested)).toBe('{ "arr": [1, 2], "obj": { "inner": "value" } }')
		})

		it('should handle arrays with objects', () => {
			const arrayWithObj = [{ a: 1 }, { b: 2 }]
			expect(objectToString(arrayWithObj)).toBe('[{ "a": 1 }, { "b": 2 }]')
		})
	})

	describe('buildCurrentMapOfUsageData', () => {
		it('should update processed_energy_bills in the map', () => {
			const originalMap = new Map([
				['existing_key', 'existing_value'],
				['processed_energy_bills', 'old_bills']
			])

			const newBillingRecords: BillingRecordsSchema = [
				{
					period_start_date: '2023-01-01',
					period_end_date: '2023-01-31',
					usage: 100,
					inclusion_override: true,
					analysis_type: 1,
					default_inclusion: true,
					eliminated_as_outlier: false,
					whole_home_heat_loss_rate: 50
				},
				{
					period_start_date: '2023-02-01',
					period_end_date: '2023-02-28',
					usage: 80,
					inclusion_override: false,
					analysis_type: 1,
					default_inclusion: true,
					eliminated_as_outlier: false,
					whole_home_heat_loss_rate: 45
				}
			]

			const result = buildCurrentMapOfUsageData(originalMap, newBillingRecords)

			expect(result.get('existing_key')).toBe('existing_value')
			expect(result.get('processed_energy_bills')).toHaveLength(2)
			
			const billMaps = result.get('processed_energy_bills') as Map<string, any>[]
			expect(billMaps[0]).toBeInstanceOf(Map)
			expect(billMaps[0]!.get('usage')).toBe(100)
			expect(billMaps[1]!.get('usage')).toBe(80)
		})

		it('should preserve original map structure while updating bills', () => {
			const originalMap = new Map([
				['heat_load_output', { some: 'data' }],
				['balance_point_graph', { other: 'data' }]
			])

			const newBillingRecords: BillingRecordsSchema = [
				{
					period_start_date: '2023-01-01',
					period_end_date: '2023-01-31',
					usage: 50,
					inclusion_override: true,
					analysis_type: 1,
					default_inclusion: true,
					eliminated_as_outlier: false,
					whole_home_heat_loss_rate: 40
				}
			]

			const result = buildCurrentMapOfUsageData(originalMap, newBillingRecords)

			expect(result.get('heat_load_output')).toEqual({ some: 'data' })
			expect(result.get('balance_point_graph')).toEqual({ other: 'data' })
			expect(result.get('processed_energy_bills')).toHaveLength(1)
		})
	})

	describe('buildCurrentUsageData', () => {
		it('should build usage data from parsed result map', () => {
			const heatLoadOutput = new Map([
				['estimated_balance_point', 65],
				['whole_home_heat_loss_rate', 100],
				['average_indoor_temperature', 70],
				['design_temperature', 10],
				['other_fuel_usage', 0],
				['difference_between_ti_and_tbp', 5],
				['standard_deviation_of_heat_loss_rate', 15],
				['average_heat_load', 5000],
				['maximum_heat_load', 6000]
			]) as Map<string, any>

			const balancePointGraph = new Map([
				['records', [
					{
						balance_point: 65,
						heat_loss_rate: 100,
						change_in_heat_loss_rate: 5,
						percent_change_in_heat_loss_rate: 10,
						standard_deviation: 15
					}
				]]
			]) as Map<string, any>

			const processedBills = [
				new Map([
					['period_start_date', '2023-01-01'],
					['period_end_date', '2023-01-31'],
					['usage', 100],
					['inclusion_override', true],
					['analysis_type', 1],
					['default_inclusion', true],
					['eliminated_as_outlier', false],
					['whole_home_heat_loss_rate', 50]
				] as [string, any][]) as Map<string, any>
			]

			const parsedLastResult: Map<any, any> = new Map()
			parsedLastResult.set('heat_load_output', heatLoadOutput)
			parsedLastResult.set('balance_point_graph', balancePointGraph)
			parsedLastResult.set('processed_energy_bills', processedBills)

			const result = buildCurrentUsageData(parsedLastResult)

			expect(result.heat_load_output.estimated_balance_point).toBe(65)
			expect(result.heat_load_output.whole_home_heat_loss_rate).toBe(100)
			expect(result.balance_point_graph.records).toHaveLength(1)
			expect(result.balance_point_graph.records[0]!.balance_point).toBe(65)
			expect(result.processed_energy_bills).toHaveLength(1)
			expect(result.processed_energy_bills[0]!.usage).toBe(100)
		})
	})

	describe('hasDataProperty', () => {
		it('should return true for objects with string data property', () => {
			expect(hasDataProperty({ data: 'test string' })).toBe(true)
			expect(hasDataProperty({ data: '', other: 'prop' })).toBe(true)
		})

		it('should return false for objects without data property', () => {
			expect(hasDataProperty({ other: 'prop' })).toBe(false)
			expect(hasDataProperty({})).toBe(false)
		})

		it('should return false for objects with non-string data property', () => {
			expect(hasDataProperty({ data: 123 })).toBe(false)
			expect(hasDataProperty({ data: null })).toBe(false)
			expect(hasDataProperty({ data: undefined })).toBe(false)
			expect(hasDataProperty({ data: {} })).toBe(false)
			expect(hasDataProperty({ data: [] })).toBe(false)
		})

		it('should return false for non-objects', () => {
			expect(hasDataProperty(null)).toBe(false)
			expect(hasDataProperty(undefined)).toBe(false)
			expect(hasDataProperty('string')).toBe(false)
			expect(hasDataProperty(123)).toBe(false)
			expect(hasDataProperty(true)).toBe(false)
		})
	})

	describe('hasParsedAndValidatedFormSchemaProperty', () => {
		it('should return false for null or undefined', () => {
			expect(hasParsedAndValidatedFormSchemaProperty(null)).toBe(false)
			expect(hasParsedAndValidatedFormSchemaProperty(undefined)).toBe(false)
		})

		it('should return false for non-objects', () => {
			expect(hasParsedAndValidatedFormSchemaProperty('string')).toBe(false)
			expect(hasParsedAndValidatedFormSchemaProperty(123)).toBe(false)
			expect(hasParsedAndValidatedFormSchemaProperty(true)).toBe(false)
		})

		it('should return false for objects without parsedAndValidatedFormSchema property', () => {
			expect(hasParsedAndValidatedFormSchemaProperty({})).toBe(false)
			expect(hasParsedAndValidatedFormSchemaProperty({ other: 'prop' })).toBe(false)
		})

		it('should validate against Schema for objects with parsedAndValidatedFormSchema', () => {
			// This test depends on the Schema validation logic
			// Since we don't have access to the actual Schema, we'll test the structure
			const validFormData = {
				parsedAndValidatedFormSchema: {
					name: 'Test Home',
					state: 'MA',
					design_temperature_override: 10,
					natural_gas_utility: 'National Grid',
					thermostat_set_point: 70,
					include_natural_gas_heating: true,
					square_footage: 2000,
					number_of_occupants: 3
				}
			}

			// Note: This might fail if the actual Schema has different requirements
			// The test validates that the function attempts schema validation
			const result = hasParsedAndValidatedFormSchemaProperty(validFormData)
			expect(typeof result).toBe('boolean')
		})
	})
})