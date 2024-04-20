import {User} from "@/domain/models/user.model";
import {ApiInterface} from "@/api/codenhare.api.interface";
import {ValidatorHandleError} from "@/api/validator.handleError";
import {apiHandleError} from "@/api/api.handleError";

export class CodenShareApi implements ApiInterface {
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
                await apiHandleError(response);
            }

        }).catch((error: any) => {
            throw new Error(error.message)
        })
    }

    async register(user: User): Promise<void> {
        const url = `${import.meta.env.VITE_API_URL}/auth/register`;

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
                await apiHandleError(response);
            }

        } catch (error: ValidatorHandleError | Error | any) {
            if(error instanceof ValidatorHandleError) {
                throw new ValidatorHandleError({
                    message: error.message,
                    field: 'form/' +error.field
                })

            } else {
                throw new Error(error.message)
            }
        }
    }


    async registerViaOauth(id: string, email: string, lastname: string, firstname: string): Promise<void> {
        const url = `${import.meta.env.VITE_API_URL}/auth/register/oauth`;

        try {
            const  response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Accept": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    id: id,
                    email: email,
                    lastname: lastname,
                    firstname: firstname,
                })
            })

            if (!response.ok) {
                await apiHandleError(response);
            }

        } catch (error: any) {
            if(error instanceof ValidatorHandleError) {
                throw new ValidatorHandleError({
                    message: error.message,
                    field: 'form/' +error.field
                })

            } else {
                throw new Error(error.message)
            }
        }
    }

    async resetPassword(email: string): Promise<void> {
        const url = `${import.meta.env.VITE_API_URL}/auth/reset-password`;

        try {
            const  response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Accept": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({email: email})
            })

            if (!response.ok) {
                await apiHandleError(response);
            }

        } catch (error: any) {
            if(error instanceof ValidatorHandleError) {
                throw new ValidatorHandleError({
                    message: error.message,
                    field: 'form/' +error.field
                })

            } else {
                throw new Error(error.message)
            }
        }
    }
}