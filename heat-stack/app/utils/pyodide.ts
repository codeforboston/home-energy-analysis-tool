// Utility to safely destroy a PyProxy object
export function safeDestroy(obj: any) {
  if (obj && typeof obj.destroy === 'function') {
    try {
      // Some PyProxy objects have an isDestroyed property
      if ('isDestroyed' in obj && obj.isDestroyed) return
      obj.destroy()
    } catch (e) {
      // Ignore errors if already destroyed or not a PyProxy
    }
  }
}
