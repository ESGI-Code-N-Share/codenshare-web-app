import {ValidatorHandleError} from "@/api/validator.handleError";
import {i18n} from "@/main";


const {t} = i18n.global

export class ViewHandleErrorService {
    constructor() {
    }

    async handleError(e: any) {
        if(e instanceof ValidatorHandleError) {
            return await this.getValidatorMessageError(e);
        } else {
            return await this.getDefaultError(e)
        }

    }

    async getValidatorMessageError(e: ValidatorHandleError) {
        const keyError = e.message.replace('/', '.')
        const keyField = e.field.replace('/', '.')
        return t(`${keyError}`, {field: t(`${keyField}`)})
    }

    async getDefaultError(e: Error) {
        const keyError = e.message.replace('/', '.');
        return t(`${keyError}`);
    }
}


