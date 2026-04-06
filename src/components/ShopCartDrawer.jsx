import React, { useCallback, useEffect, useState } from 'react';
import HomeLink from './HomeLink';
import { getProductById } from '../data/shopProducts';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/useLanguage';

const ShopCartDrawer = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { lines, setQty, removeItem, total, clearCart } = useCart();
  const [demoThanks, setDemoThanks] = useState(false);

  const handleClose = useCallback(() => {
    setDemoThanks(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    const html = document.documentElement;
    if (isOpen) html.style.overflow = 'hidden';
    else html.style.overflow = '';
    return () => {
      html.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && isOpen) handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, handleClose]);

  const handleDemoCheckout = () => {
    clearCart();
    setDemoThanks(true);
  };

  return (
    <div
      className={`fixed inset-0 z-[103] ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        tabIndex={isOpen ? 0 : -1}
        aria-label={t('pages.shop.cart.closeAria')}
        className={`absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-papiro text-inchiostro shadow-[-12px_0_48px_rgba(0,0,0,0.2)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-inchiostro/10 px-6 py-4 md:px-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-oro">{t('pages.shop.cart.eyebrow')}</p>
            <h2 className="font-gambetta text-2xl italic md:text-3xl">{t('pages.shop.cart.title')}</h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full border border-inchiostro/20 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors hover:border-inchiostro hover:bg-inchiostro hover:text-papiro"
            data-cursor-hover="true"
          >
            {t('pages.shop.cart.close')}
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 md:px-8">
          {demoThanks ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="font-gambetta text-3xl italic text-oro">{t('pages.shop.cart.thanks')}</p>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-inchiostro/65">
                {t('pages.shop.cart.thanksBody')}
              </p>
              <HomeLink
                onClick={handleClose}
                className="mt-8 rounded-full border border-inchiostro bg-inchiostro px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] text-papiro transition-colors hover:border-oro hover:bg-oro"
                data-cursor-hover="true"
              >
                {t('pages.shop.cart.backHome')}
              </HomeLink>
            </div>
          ) : lines.length === 0 ? (
            <p className="py-12 text-center text-sm text-inchiostro/55">
              {t('pages.shop.cart.empty')}
            </p>
          ) : (
            <ul className="space-y-6">
              {lines.map(({ productId, qty }) => {
                const p = getProductById(productId);
                if (!p) return null;
                const pname = t(`pages.shop.products.${p.id}.name`) || p.name;
                return (
                  <li
                    key={productId}
                    className="flex gap-4 border-b border-inchiostro/10 pb-6 last:border-0 last:pb-0"
                  >
                    <div className="h-24 w-20 shrink-0 overflow-hidden rounded-sm bg-inchiostro/5">
                      <img src={p.image} alt="" className="h-full w-full object-cover grayscale" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium leading-snug">{pname}</p>
                      <p className="mt-1 font-gambetta text-lg text-oro">
                        {p.price}€
                        <span className="ml-2 text-xs font-satoshi text-inchiostro/45">{t('pages.shop.cart.each')}</span>
                      </p>
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex items-center border border-inchiostro/15">
                          <button
                            type="button"
                            className="px-3 py-1 text-sm hover:bg-inchiostro/5"
                            onClick={() => setQty(productId, qty - 1)}
                            aria-label={t('pages.booking.dec')}
                          >
                            −
                          </button>
                          <span className="min-w-[2rem] text-center text-sm font-bold">{qty}</span>
                          <button
                            type="button"
                            className="px-3 py-1 text-sm hover:bg-inchiostro/5"
                            onClick={() => setQty(productId, qty + 1)}
                            aria-label={t('pages.booking.inc')}
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          className="text-[10px] font-bold uppercase tracking-widest text-inchiostro/40 underline-offset-2 hover:text-inchiostro hover:underline"
                          onClick={() => removeItem(productId)}
                        >
                          {t('pages.shop.cart.remove')}
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {!demoThanks && lines.length > 0 && (
          <div className="shrink-0 border-t border-inchiostro/10 bg-papiro/95 px-6 py-6 md:px-8">
            <div className="mb-4 flex justify-between text-sm">
              <span className="text-inchiostro/60">{t('pages.shop.cart.subtotal')}</span>
              <span className="font-gambetta text-xl text-oro">{total.toFixed(2)}€</span>
            </div>
            <p className="mb-4 text-[11px] leading-relaxed text-inchiostro/45">
              {t('pages.shop.cart.shipNote')}
            </p>
            <button
              type="button"
              onClick={handleDemoCheckout}
              className="w-full rounded-full border border-inchiostro bg-inchiostro py-4 text-xs font-bold uppercase tracking-[0.25em] text-papiro transition-colors hover:border-oro hover:bg-oro hover:text-white"
              data-cursor-hover="true"
            >
              {t('pages.shop.cart.checkoutDemo')}
            </button>
          </div>
        )}
      </aside>
    </div>
  );
};

export default ShopCartDrawer;
