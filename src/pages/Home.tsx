import { useState } from 'react';
import { MessageCircle, Star, Shield, Clock, Users, Car, CheckCircle } from 'lucide-react';
import BookingForm from '@/components/BookingForm';
import FleetCard from '@/components/FleetCard';
import heroImage from '@/assets/hero-image.jpg';
import saloonCarImage from '@/assets/saloon-car.jpg';
import suvImage from '@/assets/suv.jpg';
import hiaceImage from '@/assets/hiace.jpg';
import coasterImage from '@/assets/coaster.jpg';
import mercedesEClassImage from '@/assets/mercedes-e-class.jpg';

const fleetData = [
  {
    id: 'saloon',
    image: saloonCarImage,
    title: 'Saloon Car',
    description: 'Comfortable and economical choice for city travel and airport transfers.',
    features: ['AC', 'Professional Chauffeur', '4 Seats'],
    seats: '4 Seats',
  },
  {
    id: 'suv',
    image: suvImage,
    title: 'SUV',
    description: 'Spacious and luxurious for business meetings and premium travel.',
    features: ['AC', 'Professional Chauffeur', '7 Seats', 'Premium Interior'],
    seats: '7 Seats',
  },
  {
    id: 'luxury-sedan',
    image: mercedesEClassImage,
    title: 'Luxury Sedan',
    description: 'Premium experience with top-of-the-line vehicles and service.',
    features: ['AC', 'Professional Chauffeur', '4 Seats', 'Luxury Features'],
    seats: '4 Seats',
  },
  {
    id: 'hiace',
    image: hiaceImage,
    title: 'Hiace Bus (14 seats)',
    description: 'Perfect for group transportation, events, and airport transfers.',
    features: ['AC', 'Professional Chauffeur', '14 Seats', 'Group Travel'],
    seats: '14 Seats',
  },
];

const testimonials = [
  {
    name: 'Adebayo Johnson',
    role: 'Business Executive',
    content: 'MRS Car Rental provided exceptional service for our corporate event. The chauffeur was professional and the vehicle was immaculate. Highly recommended!',
    rating: 5,
  },
  {
    name: 'Sarah Okafor',
    role: 'Event Planner',
    content: 'Used their services for a wedding transportation. Everything was perfectly organized and on time. The luxury sedan was exactly what we needed.',
    rating: 5,
  },
  {
    name: 'Michael Adebayo',
    role: 'Frequent Traveler',
    content: 'Reliable airport transfers every time. Their booking system is easy to use and the drivers are always punctual and courteous.',
    rating: 5,
  },
];

const whyChooseUs = [
  {
    icon: Shield,
    title: '24/7 Availability',
    description: 'Round-the-clock service for all your transportation needs.',
  },
  {
    icon: Users,
    title: 'Professional Chauffeurs',
    description: 'Experienced, courteous, and well-trained drivers.',
  },
  {
    icon: Car,
    title: 'Premium Fleet',
    description: 'Well-maintained, luxury vehicles for maximum comfort.',
  },
  {
    icon: Clock,
    title: 'Punctual Service',
    description: 'Always on time, every time. Your schedule is our priority.',
  },
  {
    icon: CheckCircle,
    title: 'Competitive Rates',
    description: 'Quality service at affordable and transparent pricing.',
  },
  {
    icon: Star,
    title: 'Excellent Reviews',
    description: 'Consistently rated 5 stars by our satisfied customers.',
  },
];

export default function Home() {
  const [selectedCarType, setSelectedCarType] = useState<string>('');

  const handleFleetBooking = (carType: string) => {
    setSelectedCarType(carType);
    document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToBookingForm = () => {
    document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay" />
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Premium <span className="text-luxury-gold">Car Hire Service</span> in Lagos & Abuja
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-200">
                MRS Car Rental is your trusted car rental in Lagos and Abuja. 
                Experience luxury chauffeur-driven transportation, available 24/7.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={scrollToBookingForm}
                  className="btn-primary text-lg px-8 py-4"
                >
                  Book Now
                </button>
                <a
                  href="https://wa.me/2348026149390"
                  className="btn-secondary flex items-center justify-center gap-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section id="booking-form" className="py-20 bg-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <BookingForm preselectedCarType={selectedCarType} />
        </div>
      </section>

      {/* Fleet Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-luxury-navy mb-4">
              Our Premium Car Hire Fleet
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our diverse range of well-maintained vehicles for car rental in Lagos and Abuja, 
              each designed to provide maximum comfort and reliability for your journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {fleetData.map((vehicle) => (
              <FleetCard
                key={vehicle.id}
                image={vehicle.image}
                title={vehicle.title}
                description={vehicle.description}
                features={vehicle.features}
                seats={vehicle.seats}
                onBookNow={() => handleFleetBooking(vehicle.title)}
              />
            ))}
          </div>

          <div className="text-center">
            <a
              href="/inventory"
              className="btn-outline inline-flex items-center gap-2"
            >
              <Car className="h-5 w-5" />
              View Full Fleet
            </a>
          </div>
        </div>
      </section>

      {/* About Blurb */}
      <section className="py-20 bg-luxury-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-luxury-navy mb-6">
                About MRS Car Rental
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Lagos and Abuja's premier car hire service, 
                MRS Car Rental has been providing exceptional car rental in Lagos and Abuja 
                since our inception. We specialize in luxury chauffeur-driven car hire 
                with professional drivers for all occasions.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                From airport transfers to wedding transportation, corporate events 
                to city tours, we ensure every journey is comfortable, safe, and memorable. 
                Our commitment to excellence has made us the trusted choice for 
                discerning clients across Nigeria.
              </p>
              <a
                href="/about"
                className="btn-primary"
              >
                Learn More About Us
              </a>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-card text-center">
                <div className="text-3xl font-bold text-luxury-gold mb-2">24/7</div>
                <div className="text-gray-600">Available</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-card text-center">
                <div className="text-3xl font-bold text-luxury-gold mb-2">100+</div>
                <div className="text-gray-600">Happy Clients</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-card text-center">
                <div className="text-3xl font-bold text-luxury-gold mb-2">5★</div>
                <div className="text-gray-600">Rating</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-card text-center">
                <div className="text-3xl font-bold text-luxury-gold mb-2">2</div>
                <div className="text-gray-600">Cities</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-luxury-navy mb-4">
              Why Choose Our Car Hire Service?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              As the leading car hire service in Lagos and Abuja, we go above and beyond 
              to ensure your transportation experience exceeds expectations every single time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-luxury-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-luxury-gold/20 transition-colors">
                  <item.icon className="h-8 w-8 text-luxury-gold" />
                </div>
                <h3 className="text-xl font-semibold text-luxury-navy mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-luxury-navy mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600">
              Don't just take our word for it - hear from our satisfied customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-luxury-gold fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-luxury-navy">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="/about"
              className="btn-outline"
            >
              Read More Reviews
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-luxury-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Book Your Car Hire in Lagos or Abuja?
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Book your ride today and discover why MRS Car Rental is the most trusted 
            car rental in Lagos and Abuja.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={scrollToBookingForm}
              className="btn-primary"
            >
              Book Your Ride Now
            </button>
            <a
              href="tel:+2348026149390"
              className="btn-secondary"
            >
              Call Now: 0802 614 9390
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}