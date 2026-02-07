import { Plane, Heart, Building, Users, MapPin, Car, CheckCircle } from 'lucide-react';

const services = [
  {
    icon: Plane,
    title: 'Airport Transfers',
    description: 'Professional pickup and drop-off services to and from Lagos and Abuja airports. Meet and greet service available.',
    features: ['Meet & Greet Service', 'Flight Monitoring', 'Comfortable Vehicles', '24/7 Availability'],
  },
  {
    icon: Heart,
    title: 'Wedding Transportation',
    description: 'Make your special day even more memorable with our luxury wedding transportation services for couples and guests.',
    features: ['Luxury Vehicle Options', 'Decorated Vehicles', 'Professional Chauffeurs', 'Group Transportation'],
  },
  {
    icon: Building,
    title: 'Corporate Events',
    description: 'Reliable transportation solutions for business meetings, conferences, and corporate events across Lagos and Abuja.',
    features: ['Executive Vehicles', 'Professional Service', 'Flexible Scheduling', 'Corporate Rates'],
  },
  {
    icon: Users,
    title: 'Group Transportation',
    description: 'Comfortable group travel solutions with our Hiace and Coaster buses for events, tours, and group outings.',
    features: ['14-32 Seater Options', 'Group Discounts', 'Event Coordination', 'Professional Drivers'],
  },
  {
    icon: MapPin,
    title: 'City Tours',
    description: 'Explore Lagos and Abuja with our guided city tour services. Perfect for tourists and business visitors.',
    features: ['Local Expertise', 'Flexible Itineraries', 'Tourist Destinations', 'Cultural Insights'],
  },
  {
    icon: Car,
    title: 'Executive Travel',
    description: 'Premium transportation for executives and VIPs requiring discretion, punctuality, and luxury service.',
    features: ['Luxury Vehicles', 'Privacy & Discretion', 'Professional Service', 'VIP Treatment'],
  },
];

const process = [
  {
    step: '1',
    title: 'Book Your Service',
    description: 'Contact us via phone, WhatsApp, or our online booking form to reserve your transportation.',
  },
  {
    step: '2',
    title: 'Confirmation',
    description: 'We confirm your booking details and provide you with driver and vehicle information.',
  },
  {
    step: '3',
    title: 'Professional Service',
    description: 'Our professional chauffeur arrives on time with a clean, comfortable vehicle.',
  },
  {
    step: '4',
    title: 'Safe Journey',
    description: 'Enjoy a safe, comfortable journey to your destination with our experienced drivers.',
  },
];

const servicesJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "MRS Car Rental - Car Hire Service in Lagos & Abuja",
  "provider": {
    "@type": "LocalBusiness",
    "name": "MRS Car Rental",
    "url": "https://mrscarrental.lovable.app",
    "telephone": "+2348026149390",
    "areaServed": [
      { "@type": "City", "name": "Lagos" },
      { "@type": "City", "name": "Abuja" }
    ]
  },
  "serviceType": "Car Hire Service",
  "description": "Premium chauffeur-driven car hire service in Lagos and Abuja. Airport transfers, wedding transportation, corporate events, group travel, city tours, and executive travel.",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Car Hire Services",
    "itemListElement": services.map((s, i) => ({
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": s.title,
        "description": s.description
      },
      "position": i + 1
    }))
  }
};

export default function Services() {
  const scrollToContact = () => {
    window.location.href = '/contact';
  };

  return (
    <div className="min-h-screen pt-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }} />
      {/* Hero Section */}
      <section className="py-20 bg-luxury-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Car Hire <span className="text-luxury-gold">Services</span> in Lagos & Abuja
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive car rental in Lagos and Abuja — chauffeur-driven solutions for every occasion
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-luxury-navy mb-4">
              Our Car Hire & Rental Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From airport transfers to special events, our car hire service in Lagos and Abuja 
              provides reliable, professional transportation tailored to your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-xl shadow-card p-8 hover:shadow-elegant transition-shadow group">
                <div className="w-16 h-16 bg-luxury-gold/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-luxury-gold/20 transition-colors">
                  <service.icon className="h-8 w-8 text-luxury-gold" />
                </div>
                
                <h3 className="text-2xl font-bold text-luxury-navy mb-4">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 mb-6">
                  {service.description}
                </p>
                
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-luxury-gold flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-luxury-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-luxury-navy mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to book and enjoy our premium transportation services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <div key={index} className="text-center relative">
                <div className="w-16 h-16 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-luxury-navy mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
                
                {/* Arrow for desktop */}
                {index < process.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full">
                    <div className="w-full h-0.5 bg-luxury-gold/30 relative">
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-luxury-gold/30 rotate-45 translate-x-1/2"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-luxury-navy mb-4">
              Car Hire Service Areas in Lagos & Abuja
            </h2>
            <p className="text-xl text-gray-600">
              Our car rental covers Nigeria's major business and tourist destinations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white rounded-xl shadow-card p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-luxury-gold/10 rounded-lg flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-luxury-gold" />
                </div>
                <h3 className="text-2xl font-bold text-luxury-navy">Lagos</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li>• Lagos Airport (Murtala Muhammed International)</li>
                <li>• Victoria Island</li>
                <li>• Ikoyi</li>
                <li>• Ikeja</li>
                <li>• Lekki</li>
                <li>• Mainland Lagos</li>
                <li>• All major hotels and business districts</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-card p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-luxury-gold/10 rounded-lg flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-luxury-gold" />
                </div>
                <h3 className="text-2xl font-bold text-luxury-navy">Abuja</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li>• Nnamdi Azikiwe International Airport</li>
                <li>• Abuja City Center</li>
                <li>• Wuse</li>
                <li>• Garki</li>
                <li>• Maitama</li>
                <li>• Asokoro</li>
                <li>• All major hotels and government areas</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-luxury-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Book Your Service?
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Contact us today to discuss your transportation needs and receive 
            a personalized quote for your journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/"
              className="btn-primary"
            >
              Book Online
            </a>
            <button
              onClick={scrollToContact}
              className="btn-secondary"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}