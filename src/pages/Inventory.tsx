import { useState } from 'react';
import { Car, Users, Snowflake, User, Filter } from 'lucide-react';
import FleetCard from '@/components/FleetCard';
import saloonCarImage from '@/assets/saloon-car.jpg';
import suvImage from '@/assets/suv.jpg';
import hiaceImage from '@/assets/hiace.jpg';
import coasterImage from '@/assets/coaster.jpg';
import toyotaCamryImage from '@/assets/toyota-camry.jpg';
import hondaAccordImage from '@/assets/honda-accord.jpg';
import hondaPilotImage from '@/assets/honda-pilot.jpg';
import mercedesEClassImage from '@/assets/mercedes-e-class.jpg';
import bmw5SeriesImage from '@/assets/bmw-5-series.jpg';

const fleetData = [
  {
    id: 'saloon-1',
    category: 'Saloon Cars',
    image: toyotaCamryImage,
    title: 'Toyota Camry',
    description: 'Comfortable and economical choice for city travel and airport transfers.',
    features: ['AC', 'Professional Chauffeur', '4 Seats', 'Fuel Efficient'],
    seats: '4 Seats',
    type: 'Saloon Car',
  },
  {
    id: 'saloon-2',
    category: 'Saloon Cars',
    image: hondaAccordImage,
    title: 'Honda Accord',
    description: 'Reliable and comfortable sedan perfect for business travel.',
    features: ['AC', 'Professional Chauffeur', '4 Seats', 'Premium Sound'],
    seats: '4 Seats',
    type: 'Saloon Car',
  },
  {
    id: 'suv-1',
    category: 'SUVs',
    image: suvImage,
    title: 'Toyota Prado',
    description: 'Spacious and luxurious SUV for business meetings and premium travel.',
    features: ['AC', 'Professional Chauffeur', '7 Seats', 'Premium Interior', '4WD'],
    seats: '7 Seats',
    type: 'SUV',
  },
  {
    id: 'suv-2',
    category: 'SUVs',
    image: hondaPilotImage,
    title: 'Honda Pilot',
    description: 'Premium SUV with advanced features for executive travel.',
    features: ['AC', 'Professional Chauffeur', '7 Seats', 'Leather Seats', 'Entertainment System'],
    seats: '7 Seats',
    type: 'SUV',
  },
  {
    id: 'luxury-1',
    category: 'Luxury Sedans',
    image: mercedesEClassImage,
    title: 'Mercedes-Benz E-Class',
    description: 'Ultimate luxury experience with top-of-the-line features and service.',
    features: ['AC', 'Professional Chauffeur', '4 Seats', 'Luxury Features', 'Premium Sound'],
    seats: '4 Seats',
    type: 'Luxury Sedan',
  },
  {
    id: 'luxury-2',
    category: 'Luxury Sedans',
    image: bmw5SeriesImage,
    title: 'BMW 5 Series',
    description: 'Premium luxury sedan for discerning executives and VIPs.',
    features: ['AC', 'Professional Chauffeur', '4 Seats', 'Premium Leather', 'Advanced Tech'],
    seats: '4 Seats',
    type: 'Luxury Sedan',
  },
  {
    id: 'hiace-1',
    category: 'Hiace (14 seats)',
    image: hiaceImage,
    title: 'Toyota Hiace',
    description: 'Perfect for group transportation, events, and airport transfers.',
    features: ['AC', 'Professional Chauffeur', '14 Seats', 'Group Travel', 'Spacious Interior'],
    seats: '14 Seats',
    type: 'Hiace Bus (14 seats)',
  },
  {
    id: 'hiace-2',
    category: 'Hiace (14 seats)',
    image: hiaceImage,
    title: 'Toyota Hiace',
    description: 'Enhanced Hiace with premium features for comfortable group travel.',
    features: ['AC', 'Professional Chauffeur', '14 Seats', 'Premium Seats', 'Entertainment'],
    seats: '14 Seats',
    type: 'Hiace Bus (14 seats)',
  },
  {
    id: 'coaster-1',
    category: 'Coaster (25 seats)',
    image: coasterImage,
    title: 'Toyota Coaster',
    description: 'Large capacity bus ideal for corporate events and group transportation.',
    features: ['AC', 'Professional Chauffeur', '25 Seats', 'Event Transportation', 'Comfortable Seating'],
    seats: '25 Seats',
    type: 'Coaster Bus (25 seats)',
  },
  {
    id: 'coaster-2',
    category: 'Coaster (25 seats)',
    image: coasterImage,
    title: 'Toyota Coaster',
    description: 'Deluxe version with enhanced comfort features for longer journeys.',
    features: ['AC', 'Professional Chauffeur', '25 Seats', 'Premium Comfort', 'Audio System'],
    seats: '25 Seats',
    type: 'Coaster Bus (25 seats)',
  },
];

const categories = ['All', 'Saloon Cars', 'SUVs', 'Luxury Sedans', 'Hiace (14 seats)', 'Coaster (25 seats)'];

