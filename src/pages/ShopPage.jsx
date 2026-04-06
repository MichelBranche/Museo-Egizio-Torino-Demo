import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HomeLink from '../components/HomeLink';
import Cursor from '../components/Cursor';
import MenuOverlay from '../components/MenuOverlay';
import TicketsShopOverlay from '../components/TicketsShopOverlay';
import MagneticBtn from '../components/MagneticBtn';
import MarqueeBtn from '../components/MarqueeBtn';
import HieroglyphMarquee from '../components/HieroglyphMarquee';
import ShopCartDrawer from '../components/ShopCartDrawer';
import MuseoLogo from '../components/MuseoLogo';
import { SHOP_CATEGORIES, SHOP_PRODUCTS } from '../data/shopProducts';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/useLanguage';
import LanguageSwitcher from '../components/LanguageSwitcher';
import DesignCredit from '../components/DesignCredit';

function useProductCopy(p) {
  const { t } = useLanguage();
  const name = t(`pages.shop.products.${p.id}.name`) || p.name;
  const description = t(`pages.shop.products.${p.id}.description`) || p.description;
  const catLabel = t(`pages.shop.categories.${p.category}`) ?? p.category;
  return { name, description, catLabel, t };
}

gsap.registerPlugin(ScrollTrigger);

/* ── Animated index number ────────────────────────────────────────────── */
function Idx({ n }) {
  return (
    <span className="font-gambetta text-[10px] font-normal tabular-nums text-white/20 md:text-xs">
      {String(n).padStart(2, '0')}
    </span>
  );
}

