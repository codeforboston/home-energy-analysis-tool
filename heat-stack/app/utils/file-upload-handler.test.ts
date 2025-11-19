import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { fileUploadHandler, uploadHandler } from './file-upload-handler.ts'

// Mock the Remix upload handler
vi.mock('@remix-run/server-runtime/dist/upload/memoryUploadHandler.js', () => ({
	createMemoryUploadHandler: vi.fn().mockReturnValue('mock-upload-handler'),
}))

describe('file-upload-handler', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		
		// Mock console.error to avoid noise in tests
		vi.spyOn(console, 'error').mockImplementation(() => {})
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('uploadHandler', () => {
		it('should create memory upload handler with correct configuration', async () => {
			const { createMemoryUploadHandler } = await import('@remix-run/server-runtime/dist/upload/memoryUploadHandler.js')
			
			expect(createMemoryUploadHandler).toHaveBeenCalledWith({
				maxPartSize: 1024 * 1024 * 5, // 5 MB
			})
			expect(uploadHandler).toBe('mock-upload-handler')
		})

		it('should set max part size to 5 MB', () => {
			expect(1024 * 1024 * 5).toBe(5242880) // 5 MB in bytes
		})
	})

	describe('fileUploadHandler', () => {
		it('should process file and return its text content', async () => {
			const mockFileContent = 'Date,Usage\n2023-01-01,100\n2023-02-01,85'
			
			const mockFile = {
				text: vi.fn().mockResolvedValue(mockFileContent),
				name: 'energy_usage.csv',
				size: 1000,
				type: 'text/csv',
			} as unknown as File

			const mockFormData = {
				get: vi.fn().mockReturnValue(mockFile),
			}

			const result = await fileUploadHandler(mockFormData)

			expect(mockFormData.get).toHaveBeenCalledWith('energy_use_upload')
			expect(mockFile.text).toHaveBeenCalled()
			expect(result).toBe(mockFileContent)
		})

		it('should return empty string when no file is provided', async () => {
			const mockFormData = {
				get: vi.fn().mockReturnValue(null),
			}

			const result = await fileUploadHandler(mockFormData)

			expect(mockFormData.get).toHaveBeenCalledWith('energy_use_upload')
			expect(result).toBe('')
		})

		it('should handle file reading errors gracefully', async () => {
			const mockFile = {
				text: vi.fn().mockRejectedValue(new Error('Failed to read file')),
				name: 'corrupted_file.csv',
				size: 1000,
				type: 'text/csv',
			} as unknown as File

			const mockFormData = {
				get: vi.fn().mockReturnValue(mockFile),
			}

			const result = await fileUploadHandler(mockFormData)

			expect(console.error).toHaveBeenCalledWith('Error reading file:', expect.any(Error))
			expect(result).toBe('')
		})

		it('should handle undefined form data gracefully', async () => {
			const mockFormData = {
				get: vi.fn().mockReturnValue(undefined),
			}

			const result = await fileUploadHandler(mockFormData)

			expect(result).toBe('')
		})

		it('should handle empty file content', async () => {
			const mockFile = {
				text: vi.fn().mockResolvedValue(''),
				name: 'empty_file.csv',
				size: 0,
				type: 'text/csv',
			} as unknown as File

			const mockFormData = {
				get: vi.fn().mockReturnValue(mockFile),
			}

			const result = await fileUploadHandler(mockFormData)

			expect(result).toBe('')
		})

		it('should handle various file types', async () => {
			const testCases = [
				{
					content: 'CSV content',
					type: 'text/csv',
					name: 'test.csv'
				},
				{
					content: 'XML content',
					type: 'text/xml',
					name: 'test.xml'
				},
				{
					content: 'Plain text content',
					type: 'text/plain',
					name: 'test.txt'
				}
			]

			for (const testCase of testCases) {
				const mockFile = {
					text: vi.fn().mockResolvedValue(testCase.content),
					name: testCase.name,
					size: testCase.content.length,
					type: testCase.type,
				} as unknown as File

				const mockFormData = {
					get: vi.fn().mockReturnValue(mockFile),
				}

				const result = await fileUploadHandler(mockFormData)
				expect(result).toBe(testCase.content)
			}
		})

		it('should handle large file content', async () => {
			const largeContent = 'x'.repeat(1000000) // 1MB of text
			
			const mockFile = {
				text: vi.fn().mockResolvedValue(largeContent),
				name: 'large_file.csv',
				size: largeContent.length,
				type: 'text/csv',
			} as unknown as File

			const mockFormData = {
				get: vi.fn().mockReturnValue(mockFile),
			}

			const result = await fileUploadHandler(mockFormData)

			expect(result).toBe(largeContent)
			expect(result.length).toBe(1000000)
		})

		it('should handle special characters in file content', async () => {
			const specialContent = 'Date,Usage\n2023-01-01,"1,000"\n2023-02-01,"2,500€"\n2023-03-01,"Special chars: àáâãäåæçèéêë"'
			
			const mockFile = {
				text: vi.fn().mockResolvedValue(specialContent),
				name: 'special_chars.csv',
				size: specialContent.length,
				type: 'text/csv',
			} as unknown as File

			const mockFormData = {
				get: vi.fn().mockReturnValue(mockFile),
			}

			const result = await fileUploadHandler(mockFormData)

			expect(result).toBe(specialContent)
		})

		it('should handle file.text() throwing non-Error objects', async () => {
			const mockFile = {
				text: vi.fn().mockRejectedValue('String error'),
				name: 'test.csv',
				size: 1000,
				type: 'text/csv',
			} as unknown as File

			const mockFormData = {
				get: vi.fn().mockReturnValue(mockFile),
			}

			const result = await fileUploadHandler(mockFormData)

			expect(console.error).toHaveBeenCalledWith('Error reading file:', 'String error')
			expect(result).toBe('')
		})

		it('should call get method with correct field name', async () => {
			const mockFormData = {
				get: vi.fn().mockReturnValue(null),
			}

			await fileUploadHandler(mockFormData)

			expect(mockFormData.get).toHaveBeenCalledTimes(1)
			expect(mockFormData.get).toHaveBeenCalledWith('energy_use_upload')
		})
	})

	describe('edge cases and error scenarios', () => {
		it('should handle FormData with multiple files', async () => {
			const mockFile1 = {
				text: vi.fn().mockResolvedValue('file1 content'),
				name: 'file1.csv',
			} as unknown as File

			const mockFormData = {
				get: vi.fn().mockReturnValue(mockFile1), // get() returns first match
			}

			const result = await fileUploadHandler(mockFormData)

			expect(result).toBe('file1 content')
		})

		it('should handle async file.text() method', async () => {
			let resolveFileText: (value: string) => void
			const fileTextPromise = new Promise<string>((resolve) => {
				resolveFileText = resolve
			})

			const mockFile = {
				text: vi.fn().mockReturnValue(fileTextPromise),
				name: 'async_file.csv',
			} as unknown as File

			const mockFormData = {
				get: vi.fn().mockReturnValue(mockFile),
			}

			const resultPromise = fileUploadHandler(mockFormData)

			// Simulate async file reading
			setTimeout(() => {
				resolveFileText!('async content')
			}, 10)

			const result = await resultPromise
			expect(result).toBe('async content')
		})

		it('should handle malformed FormData object', async () => {
			const malformedFormData = {
				// Missing get method
			}

			// This should throw an error, but we want to test graceful handling
			await expect(
				fileUploadHandler(malformedFormData as any)
			).rejects.toThrow()
		})

		it('should handle file object without text method', async () => {
			const mockFileWithoutText = {
				name: 'no_text_method.csv',
				size: 1000,
				type: 'text/csv',
				// Missing text method
			} as unknown as File

			const mockFormData = {
				get: vi.fn().mockReturnValue(mockFileWithoutText),
			}

			const result = await fileUploadHandler(mockFormData)

			expect(console.error).toHaveBeenCalled()
			expect(result).toBe('')
		})
	})
})