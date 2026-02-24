import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-stone-200 bg-stone-900 text-stone-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold text-white">
              Shoboji Social Hall
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-stone-400">
              A welcoming community venue rooted in the traditions of Shoboji
              Temple, serving Honolulu families and organizations for
              celebrations, ceremonies, and gatherings of every kind.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white">Quick Links</h4>
            <ul className="mt-3 space-y-2">
              {[
                { href: "/rates", label: "Rates & Pricing" },
                { href: "/equipment", label: "Equipment Catalog" },
                { href: "/availability", label: "Check Availability" },
                { href: "/book", label: "Book Your Event" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white">Contact</h4>
            <ul className="mt-3 space-y-2 text-sm text-stone-400">
              <li>
                <span className="block text-stone-500">Address</span>
                1631 S Beretania St
                <br />
                Honolulu, HI 96826
              </li>
              <li>
                <span className="block text-stone-500">Phone</span>
                <a
                  href="tel:+18089490714"
                  className="transition-colors hover:text-white"
                >
                  (808) 949-0714
                </a>
              </li>
              <li>
                <span className="block text-stone-500">Email</span>
                <a
                  href="mailto:info@shoboji.org"
                  className="transition-colors hover:text-white"
                >
                  info@shoboji.org
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-semibold text-white">Hall Hours</h4>
            <ul className="mt-3 space-y-2 text-sm text-stone-400">
              <li>
                <span className="block text-stone-500">Events</span>
                8:00 AM - 10:00 PM
              </li>
              <li>
                <span className="block text-stone-500">Office</span>
                Mon - Fri, 9:00 AM - 4:00 PM
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-stone-700 pt-6 text-center text-sm text-stone-500">
          &copy; {currentYear} Shoboji Social Hall. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
