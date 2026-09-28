const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      signal: controller.signal,
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...(options.headers || {}) },
    });
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('The service took too long to respond. Please try again.');
    throw new Error('Unable to connect to the wish service. Please try again.');
  } finally {
    clearTimeout(timeout);
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || 'The service is temporarily unavailable.');
    error.status = response.status;
    throw error;
  }
  return data;
}

export const createWish = (wish) => request('/wishes', { method: 'POST', body: JSON.stringify(wish) });
export const loadWish = (slug) => request(`/wishes/${encodeURIComponent(slug)}`);
