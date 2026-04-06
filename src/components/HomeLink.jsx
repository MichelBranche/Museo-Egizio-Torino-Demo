import React from 'react';
import { Link } from 'react-router-dom';
import { HOME_SPA_LINK_STATE, HOME_SPA_TO, markPendingHomeQuick } from '../routeHistory';

/** Link verso la home da altre pagine: ?homeQuick=1 + state + flag sessionStorage. */
export default function HomeLink({ className, children, onClick, ...rest }) {
  return (
    <Link
      to={HOME_SPA_TO}
      state={HOME_SPA_LINK_STATE}
      className={className}
      {...rest}
      onClick={(e) => {
        markPendingHomeQuick();
        onClick?.(e);
      }}
    >
      {children}
    </Link>
  );
}
