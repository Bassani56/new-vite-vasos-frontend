const API_URL = import.meta.env.VITE_API_URL || "https://new-vite-vasos-backend.vercel.app"

export function apiUrl(path) {
    return `${API_URL.replace(/\/$/, "")}${path}`
}
