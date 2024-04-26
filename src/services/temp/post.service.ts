export type Post = {
    id: number;
    user: {
        firstname: string;
        lastname: string;
        avatarUrl: string;
    }
    title: string;
    content: string;
    codeBlock?: string;
    image?: string;
    programId?: string;
    postedAt: string;
}

export const getPosts = (): Post[] => {
    return [
        {
            id: 1,
            user: {
                firstname: 'Corentin',
                lastname: 'Lechêne',
                avatarUrl: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 25) + 1}.jpg`
            },
            title: 'Post with image',
            content: 'This is a post with an image',
            image: 'https://primefaces.org/cdn/primevue/images/galleria/galleria10.jpg',
            postedAt: '2 Jan. 2023',
        },
        {
            id: 2,
            user: {
                firstname: 'Corentin',
                lastname: 'Lechêne',
                avatarUrl: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 25) + 1}.jpg`
            },
            title: 'Simple Post',
            content: 'This is a post with an image',
            postedAt: '2 Jan. 2023',
        },
        {
            id: 3,
            user: {
                firstname: 'Corentin',
                lastname: 'Lechêne',
                avatarUrl: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 25) + 1}.jpg`
            },
            title: 'Long Post with image',
            content: 'This is a post with an image This is a post with an image This is a post with an image This is a post with an image This is a post with an image ',
            image: 'https://primefaces.org/cdn/primevue/images/galleria/galleria10.jpg',
            postedAt: '2 Jan. 2023',
        },
        {
            id: 4,
            user: {
                firstname: 'Corentin',
                lastname: 'Lechêne',
                avatarUrl: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 25) + 1}.jpg`
            },
            title: 'Post with image',
            content: 'This is a post with an image',
            image: 'https://primefaces.org/cdn/primevue/images/galleria/galleria10.jpg',
            postedAt: '2 Jan. 2023',
        },
        {
            id: 5,
            user: {
                firstname: 'Corentin',
                lastname: 'Lechêne',
                avatarUrl: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 25) + 1}.jpg`
            },
            title: 'Long Post',
            content: 'This is a post with an image This is a post with an image This is a post with an image This is a post with an image This is a post with an image ',
            postedAt: '2 Jan. 2023',
        }
    ]
}