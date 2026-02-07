import { Car, Users, Snowflake, User } from 'lucide-react';

interface FleetCardProps {
  image: string;
  title: string;
  description: string;
  features: string[];
  seats?: string;
  onBookNow: () => void;
}

export default function FleetCard({ 
  image, 
  title, 
  description, 
  features, 
  seats,
  onBookNow 
}: FleetCardProps) {
  return (
    <div className="fleet-card group">
      <div className="relative overflow-hidden rounded-t-xl h-64">
        <img
          src={image}
          alt={`${title} - Chauffeur-driven ${seats || 'vehicle'} rental by MRS Car Rental`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        {seats && (
          <div className="absolute top-4 right-4 bg-luxury-gold text-white px-3 py-1 rounded-full text-sm font-semibold">
            {seats}
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-luxury-navy mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        
        <div className="flex flex-wrap gap-3 mb-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-1 text-sm text-gray-600">
              {feature.toLowerCase().includes('ac') && <Snowflake className="h-4 w-4 text-luxury-gold" />}
              {feature.toLowerCase().includes('chauffeur') && <User className="h-4 w-4 text-luxury-gold" />}
              {feature.toLowerCase().includes('seat') && <Users className="h-4 w-4 text-luxury-gold" />}
              {!feature.toLowerCase().includes('ac') && 
               !feature.toLowerCase().includes('chauffeur') && 
               !feature.toLowerCase().includes('seat') && 
               <Car className="h-4 w-4 text-luxury-gold" />}
              <span>{feature}</span>
            </div>
          ))}
        </div>
        
        <button
          onClick={onBookNow}
          className="w-full btn-primary"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}