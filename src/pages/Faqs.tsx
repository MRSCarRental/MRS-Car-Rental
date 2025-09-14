import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const faqData = [
  {
    category: 'Booking & Reservations',
    questions: [
      {
        question: 'How do I book a ride with MRS Car Rental?',
        answer: 'You can book a ride through our online booking form on the website, call us at 0802 614 9390, or message us on WhatsApp. We require advance booking to ensure vehicle availability.',
      },
      {
        question: 'How far in advance should I book?',
        answer: 'We recommend booking at least 24 hours in advance, especially for airport transfers and special events. However, we do accept same-day bookings subject to availability.',
      },
      {
        question: 'Can I modify or cancel my booking?',
        answer: 'Yes, you can modify or cancel your booking up to 2 hours before your scheduled pickup time. Please contact us immediately if you need to make changes.',
      },
      {
        question: 'Do you provide instant booking confirmation?',
        answer: 'Yes, we provide booking confirmation within 30 minutes of receiving your request. You will receive details about your driver and vehicle before your scheduled pickup.',
      },
    ],
  },
  {
    category: 'Pricing & Payment',
    questions: [
      {
        question: 'How is pricing calculated?',
        answer: 'Pricing is based on vehicle type, distance, duration, and time of service. Airport transfers have fixed rates, while hourly bookings are charged accordingly. Contact us for a detailed quote.',
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept cash, bank transfers, and mobile payments. Payment can be made before or after the service, based on your preference and our agreement.',
      },
      {
        question: 'Are there additional charges for waiting time?',
        answer: 'We provide 15 minutes of complimentary waiting time for pickups. After that, waiting charges may apply at ₦1,000 per hour or fraction thereof.',
      },
      {
        question: 'Do you offer corporate rates?',
        answer: 'Yes, we offer special rates for corporate clients and regular bookings. Contact us to discuss corporate packages and monthly rates.',
      },
    ],
  },
  {
    category: 'Service Details',
    questions: [
      {
        question: 'Are your drivers professional and licensed?',
        answer: 'Yes, all our drivers are professionally trained, licensed, and experienced. They undergo regular training and background checks to ensure your safety and comfort.',
      },
      {
        question: 'What areas do you serve?',
        answer: 'We serve Lagos and Abuja, including airports, hotels, business districts, and residential areas. We also provide inter-city services between Lagos and Abuja.',
      },
      {
        question: 'Are your vehicles insured?',
        answer: 'Yes, all our vehicles are fully insured and regularly maintained. We prioritize safety and ensure all vehicles meet the highest standards.',
      },
      {
        question: 'Do you provide child car seats?',
        answer: 'Yes, we can provide child car seats upon request. Please mention this requirement when booking so we can make appropriate arrangements.',
      },
    ],
  },
  {
    category: 'Special Services',
    questions: [
      {
        question: 'Do you provide airport meet and greet service?',
        answer: 'Yes, our drivers can meet you at the arrival hall with a name board for airport pickups. This service is included in our airport transfer packages.',
      },
      {
        question: 'Can you handle group transportation for events?',
        answer: 'Absolutely! We have Hiace (14 seats) and Coaster (30+ seats) buses perfect for group transportation, weddings, corporate events, and tours.',
      },
      {
        question: 'Do you provide wedding car decoration?',
        answer: 'Yes, we offer wedding car decoration services. Our luxury vehicles can be decorated according to your wedding theme and preferences.',
      },
      {
        question: 'Are you available 24/7?',
        answer: 'Yes, MRS Car Rental operates 24 hours a day, 7 days a week. You can book our services at any time, including weekends and holidays.',
      },
    ],
  },
  {
    category: 'Safety & Policies',
    questions: [
      {
        question: 'What safety measures do you have in place?',
        answer: 'We maintain strict safety protocols including regular vehicle maintenance, professional driver training, GPS tracking, and comprehensive insurance coverage.',
      },
      {
        question: 'What is your policy on smoking and alcohol?',
        answer: 'Smoking is strictly prohibited in all our vehicles. Passengers under the influence of alcohol may be refused service at the driver\'s discretion for safety reasons.',
      },
      {
        question: 'Can I track my ride?',
        answer: 'Yes, we provide real-time tracking for your peace of mind. You will receive your driver\'s contact details and can track the vehicle location.',
      },
      {
        question: 'What happens in case of vehicle breakdown?',
        answer: 'In the unlikely event of a breakdown, we will immediately dispatch a replacement vehicle. We maintain backup vehicles to ensure minimal disruption to your journey.',
      },
    ],
  },
];

export default function Faqs() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (categoryIndex: number, questionIndex: number) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-luxury-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Frequently Asked <span className="text-luxury-gold">Questions</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Find answers to common questions about our transportation services
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-luxury-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="h-8 w-8 text-luxury-gold" />
            </div>
            <h2 className="text-3xl font-bold text-luxury-navy mb-4">
              How can we help you?
            </h2>
            <p className="text-lg text-gray-600">
              Browse through our comprehensive FAQ sections or contact us directly 
              if you can't find what you're looking for.
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-8">
            {faqData.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white rounded-xl shadow-card overflow-hidden">
                <div className="bg-luxury-cream px-6 py-4 border-b border-luxury-gold/20">
                  <h3 className="text-xl font-bold text-luxury-navy">
                    {category.category}
                  </h3>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {category.questions.map((item, questionIndex) => {
                    const isOpen = openItems[`${categoryIndex}-${questionIndex}`];
                    
                    return (
                      <div key={questionIndex} className="p-6">
                        <button
                          onClick={() => toggleItem(categoryIndex, questionIndex)}
                          className="w-full flex items-center justify-between text-left group"
                        >
                          <h4 className="text-lg font-semibold text-luxury-navy group-hover:text-luxury-gold transition-colors pr-4">
                            {item.question}
                          </h4>
                          <div className="flex-shrink-0">
                            {isOpen ? (
                              <ChevronUp className="h-5 w-5 text-luxury-gold" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-400 group-hover:text-luxury-gold transition-colors" />
                            )}
                          </div>
                        </button>
                        
                        {isOpen && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-gray-600 leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-16 text-center">
            <div className="bg-luxury-cream rounded-xl p-8">
              <h3 className="text-2xl font-bold text-luxury-navy mb-4">
                Still have questions?
              </h3>
              <p className="text-gray-600 mb-6">
                Can't find the answer you're looking for? Our friendly customer 
                service team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+2348026149390"
                  className="btn-primary"
                >
                  Call Us: 0802 614 9390
                </a>
                <a
                  href="https://wa.me/2348026149390"
                  className="btn-outline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp Us
                </a>
                <a
                  href="/contact"
                  className="btn-outline"
                >
                  Contact Form
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-20 bg-luxury-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Book Your Ride?
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Now that you have all the information, let's get you moving with 
            our premium transportation services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/"
              className="btn-primary"
            >
              Book Online Now
            </a>
            <a
              href="/inventory"
              className="btn-secondary"
            >
              View Our Fleet
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}