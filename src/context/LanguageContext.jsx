import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { LANG_OPTIONS, MESSAGES, SUPPORTED_LANGS } from '../locales/messages';
import { LanguageContext } from './i18nContext';

const LANG_STORAGE_KEY = 'museo_lang';

function getNested(obj, path) {
  return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    if (typeof window === 'undefined') return 'it';
    const s = localStorage.getItem(LANG_STORAGE_KEY);
    if (s && SUPPORTED_LANGS.includes(s)) return s;
    return 'it';
  });

  useEffect(() => {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    const htmlLang = lang === 'zh' ? 'zh-Hans' : lang;
    document.documentElement.lang = htmlLang;
  }, [lang]);

  const setLang = useCallback((code) => {
    if (SUPPORTED_LANGS.includes(code)) setLangState(code);
  }, []);

  const t = useMemo(() => {
    return (key) => {
      const v = getNested(MESSAGES[lang], key) ?? getNested(MESSAGES.it, key) ?? key;
      return v;
    };
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t,
      langOptions: LANG_OPTIONS,
    }),
    [lang, setLang, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
