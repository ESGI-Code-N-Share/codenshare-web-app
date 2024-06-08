import {Program, ProgramsRequest, User} from "@/models";
import {MenuItem, MenuItemCommandEvent} from "primevue/menuitem";

export const programDeleteOption = (command: (event: MenuItemCommandEvent) => void): MenuItem => ({
    label: 'Supprimer',
    icon: 'pi pi-trash',
    command
});

export const programImportOption = (command: (event: MenuItemCommandEvent) => void): MenuItem => ({
    label: 'Importer',
    icon: 'pi pi-download',
    command
});

export const programEditOption = (command: (event: MenuItemCommandEvent) => void): MenuItem => ({
    label: 'Modifier',
    icon: 'pi pi-pencil',
    command
});

export const programShareOption = (command: (event: MenuItemCommandEvent) => void): MenuItem => ({
    label: 'Partager',
    icon: 'pi pi-share-alt',
    command
});

export const programUseOption = (command: (event: MenuItemCommandEvent) => void): MenuItem => ({
    label: 'Utiliser',
    icon: 'pi pi-play',
    command
});

export const getProgramOptions = (program: Program | ProgramsRequest, user: User, commands: {
    [key: string]: (event: MenuItemCommandEvent) => void
}): MenuItem[] => {
    const {deleteCommand, importCommand, updateCommand, shareCommand, useCommand} = commands;

    if (user.role === 'admin') {
        return [
            programUseOption(useCommand),
            programImportOption(importCommand),
            programShareOption(shareCommand),
            programDeleteOption(deleteCommand)
        ];
    } else if (user.role === 'user' && user.userId === program.authorId) {
        return [
            programUseOption(useCommand),
            programShareOption(shareCommand),
            programEditOption(updateCommand),
            programDeleteOption(deleteCommand)
        ];
    }
    return [
        programUseOption(useCommand),
        programShareOption(shareCommand),
        programImportOption(importCommand)
    ];
};