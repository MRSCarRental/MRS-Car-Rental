import { Users, Award, Clock, Shield, Car, MapPin } from 'lucide-react';
import ceoImage from '@/assets/ceo-rahaman-olawale.jpg';

const teamMembers = [
  {
    name: 'Mr. Rahaman Olawale',
    role: 'Founder & CEO',
    description: 'With more than 15 years of expertise in the transportation industry, our CEO, Mr. Wale, brings visionary leadership and an unwavering commitment to excellence, safety, and customer satisfaction.',
    image: ceoImage,
  },
  {
    name: 'Mrs. Grace Adebayo',
    role: 'Operations Manager',
    description: 'Grace ensures our daily operations run smoothly and maintains our high standards of customer service.',
    image: null,
  },
];

const achievements = [
  {
    icon: Award,
    title: 'Excellence in Service',
    description: 'Consistently rated 5 stars by our customers for exceptional service quality.',
  },
  {
    icon: Users,
    title: '1000+ Happy Clients',
    description: 'Served over 1000 satisfied customers across Lagos and Abuja.',
  },
  {
    icon: Car,
    title: 'Premium Fleet',
    description: 'Maintained a diverse fleet of luxury and comfort vehicles.',
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Round-the-clock service to meet all your transportation needs.',
  },
];

export default function About() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-luxury-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About <span className="text-luxury-gold">MRS Car Rental</span> – Car Hire in Lagos & Abuja
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Lagos and Abuja's premier car hire service and chauffeur-driven transportation company
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-luxury-navy mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                As Lagos and Abuja's premier car hire service, 
                MRS Car Rental was established with a simple yet powerful vision: 
                to provide unparalleled car rental in Lagos and Abuja that combines luxury, 
                reliability, and professionalism.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Since our inception, we have been committed to excellence in every 
                aspect of our service. From our meticulously maintained fleet to our 
                highly trained professional chauffeurs, we ensure that every journey 
                with us is not just a ride, but an experience.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                We understand that transportation is more than just getting from 
                point A to point B. It's about comfort, safety, punctuality, and 
                peace of mind. Whether you're traveling for business, attending a 
                special event, or need reliable airport transfers, MRS Car Rental 
                is your trusted partner in Nigeria's bustling cities.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-luxury-cream rounded-lg">
                  <div className="text-3xl font-bold text-luxury-gold mb-2">2018</div>
                  <div className="text-gray-600">Established</div>
                </div>
                <div className="text-center p-4 bg-luxury-cream rounded-lg">
                  <div className="text-3xl font-bold text-luxury-gold mb-2">24/7</div>
                  <div className="text-gray-600">Service</div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start gap-4 p-6 bg-white rounded-lg shadow-card">
                  <div className="w-12 h-12 bg-luxury-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <achievement.icon className="h-6 w-6 text-luxury-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-luxury-navy mb-2">
                      {achievement.title}
                    </h3>
                    <p className="text-gray-600">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-luxury-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="text-center p-8 bg-white rounded-xl shadow-card">
              <div className="w-16 h-16 bg-luxury-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-luxury-gold" />
              </div>
              <h3 className="text-2xl font-bold text-luxury-navy mb-4">Our Mission</h3>
              <p className="text-gray-700">
                To provide exceptional chauffeur-driven transportation services that 
                exceed our clients' expectations through professionalism, reliability, 
                and unwavering commitment to safety and comfort.
              </p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-xl shadow-card">
              <div className="w-16 h-16 bg-luxury-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="h-8 w-8 text-luxury-gold" />
              </div>
              <h3 className="text-2xl font-bold text-luxury-navy mb-4">Our Vision</h3>
              <p className="text-gray-700">
                To be Nigeria's leading luxury transportation company, recognized 
                for our exceptional service quality, innovative solutions, and 
                contribution to elevated travel experiences across the nation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-luxury-navy mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600">
              The dedicated professionals behind MRS Car Rental's success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={`Portrait of ${member.name}, ${member.role} at MRS Car Rental`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-luxury-gold/10 rounded-full flex items-center justify-center group-hover:bg-luxury-gold/20 transition-colors">
                      <Users className="h-16 w-16 text-luxury-gold" />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-luxury-navy mb-2">
                  {member.name}
                </h3>
                <p className="text-luxury-gold font-medium mb-4">
                  {member.role}
                </p>
                <p className="text-gray-600">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Snippet */}
      <section className="py-20 bg-luxury-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Book Our Car Hire Service Today
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Ready to experience the best car hire service in Lagos or Abuja? Contact us today to 
            discuss your requirements or book your next ride.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="flex flex-col items-center">
              <MapPin className="h-8 w-8 text-luxury-gold mb-4" />
              <h3 className="text-lg font-semibold mb-2">Our Location</h3>
              <p className="text-gray-300 text-center">
                2 Akin Adesola Street<br />
                Victoria Island, Lagos<br />
                Lagos 101241, Nigeria
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <Users className="h-8 w-8 text-luxury-gold mb-4" />
              <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
              <div className="text-gray-300 space-y-1">
                <p>0802 614 9390</p>
                <p>0803 364 7423</p>
                <p>info@mrscarrental.com</p>
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              <Clock className="h-8 w-8 text-luxury-gold mb-4" />
              <h3 className="text-lg font-semibold mb-2">Availability</h3>
              <p className="text-gray-300">
                24 hours a day<br />
                7 days a week<br />
                365 days a year
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="btn-primary"
            >
              Contact Us
            </a>
            <a
              href="/"
              className="btn-secondary"
            >
              Book a Ride
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}