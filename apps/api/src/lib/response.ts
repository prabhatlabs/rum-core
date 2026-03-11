interface ApiResponse<T = null> {
  success: boolean
  message: string
  data: T | null
  error: string | null
}

export function okResponse<T>(data: T, message = 'Success'): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
    error: null,
  }
}

export function failResponse(error: string, message = 'Something went wrong'): ApiResponse<null> {
  return {
    success: false,
    message,
    data: null,
    error,
  }
}