/* ── Featured hero product ─────────────────────────────────────────── */
function FeaturedProduct({ p, idx, onAdd }) {
  const { name, description, catLabel, t } = useProductCopy(p);
  return (
    <div className="group relative flex flex-col md:flex-row border-b border-white/10 overflow-hidden">
      {/* Image */}
      <div className="relative w-full md:w-[60%] aspect-[16/9] md:aspect-auto md:min-h-[70vh] overflow-hidden">
        <img
          src={p.image}
          alt={name}
          className="absolute inset-0 h-full w-full object-cover grayscale transition-all duration-1000 group-hover:scale-[1.04] group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-transparent to-[#0a0a0a] opacity-40 md:opacity-80" />
        <div className="absolute top-4 left-4 md:top-8 md:left-8 flex items-center gap-3">
          <div className="h-px w-8 bg-oro/60" />
          <Idx n={idx} />
        </div>
      </div>

      {/* Content */}
      <div className="relative md:w-[40%] flex flex-col justify-end p-6 md:p-16 bg-[#0a0a0a]">
        <span className="pointer-events-none absolute -right-4 top-0 select-none font-gambetta text-[clamp(6rem,12vw,18rem)] leading-none text-white/[0.03]" aria-hidden>
          {String(idx).padStart(2, '0')}
        </span>
        <div className="relative z-10">
          <p className="mb-3 md:mb-4 text-[10px] font-bold uppercase tracking-[0.45em] text-oro">
            {catLabel}
          </p>
          <h2 className="font-gambetta text-[clamp(1.8rem,4vw,4rem)] leading-[1.0] text-white mb-4 md:mb-6">
            {name}
          </h2>
          <p className="mb-6 md:mb-10 max-w-sm text-sm leading-relaxed text-white/45">{description}</p>
          <div className="flex items-center gap-6 md:gap-8">
            <span className="font-gambetta text-[clamp(2rem,4vw,4rem)] text-oro leading-none">{p.price}€</span>
            <MagneticBtn>
              <button
                type="button"
                onClick={() => onAdd(p.id)}
                className="rounded-full border border-oro px-6 md:px-8 py-2.5 md:py-3 text-[10px] font-bold uppercase tracking-[0.3em] text-oro transition-all duration-300 hover:bg-oro hover:text-white"
                data-cursor-hover="true"
              >
                {t('pages.shop.buy')}
              </button>
            </MagneticBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditorialMainCard({ p, idx, onAdd }) {
  const { name, catLabel, t } = useProductCopy(p);
  return (
    <div className="group relative overflow-hidden bg-[#0d0d0d]" style={{ minHeight: '60vh' }}>
      <img
        src={p.image}
        alt={name}
        className="absolute inset-0 h-full w-full object-cover grayscale transition-all duration-1000 group-hover:scale-[1.05] group-hover:grayscale-0"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent" />
      <div className="absolute inset-0 bg-[#0a0a0a]/0 transition-all duration-500 group-hover:bg-[#0a0a0a]/40" />
      <div className="absolute top-6 left-6 flex items-center gap-3">
        <Idx n={idx} />
        <div className="h-px w-6 bg-white/20" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.45em] text-oro/80">
          {catLabel}
        </p>
        <h3 className="font-gambetta text-[clamp(1.5rem,3vw,2.5rem)] leading-tight text-white mb-3">{name}</h3>
        <div className="flex items-center justify-between">
          <span className="font-gambetta text-2xl text-oro">{p.price}€</span>
          <button
            type="button"
            onClick={() => onAdd(p.id)}
            className="translate-y-2 rounded-full border border-white/30 px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-white/70 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:border-oro hover:text-oro"
            data-cursor-hover="true"
          >
            {t('pages.shop.add')}
          </button>
        </div>
      </div>
    </div>
  );
}

function EditorialSmallCard({ p, idx, onAdd }) {
  const { name } = useProductCopy(p);
  return (
    <div className="group relative flex gap-4 border-b border-white/8 py-6 last:border-b-0 items-center hover:bg-white/[0.02] transition-colors duration-300 px-4">
      <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden">
        <img
          src={p.image}
          alt={name}
          className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
        />
      </div>
      <div className="flex-1 min-w-0">
        <Idx n={idx} />
        <h4 className="font-gambetta text-lg leading-tight text-white mt-1 truncate">{name}</h4>
        <span className="text-oro font-gambetta text-base">{p.price}€</span>
      </div>
      <button
        type="button"
        onClick={() => onAdd(p.id)}
        className="flex-shrink-0 rounded-full border border-white/20 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white/50 opacity-0 transition-all duration-300 group-hover:opacity-100 hover:border-oro hover:text-oro"
        data-cursor-hover="true"
      >
        +
      </button>
    </div>
  );
}

/* ── Editorial row: large item left OR right + small stacked items ───── */
function EditorialRow({ items, startIdx, onAdd, flip = false }) {
  const [main, ...smalls] = items;
  if (!main) return null;

  const mainContent = <EditorialMainCard p={main} idx={startIdx} onAdd={onAdd} />;
  const smallsContent = (
    <div className="flex flex-col border border-white/8 divide-y divide-white/8 bg-[#0d0d0d]">
      {smalls.map((p, i) => (
        <EditorialSmallCard key={p.id} p={p} idx={startIdx + 1 + i} onAdd={onAdd} />
      ))}
    </div>
  );

  return (
    <div className={`grid grid-cols-1 md:grid-cols-12 gap-px`}>
      {flip ? (
        <>
          <div className="md:col-span-4">{smallsContent}</div>
          <div className="md:col-span-8">{mainContent}</div>
        </>
      ) : (
        <>
          <div className="md:col-span-8">{mainContent}</div>
          <div className="md:col-span-4">{smallsContent}</div>
        </>
      )}
    </div>
  );
}

/* ── Main Page ────────────────────────────────────────────────────────── */
const ShopPage = () => {
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTicketsShopOpen, setIsTicketsShopOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { addItem, itemCount } = useCart();
  const mainRef = useRef(null);

  const activeCat = useMemo(() => {
    const raw = searchParams.get('cat');
    return raw && SHOP_CATEGORIES.some((c) => c.id === raw) ? raw : 'tutti';
  }, [searchParams]);

  const filtered = useMemo(() => {
    if (activeCat === 'tutti') return SHOP_PRODUCTS;
    return SHOP_PRODUCTS.filter((p) => p.category === activeCat);
  }, [activeCat]);

  const setCategory = (id) => {
    if (id === 'tutti') setSearchParams({});
    else setSearchParams({ cat: id });
  };

  const handleAdd = (id) => {
    addItem(id);
    setCartOpen(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // GSAP scroll entrance animations
  useEffect(() => {
    if (!mainRef.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.fromTo(el,
          { y: 80, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1.2, ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          }
        );
      });
    }, mainRef);
    return () => ctx.revert();
  }, [filtered]);

  // Split products for editorial layout
  const featured = filtered[0];
  const rest = filtered.slice(1);
  // Group rest into rows of 3 (1 main + 2 smalls)
  const rows = [];
  for (let i = 0; i < rest.length; i += 3) {
    rows.push(rest.slice(i, i + 3));
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0a0a0a] font-satoshi text-white selection:bg-oro selection:text-white" ref={mainRef}>
      {/* Ghost watermark — capped for ultrawide */}
      <div className="pointer-events-none fixed left-1/2 top-0 -translate-x-1/2 select-none font-gambetta text-[clamp(6rem,22vw,20rem)] leading-none text-white/[0.018] whitespace-nowrap" aria-hidden>
        SHOP
      </div>

      <Cursor />
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <TicketsShopOverlay isOpen={isTicketsShopOpen} onClose={() => setIsTicketsShopOpen(false)} />
      <ShopCartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* HEADER */}
      <header className="fixed top-0 z-40 flex w-full items-center justify-between border-b border-white/10 px-4 py-4 md:px-6 md:py-5 text-sm uppercase tracking-widest text-white bg-black/50 backdrop-blur-md">
        <div className="flex w-auto md:w-1/3 items-center gap-6">
          <HomeLink className="text-[10px] md:text-sm transition-colors hover:text-oro" data-cursor-hover="true">{t('nav.backHome')}</HomeLink>
          <span className="hidden lg:inline-block border-l border-white/30 pl-6 text-white/50 text-[10px]">{t('nav.torino')}</span>
        </div>
        <div className="flex-1 text-center md:w-1/3 md:flex-none">
          <MagneticBtn>
            <HomeLink
              className="inline-block leading-none text-white transition-opacity hover:opacity-90"
              data-cursor-hover="true"
            >
              <MuseoLogo className="h-6 w-auto max-w-[min(200px,42vw)] md:h-8" />
              <span className="sr-only">{t('a11y.logoHome')}</span>
            </HomeLink>
          </MagneticBtn>
        </div>
        <div className="flex w-auto md:w-1/3 items-center justify-end gap-3 md:gap-6">
          <LanguageSwitcher variant="dark" />
          <MagneticBtn>
            <button type="button" onClick={() => setCartOpen(true)}
              className="relative inline-flex items-center rounded-full border border-white px-3 py-1.5 md:px-4 md:py-2 text-[9px] md:text-[10px] font-bold transition-colors hover:bg-white hover:text-black"
              data-cursor-hover="true">
              <span>{t('nav.cart')}</span>
              {itemCount > 0 && (
                <span className="ml-1.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-oro px-1 text-[9px] text-white">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>
          </MagneticBtn>
          <MagneticBtn>
            <button type="button" onClick={() => setIsMenuOpen(true)}
              className="rounded-full bg-white/10 px-3 py-1.5 md:px-6 md:py-2 text-[10px] md:text-sm transition-colors hover:text-oro" data-cursor-hover="true">
              {t('nav.menu')}
            </button>
          </MagneticBtn>
        </div>
      </header>

      {/* EDITORIAL PAGE HEADER */}
      <section className="pt-28 md:pt-36 pb-0 px-4 md:px-10 max-w-[1700px] mx-auto" data-reveal>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between border-b border-white/10 pb-8 md:pb-10 gap-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.55em] text-oro mb-3">
              {t('pages.shop.storeEyebrow').replace('{count}', String(filtered.length))}
            </p>
            <h1 className="font-gambetta text-[clamp(3.5rem,12vw,10rem)] leading-[0.9] tracking-tighter">
              <span className="block text-white">{t('pages.shop.headline1')}</span>
              <span className="block italic text-white/30">{t('pages.shop.headline2')}</span>
              <span className="block text-oro">{t('pages.shop.headline3')}</span>
            </h1>
          </div>
          {/* Category filters — pills on mobile, italic list on desktop */}
          <div className="flex flex-wrap gap-2 md:flex-col md:items-end md:gap-2">
            {[{ id: 'tutti' }, ...SHOP_CATEGORIES].map((c) => (
              <button key={c.id} type="button" onClick={() => setCategory(c.id)}
                className={`rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 md:rounded-none md:px-0 md:py-0 md:bg-transparent md:text-xl md:font-gambetta md:italic md:tracking-normal md:uppercase-none ${
                  activeCat === c.id
                    ? 'bg-oro text-white md:bg-transparent md:text-oro'
                    : 'border border-white/20 text-white/50 hover:text-white md:border-0 md:text-white/25 md:hover:text-white/70'
                }`}
                data-cursor-hover="true">
                {c.id === 'tutti' ? t('pages.shop.catTutti') : t(`pages.shop.categories.${c.id}`)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <HieroglyphMarquee className="relative z-20 mt-0" />

      {/* PRODUCT CATALOG — EDITORIAL LAYOUT */}
      <main className="border-t border-white/5">
        {filtered.length === 0 ? (
          <p className="py-40 text-center text-white/30 font-gambetta text-2xl italic">{t('pages.shop.noProducts')}</p>
        ) : (
          <>
            {/* Featured product — full editorial treatment */}
            {featured && (
              <div data-reveal>
                <FeaturedProduct p={featured} idx={1} onAdd={handleAdd} />
              </div>
            )}

            {/* Editorial rows */}
            {rows.map((row, ri) => (
              <div key={ri} className="border-b border-white/8" data-reveal>
                <EditorialRow
                  items={row}
                  startIdx={2 + ri * 3}
                  onAdd={handleAdd}
                  flip={ri % 2 === 1}
                />
              </div>
            ))}
          </>
        )}
      </main>

      {/* MARQUEE FOOTER BAR */}
      <section className="overflow-hidden border-t border-white/10 py-6">
        <div className="flex animate-[marquee_20s_linear_infinite] whitespace-nowrap gap-16">
          {Array(6).fill(null).map((_, i) => (
            <span key={i} className="font-gambetta text-[clamp(2rem,4vw,3.5rem)] italic text-white/10 uppercase">
              {t('pages.shop.marquee')}&nbsp;
            </span>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#0a0a0a] px-6 py-10 text-center text-[10px] uppercase tracking-[0.25em] text-white/20">
        <p>© {new Date().getFullYear()} {t('pages.shop.footerDemo')}</p>
        <p className="mt-4">
          <DesignCredit className="text-white/35 hover:text-oro/90" />
        </p>
      </footer>
    </div>
  );
};

export default ShopPage;
