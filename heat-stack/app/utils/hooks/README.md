# Fetcher Error Handler Hook

## Overview

The `useFetcherErrorHandler` hook provides a global, reusable pattern for handling errors from React Router actions. This ensures consistent error handling across all forms in the application.

## Why Use This?

When using raw `fetch()` to call React Router actions, the framework returns an HTML document instead of JSON, making error extraction difficult. Using `useFetcher()` from React Router solves this by properly communicating with actions as data requests.

## Features

- ✅ Automatically formats error messages
- ✅ Extracts stack traces up to `/app/` line for cleaner error display
- ✅ Falls back to first 500 characters if no `/app/` line found
- ✅ Works with any React Router fetcher
- ✅ Supports optional success callbacks

## Usage

### Basic Example

```tsx
import { useFetcher } from 'react-router'
import { useFetcherErrorHandler } from '#app/utils/hooks/use-fetcher-error-handler.ts'

function MyForm() {
  const fetcher = useFetcher()
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: '', message: '' })

  // Handle errors globally
  useFetcherErrorHandler(fetcher, (errorMessage) => {
    setErrorModal({
      isOpen: true,
      title: 'Server Error',
      message: errorMessage
    })
  })

  const handleSubmit = () => {
    const formData = new FormData()
    formData.append('intent', 'myAction')
    formData.append('data', 'value')
    
    void fetcher.submit(formData, { method: 'POST' })
  }

  return (
    <>
      <button onClick={handleSubmit}>Submit</button>
      <ErrorModal {...errorModal} onClose={() => setErrorModal(prev => ({ ...prev, isOpen: false }))} />
    </>
  )
}
```

### With Success Callback

```tsx
useFetcherErrorHandler(
  fetcher,
  (errorMessage) => {
    toast.error(errorMessage)
  },
  () => {
    toast.success('Action completed successfully!')
  }
)
```

### With Optimistic Updates

```tsx
const [localData, setLocalData] = useState(loaderData.items)

useFetcherErrorHandler(
  fetcher,
  (errorMessage) => {
    setErrorModal({ isOpen: true, title: 'Error', message: errorMessage })
    // Revert optimistic update on error
    setLocalData(loaderData.items)
  }
)

const handleUpdate = (newValue) => {
  // Optimistic update
  setLocalData(newValue)
  
  const formData = new FormData()
  formData.append('data', JSON.stringify(newValue))
  void fetcher.submit(formData, { method: 'POST' })
}
```

## Server-Side Error Handling

Your action handler should return errors in a consistent format:

```tsx
export async function action({ request }: Route.ActionArgs) {
  try {
    // Your logic here
    return { success: true, data: result }
  } catch (error: any) {
    console.error('Action failed:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    
    return data(
      {
        error: message, // The hook looks for this 'error' field
        // ... other fields
      },
      { status: 500 }
    )
  }
}
```

## Error Message Formatting

The hook automatically formats errors using these rules:

1. **If stack trace contains `/app/`**: Includes all lines up to and including the first line with `/app/`
2. **Otherwise**: Takes the first 500 characters of the error message
3. **Preserves newlines**: Stack traces remain readable

### Example Output

```
ZeroDivisionError: division by zero
  File "/app/utils/rules-engine.ts", line 42, in calculate
```

Instead of the full 2000+ character stack trace.

## Utility Function

You can also use the standalone `formatErrorMessage()` function:

```tsx
import { formatErrorMessage } from '#app/utils/hooks/use-fetcher-error-handler.ts'

const formatted = formatErrorMessage(error)
console.log(formatted)
```

## Migration Guide

### Before (using fetch)

```tsx
const response = await fetch(window.location.pathname, {
  method: 'POST',
  body: formData,
})

if (!response.ok) {
  throw new Error('Request failed')
}

const result = await response.json()
// Handle result...
```

### After (using useFetcher)

```tsx
const fetcher = useFetcher()

useFetcherErrorHandler(fetcher, (errorMessage) => {
  setErrorModal({ isOpen: true, title: 'Error', message: errorMessage })
})

void fetcher.submit(formData, { method: 'POST' })
// React Router handles the rest automatically!
```

## Benefits

- **No HTML parsing**: `useFetcher` receives proper JSON responses
- **Automatic revalidation**: React Router refreshes data automatically
- **Cleaner code**: No try-catch blocks, response parsing, or manual reloads
- **Type safety**: Better TypeScript support with React Router types
- **Global pattern**: Use the same approach across all forms
