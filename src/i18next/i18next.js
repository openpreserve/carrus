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
      mainPage: 'Main Page',
      defaultTool: 'Default Tool',
      Loading: 'Loading...',
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
      mainPage: "Page D'accueil",
      defaultTool: 'Outil par défaut',
      Loading: 'Chargement...',
    },
  },
  ru: {
    translation: {
      Action: 'Действие',
      Tool: 'Инструмент',
      YourFile: 'Ваш файл',
      FromUrl: 'url ссылка',
      Validate: 'Проверить',
      Characterize: 'Характеризовать',
      Options: 'Опции',
      Execute: 'Запустить',
      OutputFolder: 'Папка вывода',
      DropzoneTitle: 'Нажмите или скиньте файлы сюда',
      DropzoneSubtitle: 'Поддерживает файл или сборник файлов',
      Tools: 'Инструменты',
      About: 'О нас',
      mainPage: 'Главная Страница',
      defaultTool: 'Инструмент по умолчанию',
      Loading: 'Загрузка...',
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
