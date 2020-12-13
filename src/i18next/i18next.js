/* eslint-disable quote-props */
/* eslint-disable quotes */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export default async function useI18next(resources) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: 'en',
      keySeparator: false,
      interpolation: {
        escapeValue: false,
      },
    });
}
