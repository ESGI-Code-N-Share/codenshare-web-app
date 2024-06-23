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

    const response = await fetch(`${baseUrl}${url}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(body),
    });
    if (!response.ok) {
        const responseData = await response.json();
        const userStore= useUserStore()
        await userStore.logout();
        window.location.hash = '/login'
        throw new Error(responseData.message);
    }
    const responseData = await response.json();
    console.log(url, '=>', responseData)
    return responseData.data as T;
}