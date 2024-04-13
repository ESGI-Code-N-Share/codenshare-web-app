import {AuthenticationApiInterface} from "@/api/auth/authentication.api.interface";
import {User} from "@/domain/models/user.model.ts";

export class AuthenticationApi implements AuthenticationApiInterface {
    async login(token: string): Promise<void> {
            const url = `${import.meta.env.VITE_API_URL}/auth/login`;

            await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "Accept": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Authorization": `Bearer ${token}`
                }
            }).then(async (response) => {

                if (!response.ok) {
                    const body = await response.json() as { message: string };
                    throw new Error(body.message)
                }

            }).catch((error) => {
                throw new Error(error.message)
            })
    }

    async signUp(user: User): Promise<string> {
        const url = `${import.meta.env.VITE_API_URL}/auth/sign-up`;

        try {
            const  response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Accept": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify(user)
            })

            if (!response.ok) {
                const body = await response.json() as { message: string };
                throw new Error(body.message)

            } else {
                const body = await response.json() as { link: string };
                return body.link;
            }

        } catch (error) {
            throw new Error(error.message)
        }
    }

    async resetPassword(email: string): Promise<string> {
        const url = `${import.meta.env.VITE_API_URL}/auth/reset-password`;

        try {
            const  response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Accept": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: {email: email}
            })

            if (!response.ok) {
                const body = await response.json() as { message: string };
                throw new Error(body.message)

            } else {
                const body = await response.json() as { link: string };
                return body.link;
            }

        } catch (error) {
            throw new Error(error.message)
        }
    }
}