import {ToastServiceMethods} from "primevue/toastservice";


export class ToastService {
    private toast: ToastServiceMethods;
    private readonly timeout: number;

    constructor(instance: ToastServiceMethods, timeout = 3000) {
        this.toast = instance;
        this.timeout = timeout;
    }

    public showSuccess(message: string, title: string = 'Succès') {
        this.toast.add({severity: 'success', summary: title, detail: message, life: this.timeout});
    }

    public showError(message: string, title: string = 'Erreur') {
        this.toast.add({severity: 'error', summary: title, detail: message, life: this.timeout});
    }

    public showInfo(message: string, title: string = 'Info') {
        this.toast.add({severity: 'info', summary: title, detail: message, life: this.timeout});
    }

    public showWarn(message: string, title: string = 'Attention') {
        this.toast.add({severity: 'warn', summary: title, detail: message, life: this.timeout});
    }
}