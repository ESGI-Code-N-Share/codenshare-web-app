import {ValidatorHandleError} from "@/api/validator.handleError";

export async function apiHandleError(response: Response) {
    if(response.status === 422) {
        return await throwValidatorError(response)
    } else {
        return await throwStandardError(response)
    }

}

async function throwValidatorError(response: Response) {
    const body = await response.json() as {errors: string[{message: string, rule: string, field: string}]};
    const error = body.errors[0];
    throw new ValidatorHandleError({
        message: error.message,
        field: error.field
    })
}

async function throwStandardError(response: Response) {
    const body = await response.json() as { message: string };
    console.log(body)
    throw new Error(body.message)
}