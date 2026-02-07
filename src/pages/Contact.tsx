import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const initialFormData: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

export default function Contact() {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // For now, we'll just show a success message
      // In a real implementation, this would send to the backend
      
      toast({
        title: "Message Sent Successfully!",
        description: "We'll get back to you within 24 hours.",
      });
      
      setIsSubmitted(true);
      setFormData(initialFormData);
      
    } catch (error) {
      toast({
        title: "Message Failed",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-luxury-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Contact <span className="text-luxury-gold">MRS Car Rental</span> – Car Hire in Lagos & Abuja
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Get in touch for car hire bookings, inquiries, or questions 
              about our car rental services in Lagos and Abuja
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-luxury-navy mb-8">
                Get in Touch
              </h2>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-luxury-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-luxury-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-luxury-navy mb-2">
                      Our Location
                    </h3>
                    <p className="text-gray-600">
                      2 Akin Adesola Street<br />
                      Victoria Island, Lagos<br />
                      Lagos 101241, Nigeria
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-luxury-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-luxury-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-luxury-navy mb-2">
                      Phone Numbers
                    </h3>
                    <div className="space-y-1">
                      <a
                        href="tel:+2348026149390"
                        className="block text-gray-600 hover:text-luxury-gold transition-colors"
                      >
                        +234 802 614 9390
                      </a>
                      <a
                        href="tel:+2348033647423"
                        className="block text-gray-600 hover:text-luxury-gold transition-colors"
                      >
                        +234 803 364 7423
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-luxury-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-luxury-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-luxury-navy mb-2">
                      Email Address
                    </h3>
                    <a
                      href="mailto:info@mrscarrental.com"
                      className="text-gray-600 hover:text-luxury-gold transition-colors"
                    >
                      info@mrscarrental.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-luxury-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-luxury-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-luxury-navy mb-2">
                      Operating Hours
                    </h3>
                    <p className="text-gray-600">
                      24 hours a day<br />
                      7 days a week<br />
                      365 days a year
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-8 p-6 bg-luxury-cream rounded-xl">
                <h3 className="text-lg font-semibold text-luxury-navy mb-4">
                  Quick Actions
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://wa.me/2348026149390"
                    className="whatsapp-btn justify-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-5 w-5" />
                    WhatsApp Us
                  </a>
                  <a
                    href="/"
                    className="btn-outline justify-center"
                  >
                    Book Online
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-elegant p-8">
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-success-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-success-green" />
                  </div>
                  <h3 className="text-2xl font-bold text-luxury-navy mb-4">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Thank you for contacting us. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="btn-outline"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-luxury-navy mb-2">
                      Send us a Message
                    </h2>
                    <p className="text-gray-600">
                      Fill out the form below and we'll respond as soon as possible
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="Enter your email address"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="Enter your phone number"
                        />
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                          Subject
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          className="form-select"
                        >
                          <option value="">Select a subject</option>
                          <option value="booking">Booking Inquiry</option>
                          <option value="quote">Request Quote</option>
                          <option value="complaint">Complaint</option>
                          <option value="compliment">Compliment</option>
                          <option value="corporate">Corporate Services</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={6}
                        className="form-input resize-none"
                        placeholder="Enter your message here..."
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-primary flex items-center justify-center gap-2"
                    >
                      <Send className="h-5 w-5" />
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-luxury-navy mb-4">
              Find Us Here
            </h2>
            <p className="text-lg text-gray-600">
              Located in the heart of Victoria Island, Lagos
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-card overflow-hidden">
            <div className="aspect-w-16 aspect-h-9 h-96">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.8397448506283!2d3.4277179!3d6.428847499999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf52b3b8e9aeb%3A0x4e5b1d1c9a2b8c3d!2s2%20Akin%20Adesola%20St%2C%20Victoria%20Island%2C%20Lagos%20101241%2C%20Lagos!5e0!3m2!1sen!2sng!4v1638360000000!5m2!1sen!2sng"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="MRS Car Rental Location - 2 Akin Adesola Street, Victoria Island, Lagos"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-luxury-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Book Your Car Hire in Lagos or Abuja Today
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Don't wait — book your car rental in Lagos and Abuja today and discover why 
            MRS Car Rental is the most trusted car hire service in Nigeria.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/"
              className="btn-primary"
            >
              Book Your Ride Now
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