type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export class Api {
    readonly baseUrl: string;
    protected options: RequestInit;

    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers as object ?? {})
            }
        };
    }

    protected buildUrl(uri: string) {
        // Защищаемся от кейсов вроде `${baseUrl}/api//product` из-за лишних слешей
        const base = this.baseUrl.replace(/\/+$/, '');
        const path = uri.startsWith('/') ? uri : `/${uri}`;
        return base + path;
    }

    protected async handleResponse<T>(response: Response): Promise<T> {
        const contentType = response.headers.get('content-type') ?? '';
        const isJson = contentType.includes('application/json') || contentType.includes('+json');

        if (response.ok) {
            if (isJson) return response.json() as Promise<T>;
            const text = await response.text();
            throw new Error(text || response.statusText);
        }

        if (isJson) {
            // Иногда сервер может прислать JSON-ошибку, но не по ожидаемой схеме
            const data = await response.json().catch(() => null);
            const message =
                (data && typeof data === 'object' && 'error' in data && (data as { error?: unknown }).error) ||
                response.statusText;
            return Promise.reject(message);
        }

        const text = await response.text();
        return Promise.reject(text || response.statusText);
    }

    get<T extends object>(uri: string) {
        return fetch(this.buildUrl(uri), {
            ...this.options,
            method: 'GET'
        }).then(this.handleResponse<T>);
    }

    post<T extends object>(uri: string, data: object, method: ApiPostMethods = 'POST') {
        return fetch(this.buildUrl(uri), {
            ...this.options,
            method,
            body: JSON.stringify(data)
        }).then(this.handleResponse<T>);
    }
}
