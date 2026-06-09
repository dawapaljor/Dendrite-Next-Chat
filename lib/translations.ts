import { en as baseEn } from './translations/en';

// Dynamically scan the translations directory for translation files at compile-time
const context = (require as any).context('./translations', false, /\.(ts|js|json)$/);

export const translations: Record<string, typeof baseEn> = {};

context.keys().forEach((key: string) => {
  const lang = key.replace(/^\.\/(.*)\.\w+$/, '$1');
  const langModule = context(key);
  translations[lang] = langModule[lang] || langModule.default || langModule;
});

export type Language = string;
export type TranslationKeys = typeof baseEn;
export type TranslationKey = keyof TranslationKeys;
