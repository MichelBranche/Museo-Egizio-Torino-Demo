import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * `navigation.type === 'reload'` vale per **tutto il documento** dopo un F5, non solo al momento del reload.
 * Non usarlo dentro la logica intro SPA — solo qui, **una volta** al caricamento del modulo (= nuova pagina).
 */
try {
  if (typeof performance !== 'undefined') {
    const nav = performance.getEntriesByType('navigation')[0];
    if (nav && nav.type === 'reload') {
      sessionStorage.removeItem('museo_home_intro_done');
      sessionStorage.removeItem('museo_home_quick_mount');
      sessionStorage.removeItem('museo_pending_home_quick');
    }
  }
} catch {
  /* ignore */
}

/**
 * Passalo a ogni Link verso Home da altre pagine (insieme a HOME_SPA_TO).
 */
export const HOME_SPA_LINK_STATE = { homeIntroSkip: true };

/** Destinazione Link: stringa così la query non viene persa in RR7. */
export const HOME_SPA_TO = '/?homeQuick=1';

/**
 * Sopravvive al doppio mount in React StrictMode dopo strip URL (altrimenti il 2° mount vede intro full).
 */
const HOME_QUICK_MOUNT_KEY = 'museo_home_quick_mount';

export function markHomeQuickMount() {
  try {
    sessionStorage.setItem(HOME_QUICK_MOUNT_KEY, '1');
  } catch {
    /* ignore */
  }
}

export function peekHomeQuickMount() {
  try {
    return sessionStorage.getItem(HOME_QUICK_MOUNT_KEY) === '1';
  } catch {
    return false;
  }
}

export function clearHomeQuickMount() {
  try {
    sessionStorage.removeItem(HOME_QUICK_MOUNT_KEY);
  } catch {
    /* ignore */
  }
}

const PENDING_QUICK_KEY = 'museo_pending_home_quick';

/** Impostato onClick sui link verso Home (backup se location.state non è ancora disponibile). */
export function markPendingHomeQuick() {
  try {
    sessionStorage.setItem(PENDING_QUICK_KEY, '1');
  } catch {
    /* ignore */
  }
}

export function peekPendingHomeQuick() {
  try {
    return sessionStorage.getItem(PENDING_QUICK_KEY) === '1';
  } catch {
    return false;
  }
}

export function clearPendingHomeQuick() {
  try {
    sessionStorage.removeItem(PENDING_QUICK_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Ultima pathname diversa da "/" — aggiornata anche durante il render (non solo in effect),
 * così non perdi la gara con un click veloce su "← Home".
 */
export const lastNonHomePathRef = { current: null };

export function RouteHistorySync() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    if (pathname !== '/') {
      lastNonHomePathRef.current = pathname;
    }
  }, [pathname]);
  return null;
}
