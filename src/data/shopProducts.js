/** Catalogo demo shop — immagini da asset già presenti in /public */

export const SHOP_CATEGORIES = [
  { id: 'libri', label: 'Libri e cataloghi' },
  { id: 'souvenir', label: 'Souvenir & design' },
  { id: 'gift', label: 'Gift card' },
];

export const SHOP_PRODUCTS = [
  {
    id: 'bk-luce-nilo',
    category: 'libri',
    name: 'Luce del Nilo — catalogo mostra',
    description: 'Edizione illustrata con saggi introduttivi e schede dei reperti in mostra.',
    price: 28,
    image: '/shop_book_luce_nilo.png',
  },
  {
    id: 'bk-egittologia',
    category: 'libri',
    name: 'Egittologia — introduzione',
    description: 'Testo divulgativo su storia, geroglifici e metodo archeologico.',
    price: 42,
    image: '/shop_book_egittologia.png',
  },
  {
    id: 'bk-museo-storia',
    category: 'libri',
    name: 'Il Museo Egizio — una storia',
    description: 'Dalle origini della collezione alla nuova ala.',
    price: 35,
    image: '/shop_book_museo_storia.png',
  },
  {
    id: 'sv-magnete',
    category: 'souvenir',
    name: 'Magnete geroglifico',
    description: 'Stampa su supporto rigido, serie collezione faraonica.',
    price: 8,
    image: '/shop_souvenir_magnete.png',
  },
  {
    id: 'sv-taccuino',
    category: 'souvenir',
    name: 'Taccuino — carta papiro',
    description: 'Copertina rigida, pagine avorio, formato A5.',
    price: 14,
    image: '/shop_souvenir_taccuino.png',
  },
  {
    id: 'sv-poster',
    category: 'souvenir',
    name: 'Poster Granito',
    description: 'Stampa fine art 50×70 cm, edizione limitata.',
    price: 22,
    image: '/shop_souvenir_poster.png',
  },
  {
    id: 'sv-scarabeo',
    category: 'souvenir',
    name: 'Pin smaltato scarabeo',
    description: 'Metallo e smalto, chiusura a farfalla.',
    price: 12,
    image: '/shop_souvenir_scarabeo.png',
  },
  {
    id: 'gf-25',
    category: 'gift',
    name: 'Gift card 25€',
    description: 'Utilizzabile in biglietteria e shop fisico (anteprima online).',
    price: 25,
    image: '/shop_gift_card.png',
  },
  {
    id: 'gf-50',
    category: 'gift',
    name: 'Gift card 50€',
    description: 'Valida 24 mesi dalla data di acquisto.',
    price: 50,
    image: '/shop_gift_card.png',
  },
  {
    id: 'gf-100',
    category: 'gift',
    name: 'Gift card 100€',
    description: 'Ideale per abbonamenti e cataloghi premium.',
    price: 100,
    image: '/shop_gift_card.png',
  },
];

export function getProductById(id) {
  return SHOP_PRODUCTS.find((p) => p.id === id);
}
