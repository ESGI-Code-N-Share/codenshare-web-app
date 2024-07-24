import {useUserStore} from '@/stores/user.store';

export * from './codenshare-auth.api';
export * from './codenshare-user.api';
export * from './codenshare-conversation.api';
export * from './codenshare-message.api';
export * from './codenshare-program.api';
export * from './codenshare-post.api';
export * from './codenshare-friend.api';
export * from './codenshare-message.api';


export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
export interface Request {
    method: RequestMethod;
    url: string;
    body?: any;
}

export const request = async <T>({method, url, body}: Request) => {
    const baseUrl = `${import.meta.env.VITE_API_URL}/api/v1`;

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Cache-Control', 'no-cache');
    if (localStorage.getItem('token') !== null) {
        headers.append('Authorization', `Bearer ${localStorage.getItem('token')}`);
    }
    const response = await fetch(`${baseUrl}${url}`, {
        method,
        headers: headers,
        body: JSON.stringify(body),
    });
    if (!response.ok) {
        const responseData = await response.json();
        if (response.status === 410) {
            const userStore = useUserStore();
            await userStore.logout();
            window.location.href = '/login';
        }
        throw new Error(responseData?.data?.message || responseData.message);
    }
    const responseData = await response.json();
    console.log(url, '=>', responseData)
    return responseData.data as T;
}