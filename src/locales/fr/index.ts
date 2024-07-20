import {conversation} from "./conversation.locale";
import {setting} from "./setting.locale";
import {post} from "./post.locale";
import {program} from "./program.locale";
import {profile} from "./profile.locale";

const global = {
    loading: "Chargement...",
    reset: "Réinitialiser",
    sort: 'Trier',
    filter: 'Filtrer',
    forms: {
        language: {
            label: "Langue",
            placeholder: "Choisissez une langue",
        },
    },
    today: "Aujourd'hui",
    yes: "Oui",
    no: "Non",
    pages: {
        home: "Fil d'actualité",
        me: "Mon profil",
        profile: "Profil",
        programs: "Programmes",
        editor: "Édition",
        conversations: "Conversations",
        help: "Aide",
        settings: "Paramètres",
        playground: "Plaground",
        not_found: "Page non trouvée",
        not_found_description: "La page que vous cherchez n'existe pas.",
        go_home: "Retourner à l'accueil",
    },
    menubar: {
        search: "Recherche",
        home: "Accueil",
        profile: "Mon profil",
        programs: "Programmes",
        messages: "Messages",
        help: "Aide",
        settings: "Paramètres",
        playground: "Plaground",
    },
    drop_a_file: {
        label: 'image',
        placeholder: 'Déposez un fichier ici',
    },
    all_results: "Tous les résultats",
    no_results: "Aucun résultat",
}

export const fr = {
    global,
    post,
    profile,
    program,
    conversation,
    setting,
}