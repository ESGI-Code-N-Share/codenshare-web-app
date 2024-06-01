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

export const request = async ({method, url, body}: Request) => {
    const baseUrl = 'http://localhost:3000/api/v1';
    const response = await fetch(`${baseUrl}${url}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(body),
    });
    return response.json()
}