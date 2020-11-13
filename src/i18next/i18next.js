/* eslint-disable quote-props */
/* eslint-disable quotes */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      Action: 'Action',
      Tool: 'Tool',
      YourFile: 'Your File',
      FromUrl: 'From Url',
      Validate: 'Validate',
      Characterize: 'Characterize',
      Options: 'Options',
      Execute: 'Execute',
      OutputFolder: 'Output Folder',
      DropzoneTitle: 'Click to select or drop here',
      DropzoneSubtitle: 'Support for a single file or folder',
      Tools: 'Tools',
      About: 'About',
    },
  },
  fr: {
    translation: {
      Action: 'Action',
      Tool: 'Outil',
      YourFile: 'Votre dossier',
      FromUrl: "De l'URL",
      Validate: 'Valider',
      Characterize: 'Caractériser',
      Options: 'Options',
      Execute: 'Exécuter',
      OutputFolder: 'Dossier de sortie',
      DropzoneTitle: 'Cliquez pour sélectionner ou déposer ici',
      DropzoneSubtitle: "Prise en charge d'un seul fichier ou dossier",
      Tools: 'Outils',
      About: 'À propos',
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
