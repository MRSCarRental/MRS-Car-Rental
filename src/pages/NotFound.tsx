import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background pt-20">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-24 h-24 bg-luxury-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl font-bold text-luxury-gold">404</span>
        </div>
        <h1 className="text-4xl font-bold text-luxury-navy mb-4">Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <div className="space-y-4">
          <a 
            href="/" 
            className="btn-primary inline-block"
          >
            Return to Home
          </a>
          <div className="text-sm text-gray-500">
            <p>Need help? <a href="/contact" className="text-luxury-gold hover:underline">Contact us</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
