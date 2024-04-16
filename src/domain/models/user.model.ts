export class User {
    firstname:string
    lastname:string
    mail: string
    password: string


    constructor(firstname: string, lastname: string, mail: string, password: string) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.mail = mail;
        this.password = password;
    }
}