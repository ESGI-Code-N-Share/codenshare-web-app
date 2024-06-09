import {Program, ProgramsRequest, User} from "@/models";
import {MenuItem, MenuItemCommandEvent} from "primevue/menuitem";
import {i18n} from "@/main";

export const programDeleteOption = (command: (event: MenuItemCommandEvent) => void): MenuItem => {
    const {t} = i18n.global;
    return {
        label: t('program.buttons.delete'),
        icon: 'pi pi-trash',
        command
    };
}

export const programImportOption = (command: (event: MenuItemCommandEvent) => void): MenuItem => {
    const {t} = i18n.global;
    return {
        label: t('program.buttons.import'),
        icon: 'pi pi-upload',
        command
    };
}

export const programEditOption = (command: (event: MenuItemCommandEvent) => void): MenuItem => {
    const {t} = i18n.global;
    return {
        label: t('program.buttons.edit'),
        icon: 'pi pi-pencil',
        command
    };
}

export const programShareOption = (command: (event: MenuItemCommandEvent) => void): MenuItem => {
    const {t} = i18n.global;
    return {
        label: t('program.buttons.share'),
        icon: 'pi pi-share-alt',
        command
    };
}

export const programUseOption = (command: (event: MenuItemCommandEvent) => void): MenuItem => {
    const {t} = i18n.global;
    return {
        label: t('program.buttons.use'),
        icon: 'pi pi-play',
        command
    };
}

export const getProgramOptions = (program: Program | ProgramsRequest, user: User, commands: {
    [key: string]: (event: MenuItemCommandEvent) => void
}): MenuItem[] => {
    const {deleteCommand, importCommand, editCommand, shareCommand, useCommand} = commands;

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
            programEditOption(editCommand),
            programDeleteOption(deleteCommand)
        ];
    }
    return [
        programUseOption(useCommand),
        programShareOption(shareCommand),
        programImportOption(importCommand)
    ];
};