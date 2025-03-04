import { createMemoryUploadHandler } from '@remix-run/server-runtime/dist/upload/memoryUploadHandler.js'

export const uploadHandler = createMemoryUploadHandler({
    maxPartSize: 1024 * 1024 * 5, // 5 MB
})

async function handleFile(file: File) {
    try {
        const fileContent = await file.text()
        return fileContent
    } catch (error) {
        console.error('Error reading file:', error)
        return ''
    }
}
export async function fileUploadHandler(formData: any) {
    const file = formData.get('energy_use_upload') as File // fix as File?

    // TODO: think about the edge cases and handle the bad user input here:
    const uploadedTextFile: string = file !== null ? await handleFile(file) : ''

    return uploadedTextFile
}