const form = {
    /* fields - User */
    firstname: {
        label: 'Prénom',
        required: `Le @:form.firstname.label est requis.`,
        invalid: `Le @:form.firstname.label n'est pas au bon format.`,
        min: `Le @:form.firstname.label doit contenir au moins 3 caractères.`,
        max: `Le @:form.firstname.label doit contenir au maximum 50 caractères.`,
    },
    lastname: {
        label: 'Nom',
        required: `Le @:form.lastname.label est requis.`,
        invalid: `Le @:form.lastname.label n'est pas au bon format.`,
        min: `Le @:form.lastname.label doit contenir au moins 3 caractères.`,
        max: `Le @:form.lastname.label doit contenir au maximum 50 caractères.`,
    },
    email: {
        label: 'email',
        required: `L'@:form.email.label est requis.`,
        invalid: `L'@:form.email.label n'est pas au bon format.`,
    },
    birthdate: {
        label: 'Date de naissance',
        max: `La @:form.birthdate.label doit être inférieur à la date actuelle.`,
    },
    password: {
        label: 'Mot de passe',
        required: `Le @:form.password.label est requis.`,
        invalid: `Le @:form.password.label n'est pas au bon format.`,
        min: `Le @:form.password.label doit contenir au moins 6 caractères.`,
        max: `Le @:form.password.label doit contenir au maximum 20 caractères.`,
    },
    cgu: {
        label: 'CGU',
        required: `Le champ @:form.cgu.label est requis.`,
    },


    /* fields - Post */


    /* fields - Program */
    program_name: {
        label: 'Nom',
        required: `Le @:form.name.label est requis.`,
        invalid: `Le @:form.name.label n'est pas au bon format.`,
        min: `Le @:form.name.label doit contenir au moins 3 caractères.`,
        max: `Le @:form.name.label doit contenir au maximum 50 caractères.`,
    },
    program_description: {
        label: 'Description',
        required: `La @:form.description.label est requise.`,
        invalid: `La @:form.description.label n'est pas au bon format.`,
        min: `La @:form.description.label doit contenir au moins 3 caractères.`,
        max: `La @:form.description.label doit contenir au maximum 200 caractères.`,
    },
    program_language: {
        label: 'Langage',
        required: `Le @:form.language.label est requis.`,
        invalid: `Le @:form.language.label n'est pas au bon format.`,
        max: `Le @:form.language.label doit contenir au maximum 50 caractères.`,
    },


    /* generic */
    errors: {
        invalid: 'Les champs ne sont pas valides.',
        required: 'Les champs sont requis.',
        count: 'Le formulaire contient {count} erreurs.'
    }
}

export default form