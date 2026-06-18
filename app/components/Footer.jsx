export function Footer() {
  return (
    <footer className="bg-twilight-indigo-700 text-powder-blue-100 mt-auto">
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-8">
        <div className="mb-10">
          <p className="font-heading text-xl font-bold text-white">
            Snowboard Emporium
          </p>
          <p className="mt-1 text-sm text-powder-blue-200">
            Premium snowboards and gear built for every descent.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 min-[48em]:grid-cols-4 mb-10">
          <FooterColumn heading="Shop">
            <FooterLink>Snowboards</FooterLink>
            <FooterLink>Bindings</FooterLink>
            <FooterLink>Boots</FooterLink>
            <FooterLink>Apparel</FooterLink>
            <FooterLink>New Arrivals</FooterLink>
          </FooterColumn>

          <FooterColumn heading="Support">
            <FooterLink>Contact Us</FooterLink>
            <FooterLink>Shipping &amp; Returns</FooterLink>
            <FooterLink>Size Guide</FooterLink>
            <FooterLink>FAQ</FooterLink>
            <FooterLink>Track Order</FooterLink>
          </FooterColumn>

          <FooterColumn heading="Company">
            <FooterLink>About Us</FooterLink>
            <FooterLink>Careers</FooterLink>
            <FooterLink>Sustainability</FooterLink>
            <FooterLink>Stores</FooterLink>
          </FooterColumn>

          <FooterColumn heading="Legal">
            <FooterLink>Privacy Policy</FooterLink>
            <FooterLink>Refund Policy</FooterLink>
            <FooterLink>Shipping Policy</FooterLink>
            <FooterLink>Terms of Service</FooterLink>
          </FooterColumn>
        </div>

        <div className="border-t border-twilight-indigo-600 pt-4 pb-6 mb-2">
          <p className="text-xs text-twilight-indigo-400 italic">
            This is a mock ecommerce site for demonstration purposes only. No real products, transactions, or services are offered.
          </p>
        </div>

        <div className="flex flex-col gap-4 min-[48em]:flex-row min-[48em]:justify-between min-[48em]:items-center">
          <p className="text-sm text-powder-blue-200">
            &copy; 2026 Snowboard Emporium. All rights reserved.
          </p>
          <div className="flex gap-6">
            <FooterLink>Instagram</FooterLink>
            <FooterLink>YouTube</FooterLink>
            <FooterLink>TikTok</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({heading, children}) {
  return (
    <div>
      <p className="font-heading font-semibold text-white mb-3">{heading}</p>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
}

function FooterLink({children}) {
  return (
    <li>
      <a
        href="/"
        className="text-sm text-powder-blue-200 hover:text-white hover:underline transition-colors"
      >
        {children}
      </a>
    </li>
  );
}
