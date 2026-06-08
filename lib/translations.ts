import { en } from './translations/en';
import { bo } from './translations/bo';

export const translations = {
  en,
  bo
};

export type Language = keyof typeof translations;
export type TranslationKeys = typeof en;
export type TranslationValues = typeof en | typeof bo;
export type TranslationKey = keyof TranslationKeys;
