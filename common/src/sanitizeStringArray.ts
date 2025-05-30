import sanitizeHtml from 'sanitize-html'


export function sanitizeStringArray(input: unknown): boolean {
  const clean = (str: string) => {
    const trimmed = str.trim()
    return sanitizeHtml(trimmed, {
      allowedTags: [],
      allowedAttributes: {},
      allowedSchemes: [],
    })
  }

  try {
    if (typeof input === 'string') {
      clean(input)
      return true
    }

    if (Array.isArray(input) && input.every(item => typeof item === 'string')) {
      input.forEach(item => clean(item))
      return true
    }

    return false
  } catch (error) {
    return false
  }
}
