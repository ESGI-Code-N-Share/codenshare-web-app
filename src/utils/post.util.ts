import {Post, User} from "@/models";
import {MenuItem, MenuItemCommandEvent} from "primevue/menuitem";


export const postDelete = (command: (event: MenuItemCommandEvent) => void): MenuItem => ({
    label: 'Delete',
    icon: 'pi pi-trash',
    command
});

export const postImportProgram = (command: (event: MenuItemCommandEvent) => void): MenuItem => ({
    label: 'Import Program',
    icon: 'pi pi-download',
    command
});

export const postShare = (command: (event: MenuItemCommandEvent) => void): MenuItem => ({
    label: 'Share',
    icon: 'pi pi-share-alt',
    command
});

export const getEditPostOptions = (post: Post, user: User, commands: {
    [key: string]: (event: MenuItemCommandEvent) => void
}): MenuItem[] => {
    const {deleteCommand, importProgramCommand, shareCommand} = commands;

    if (user.role === 'admin') {
        return [
            postDelete(deleteCommand),
            postImportProgram(importProgramCommand),
            postShare(shareCommand)
        ];
    } else if (user.role === 'user' && user.userId === post.author.userId) {
        return [
            postShare(shareCommand),
            postDelete(deleteCommand)
        ];
    }
    return [
        postImportProgram(importProgramCommand),
        postShare(shareCommand)
    ];
};