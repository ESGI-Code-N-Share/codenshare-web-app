import {Post, User} from "@/models";
import {MenuItem, MenuItemCommandEvent} from "primevue/menuitem";
import {i18n} from "@/main";

export const postDelete = (command: (event: MenuItemCommandEvent) => void): MenuItem => {
    const {t} = i18n.global;
    return {
        label: t('post.buttons.delete'),
        icon: 'pi pi-trash',
        command
    };
};

export const postImportProgram = (command: (event: MenuItemCommandEvent) => void): MenuItem => {
    const {t} = i18n.global;
    return {
        label: t('post.buttons.import_program'),
        icon: 'pi pi-upload',
        command
    };
};

export const postShare = (command: (event: MenuItemCommandEvent) => void): MenuItem => {
    const {t} = i18n.global;
    return {
        label: t('post.buttons.share'),
        icon: 'pi pi-share-alt',
        command
    };
};

export async function getEditPostOptions(post: Post, user: User, commands: {
    [key: string]: (event: MenuItemCommandEvent) => void
}): Promise<MenuItem[]> {
    const {deleteCommand, importProgramCommand, shareCommand} = commands;

    const options = []
    if (user.role === 'admin') {
        options.push(
            postShare(shareCommand),
            postDelete(deleteCommand),
        )
    } else if (user.userId === post.author.userId) {
        options.push(
            postShare(shareCommand),
            postDelete(deleteCommand)
        )
    } else {
        options.push(
            postShare(shareCommand)
        )
    }
    if (post.programId) {
        options.push(
            postImportProgram(importProgramCommand)
        )
    }
    return options;
}