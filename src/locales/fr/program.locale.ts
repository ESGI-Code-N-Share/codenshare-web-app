export const program = {
    programs: "Programmes",
    configure: "Configuration",
    pipeline: "Configuration des pipelines",
    test: "Test",
    code_history: "Historique du code",
    no_code_history: "Aucun historique du code",
    inputs_file: {
        uploaded: "Fichier uploadé",
    },
    output_files: {
        title: "Fichiers de sortie",
        empty: "Aucun fichier de sortie",
        download: "Télécharger le fichier",
        error_image: "Image invalide !",
        error_file: "Fichier invalide !",
    },
    forms: {
        search: {
            label: "Rechercher",
            placeholder: "Rechercher un programme",
        },
        name: {
            label: "Nom",
            placeholder: "Nom du programme",
        },
        description: {
            label: "Description",
            placeholder: "Description du programme",
        },
        image: {
            label: "Image",
            placeholder: "Choisissez une image",
        },
        version: {
            label: "Version",
            placeholder: "Version du programme",
        },
        language: {
            label: "Langue",
            placeholder: "Choisissez le langage",
        },
        visibility: {
            label: "Visibilité",
            placeholder: "Choisissez la visibilité",
        },
        nextProgram: {
            label: "Programme suivant",
            placeholder: "Ajouter un autre programme",
        },
        filename: {
            label: "Nom du fichier",
            placeholder: "Nom du fichier",
            limit: "Doit être inférieur à 15 lettres",
        },
        type: {
            label: "Type",
            placeholder: "Choisissez le type",
        },
    },
    visibilities: {
        private: "Privé",
        public: "En ligne",
        protected: "En ligne (Protégé)",
    },
    tests: {
        step1: {
            title: "Programmes",
            available: "Disponibles",
            selected: "Sélectionnés",
            instruction: "Combinez jusqu'à 3 programmes."
        },
        step2: {
            title: "Pipelines",
            instruction: "Reliez les programmes entre eux."
        },
        step3: {
            title: "Test",
            running: 'Durée: {duration}{unit}',
            error_pipeline: "Une erreur est survenue.",
            waiting: 'En attente de lancement...',
            success_finished: "Terminé.",
        },
    },
    buttons: {
        new: "Nouveau",
        save: "Enregistrer",
        reload: "Recharger",
        use: "Utiliser",
        share: "Partager",
        delete: "Supprimer",
        import: "Importer",
        edit: "Modifier",
        pipeline: "Pipeline",
        test: "Tester",
        execute: "Exécuter",
        download: "Télécharger",
        console: "Console",
        add_in_port: 'Port entrée',
        add_out_port: 'Port sortie',
        download_image: "Télécharger l'image",
    },
    languages: {
        java: 'Java',
        javascript: 'Javascript',
        rust: 'Rust',
        ruby: 'Ruby',
        python: 'Python',
        unset: 'Non défini',
    },
    errors: {
        not_enough_ports: "Pas assez de port. Attendu: {inputs} entrée(s) et {outputs} sortie(s).",
    },
    no_programs: "Vous n'avez pas encore de programme.",
}