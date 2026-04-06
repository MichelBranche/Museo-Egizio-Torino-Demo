/**
 * Testi e dati ispirati alle informazioni pubblicate su museoegizio.it
 * (orari, contatti, missione — verificare sempre sul sito ufficiale prima della produzione).
 */

export const MUSEO_CONTATTI = {
  indirizzo: 'Via Accademia delle Scienze 6, 10123 Torino',
  telefono: '+39 011 561 7776',
  email: 'info@museoegizio.it',
  biglietteriaTel: '011 440 69 03',
};

/** Mappa embed (Google) + link per aprire l’app / il browser */
export const MUSEO_MAP = {
  embedSrc:
    'https://www.google.com/maps?q=Museo+Egizio+Via+Accademia+delle+Scienze+6+10123+Torino+Italia&output=embed',
  openInMaps:
    'https://www.google.com/maps/search/?api=1&query=Museo+Egizio+Via+Accademia+delle+Scienze+6,+10123+Torino',
};

/** Fonte: pagina orari ufficiale (indicativi — possono variare). */
export const ORARI_VISITA = [
  { giorno: 'Lunedì', fascia: '9:00 — 14:00' },
  { giorno: 'Martedì — Venerdì', fascia: '9:00 — 18:30' },
  { giorno: 'Sabato', fascia: '9:00 — 20:00' },
  { giorno: 'Domenica', fascia: '9:00 — 18:30' },
];

export const NOTIZIE_DEMO = [
  {
    id: '1',
    categoria: 'Mostre',
    titolo: 'Architetture della luce: percorsi sensoriali',
    estratto:
      'Un allestimento che accompagna il visitatore tra spazi scenici e reperti, tra luce naturale e proiezioni.',
    data: 'Marzo 2026',
    immagine: '/news_exhibit.png',
  },
  {
    id: '2',
    categoria: 'Ricerca',
    titolo: 'Il restauro del papiro di Iuefankh',
    estratto:
      'Il team di conservazione documenta ogni fase del trattamento su uno dei rotoli più significativi della collezione.',
    data: 'Febbraio 2026',
    immagine: '/news_papyrus.png',
  },
  {
    id: '3',
    categoria: 'Digital',
    titolo: 'Collezioni online: nuovi modelli 3D',
    estratto:
      'Pubblicazione progressiva di modelli ad alta definizione consultabili da collezioni.museoegizio.it.',
    data: 'Gennaio 2026',
    immagine: '/nuova-ala.webp',
  },
];
