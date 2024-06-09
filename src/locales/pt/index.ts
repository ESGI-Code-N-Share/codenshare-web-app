import {conversation} from "./conversation.locale";
import {post} from "./post.locale";
import {program} from "./program.locale";
import {profile} from "./profile.locale";
import {setting} from "./setting.locale";

const global = {
    today: "Hoje",
    yes: "Sim",
    no: "Não",
    forms: {
        language: {
            label: "Língua",
            placeholder: "Escolha uma língua",
        },
    },
    pages: {
        home: "Feed de notícias",
        me: "Meu perfil",
        profile: "Perfil",
        programs: "Programas",
        editor: "Edição",
        conversations: "Conversas",
        help: "Ajuda",
        settings: "Configurações",
        playground: "Playground",
    },
    menubar: {
        search: "Pesquisa",
        home: "Início",
        profile: "Meu perfil",
        programs: "Programas",
        messages: "Mensagens",
        help: "Ajuda",
        settings: "Configurações",
        playground: "Playground",
    },
    drop_a_file: {
        label: 'imagem',
        placeholder: 'Arraste um arquivo aqui',
    },
    all_results: "Todos os resultados",
    no_results: "Nenhum resultado",
}

export const pt = {
    global,
    post,
    profile,
    program,
    conversation,
    setting,
}