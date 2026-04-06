import { createContext } from 'react';

/** Contesto i18n (istanza separata da `LanguageContext.jsx` per evitare collisioni su FS case-insensitive). */
export const LanguageContext = createContext(null);
