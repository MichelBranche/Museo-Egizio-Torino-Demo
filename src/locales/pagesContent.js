import { shopPagesFor } from './content/shopLocales';
import { sitePagesFor } from './content/siteLocales';

/** Oggetto annidato sotto `pages` in MESSAGES — usare t('pages.shop.buy'), ecc. */
export function pagesFor(lang) {
  const { shop } = shopPagesFor(lang);
  const site = sitePagesFor(lang);
  return {
    shop,
    home: site.home,
    tickets: site.tickets,
    booking: site.booking,
    visit: site.visit,
    orariRows: site.orariRows,
    research: site.research,
    news: site.news,
    museum: site.museum,
  };
}
