export * from './codenshare-auth.api';
export * from './codenshare-user.api';
export * from './codenshare-conversation.api';
export * from './codenshare-message.api';
export * from './codenshare-program.api';
export * from './codenshare-post.api';
export * from './codenshare-friend.api';
export * from './codenshare-message.api';


export interface Request {
    method: string;
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
        throw new Error('Request failed');
    }
    const responseData = await response.json();
    console.log(responseData)
    return responseData.data as T;
}