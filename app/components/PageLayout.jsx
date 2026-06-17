import {Aside} from '~/components/Aside';
import {CartDrawer} from '~/components/CartDrawer';
import {Footer} from '~/components/Footer';
import {Header, HeaderMenu} from '~/components/Header';

export function PageLayout({
  cart,
  children = null,
  footer,
  header,
  publicStoreDomain,
}) {
  return (
    <Aside.Provider>
      <CartDrawer cart={cart} />
      <MobileMenuAside header={header} publicStoreDomain={publicStoreDomain} />
      {header && (
        <Header
          header={header}
          cart={cart}
          publicStoreDomain={publicStoreDomain}
        />
      )}
      <main>{children}</main>
      <Footer
        footer={footer}
        header={header}
        publicStoreDomain={publicStoreDomain}
      />
    </Aside.Provider>
  );
}

function MobileMenuAside({header, publicStoreDomain}) {
  return (
    header.menu &&
    header.shop.primaryDomain?.url && (
      <Aside type="mobile" heading="MENU">
        <HeaderMenu
          menu={header.menu}
          viewport="mobile"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />
      </Aside>
    )
  );
}