export default function Inventory() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedVehicle, setSelectedVehicle] = useState<typeof fleetData[0] | null>(null);

  const filteredFleet = selectedCategory === 'All' 
    ? fleetData 
    : fleetData.filter(vehicle => vehicle.category === selectedCategory);

  const handleFleetBooking = (vehicleType: string) => {
    // Redirect to home page with booking form pre-filled
    window.location.href = `/#booking-form?carType=${encodeURIComponent(vehicleType)}`;
  };

  const openVehicleModal = (vehicle: typeof fleetData[0]) => {
    setSelectedVehicle(vehicle);
  };

  const closeModal = () => {
    setSelectedVehicle(null);
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-luxury-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Our Premium <span className="text-luxury-gold">Fleet</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Explore our diverse range of well-maintained vehicles, each designed 
              to provide maximum comfort and reliability for your journey
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white sticky top-20 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            <Filter className="h-5 w-5 text-luxury-gold flex-shrink-0" />
            <div className="flex gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? 'bg-luxury-gold text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-luxury-gold/10'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Fleet Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-luxury-navy mb-4">
              {selectedCategory === 'All' ? 'All Vehicles' : selectedCategory}
            </h2>
            <p className="text-lg text-gray-600">
              {filteredFleet.length} vehicle{filteredFleet.length !== 1 ? 's' : ''} available
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFleet.map((vehicle) => (
              <div key={vehicle.id} className="relative">
                <FleetCard
                  image={vehicle.image}
                  title={vehicle.title}
                  description={vehicle.description}
                  features={vehicle.features}
                  seats={vehicle.seats}
                  onBookNow={() => handleFleetBooking(vehicle.type)}
                />
                <button
                  onClick={() => openVehicleModal(vehicle)}
                  className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-luxury-navy px-3 py-1 rounded-full text-sm font-medium hover:bg-white transition-colors"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>

          {filteredFleet.length === 0 && (
            <div className="text-center py-12">
              <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No vehicles found
              </h3>
              <p className="text-gray-500">
                Try selecting a different category to see available vehicles.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Fleet Categories Overview */}
      <section className="py-20 bg-luxury-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-luxury-navy mb-4">
              Vehicle Categories
            </h2>
            <p className="text-xl text-gray-600">
              Choose the perfect vehicle category for your transportation needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-card text-center group hover:shadow-elegant transition-shadow">
              <div className="w-16 h-16 bg-luxury-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-luxury-gold/20 transition-colors">
                <Car className="h-8 w-8 text-luxury-gold" />
              </div>
              <h3 className="text-xl font-bold text-luxury-navy mb-2">Saloon Cars</h3>
              <p className="text-gray-600 text-sm mb-4">4-seater vehicles perfect for city travel and airport transfers</p>
              <div className="text-sm text-luxury-gold font-semibold">From ₦15,000/day</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-card text-center group hover:shadow-elegant transition-shadow">
              <div className="w-16 h-16 bg-luxury-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-luxury-gold/20 transition-colors">
                <Car className="h-8 w-8 text-luxury-gold" />
              </div>
              <h3 className="text-xl font-bold text-luxury-navy mb-2">SUVs</h3>
              <p className="text-gray-600 text-sm mb-4">7-seater luxury vehicles for business and premium travel</p>
              <div className="text-sm text-luxury-gold font-semibold">From ₦25,000/day</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-card text-center group hover:shadow-elegant transition-shadow">
              <div className="w-16 h-16 bg-luxury-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-luxury-gold/20 transition-colors">
                <Users className="h-8 w-8 text-luxury-gold" />
              </div>
              <h3 className="text-xl font-bold text-luxury-navy mb-2">Hiace (14 seats)</h3>
              <p className="text-gray-600 text-sm mb-4">Mid-size buses perfect for group transportation and events</p>
              <div className="text-sm text-luxury-gold font-semibold">From ₦35,000/day</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-card text-center group hover:shadow-elegant transition-shadow">
              <div className="w-16 h-16 bg-luxury-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-luxury-gold/20 transition-colors">
                <Users className="h-8 w-8 text-luxury-gold" />
              </div>
              <h3 className="text-xl font-bold text-luxury-navy mb-2">Coaster (25 seats)</h3>
              <p className="text-gray-600 text-sm mb-4">Large buses ideal for corporate events and group travel</p>
              <div className="text-sm text-luxury-gold font-semibold">From ₦50,000/day</div>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle Detail Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedVehicle.image}
                alt={selectedVehicle.title}
                className="w-full h-64 object-cover rounded-t-xl"
              />
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                ×
              </button>
              <div className="absolute bottom-4 left-4 bg-luxury-gold text-white px-3 py-1 rounded-full text-sm font-semibold">
                {selectedVehicle.seats}
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-2xl font-bold text-luxury-navy mb-2">
                {selectedVehicle.title}
              </h3>
              <p className="text-luxury-gold font-medium mb-4">
                {selectedVehicle.category}
              </p>
              <p className="text-gray-600 mb-6">
                {selectedVehicle.description}
              </p>
              
              <h4 className="text-lg font-semibold text-luxury-navy mb-4">Features & Amenities</h4>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {selectedVehicle.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-600">
                    {feature.toLowerCase().includes('ac') && <Snowflake className="h-4 w-4 text-luxury-gold" />}
                    {feature.toLowerCase().includes('chauffeur') && <User className="h-4 w-4 text-luxury-gold" />}
                    {feature.toLowerCase().includes('seat') && <Users className="h-4 w-4 text-luxury-gold" />}
                    {!feature.toLowerCase().includes('ac') && 
                     !feature.toLowerCase().includes('chauffeur') && 
                     !feature.toLowerCase().includes('seat') && 
                     <Car className="h-4 w-4 text-luxury-gold" />}
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    handleFleetBooking(selectedVehicle.type);
                    closeModal();
                  }}
                  className="flex-1 btn-primary"
                >
                  Book This Vehicle
                </button>
                <button
                  onClick={closeModal}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-luxury-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Need Help Choosing?
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Our team is ready to help you select the perfect vehicle for your needs. 
            Contact us for personalized recommendations and quotes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/"
              className="btn-primary"
            >
              Book Online
            </a>
            <a
              href="/contact"
              className="btn-secondary"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}