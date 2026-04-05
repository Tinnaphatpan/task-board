export function useApi() {
  const config = useRuntimeConfig()
  const token = useCookie<string | null>('auth_token')

  async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }
    if (token.value) {
      headers['Authorization'] = `Bearer ${token.value}`
    }
    const res = await fetch(`${config.public.apiBase}${path}`, {
      ...options,
      headers,
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || data.error || 'เกิดข้อผิดพลาด')
    return data as T
  }

  function get<T>(path: string) {
    return request<T>(path, { method: 'GET' })
  }

  function post<T>(path: string, body: unknown) {
    return request<T>(path, { method: 'POST', body: JSON.stringify(body) })
  }

  function put<T>(path: string, body: unknown) {
    return request<T>(path, { method: 'PUT', body: JSON.stringify(body) })
  }

  function del<T>(path: string) {
    return request<T>(path, { method: 'DELETE' })
  }

  return { get, post, put, del }
}
