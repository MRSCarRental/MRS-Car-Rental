import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MessageCircle, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Our Fleet', href: '/inventory' },
  { name: 'FAQs', href: '/faqs' },
  { name: 'Contact', href: '/contact' },
];

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBookingForm = () => {
    if (location.pathname === '/') {
      document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/#booking-form';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className={cn(
        "transition-all duration-300 z-50",
        isScrolled 
          ? "header-sticky" 
          : "absolute top-0 left-0 right-0 bg-transparent text-white"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <Link to="/" className="text-2xl font-bold">
                <span className="text-luxury-gold">MRS</span>{" "}
                <span className={isScrolled ? "text-luxury-navy" : "text-white"}>
                  Car Rental
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "nav-link",
                    location.pathname === item.href && "active",
                    !isScrolled && location.pathname !== item.href && "text-white hover:text-luxury-gold"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0 space-x-4">
              <a
                href="tel:+2348026149390"
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors",
                  isScrolled 
                    ? "text-luxury-navy hover:text-luxury-gold" 
                    : "text-white hover:text-luxury-gold"
                )}
              >
                <Phone className="h-4 w-4" />
                <span className="hidden lg:inline">0802 614 9390</span>
              </a>
              <button
                onClick={scrollToBookingForm}
                className="btn-primary"
              >
                Book Now
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                className={cn(
                  "rounded-md p-2 inline-flex items-center justify-center transition-colors",
                  isScrolled ? "text-luxury-navy" : "text-white"
                )}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-lg md:hidden z-50">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                    location.pathname === item.href
                      ? "text-luxury-gold bg-luxury-cream"
                      : "text-luxury-navy hover:text-luxury-gold hover:bg-luxury-cream"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 py-4 space-y-2">
                <a
                  href="tel:+2348026149390"
                  className="flex items-center gap-2 text-luxury-navy hover:text-luxury-gold"
                >
                  <Phone className="h-4 w-4" />
                  0802 614 9390
                </a>
                <button
                  onClick={() => {
                    scrollToBookingForm();
                    setMobileMenuOpen(false);
                  }}
                  className="btn-primary w-full"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-luxury-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <span className="text-2xl font-bold">
                  <span className="text-luxury-gold">MRS</span> Car Rental
                </span>
              </div>
              <p className="text-gray-300 mb-4">
                Lagos and Abuja's premier chauffeur-driven transportation company, 
                providing luxury and reliable transport services 24/7.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://wa.me/2348026149390"
                  className="whatsapp-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp Us
                </a>
                <a
                  href="https://instagram.com/mrs_car_rental"
                  className="social-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Instagram"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C8.396 0 7.966.01 6.75.048 5.537.085 4.717.222 3.999.42c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.33 4.857.194 5.677.157 6.890.119 8.106.11 8.536.11 12.155c0 3.619.01 4.049.048 5.265.037 1.213.174 2.033.372 2.75.305.789.717 1.459 1.384 2.126s1.337 1.079 2.126 1.384c.717.198 1.537.335 2.75.372 1.216.037 1.646.048 5.265.048s4.049-.01 5.265-.048c1.213-.037 2.033-.174 2.75-.372.789-.305 1.459-.717 2.126-1.384s1.079-1.337 1.384-2.126c.198-.717.335-1.537.372-2.75.037-1.216.048-1.646.048-5.265s-.01-4.049-.048-5.265c-.037-1.213-.174-2.033-.372-2.75-.305-.789-.717-1.459-1.384-2.126S19.13.935 18.341.63c-.717-.198-1.537-.335-2.75-.372C14.375.01 13.945 0 10.326 0h1.691zm0 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 3.653c-2.68 0-4.857 2.175-4.857 4.857 0 2.68 2.177 4.857 4.857 4.857 2.682 0 4.857-2.177 4.857-4.857 0-2.682-2.175-4.857-4.857-4.857zm0 8.008c-1.74 0-3.151-1.412-3.151-3.151s1.411-3.151 3.151-3.151 3.151 1.411 3.151 3.151-1.411 3.151-3.151 3.151zm6.193-8.208c-.626 0-1.134-.508-1.134-1.134s.508-1.134 1.134-1.134 1.134.508 1.134 1.134-.508 1.134-1.134 1.134z"/>
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/share/1CT2r3hAey/?mibextid=wwXIfr"
                  className="social-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Facebook"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-luxury-gold">Quick Links</h3>
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-gray-300 hover:text-luxury-gold transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-luxury-gold">Contact Info</h3>
              <div className="space-y-2 text-gray-300">
                <p>2 Akin Adesola St, Victoria Island</p>
                <p>Lagos 101241, Lagos</p>
                <a
                  href="tel:+2348026149390"
                  className="block hover:text-luxury-gold transition-colors"
                >
                  0802 614 9390
                </a>
                <a
                  href="tel:+2348033647423"
                  className="block hover:text-luxury-gold transition-colors"
                >
                  0803 364 7423
                </a>
                <a
                  href="mailto:info@mrscarrental.com"
                  className="block hover:text-luxury-gold transition-colors"
                >
                  info@mrscarrental.com
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>© 2025 MRS Car Rental. All rights reserved. | Premium chauffeur-driven transportation services in Lagos & Abuja.</p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="back-to-top"
          aria-label="Back to top"
        >
          <ChevronUp className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}