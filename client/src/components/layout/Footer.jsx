import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-surface border-t border-bg mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-serif text-lg mb-4">AURELIA</h4>
            <p className="text-sm text-text-muted leading-relaxed">
              Wear the Warmth of Gold. Crafted with care, designed for life.
            </p>
          </div>
          <div>
            <h5 className="text-sm font-medium mb-3">Shop</h5>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-sm text-text-muted hover:text-text transition-colors">All Jewelry</Link></li>
              <li><Link to="/products?category=rings" className="text-sm text-text-muted hover:text-text transition-colors">Rings</Link></li>
              <li><Link to="/products?category=necklaces" className="text-sm text-text-muted hover:text-text transition-colors">Necklaces</Link></li>
              <li><Link to="/products?category=earrings" className="text-sm text-text-muted hover:text-text transition-colors">Earrings</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-sm font-medium mb-3">Support</h5>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-sm text-text-muted hover:text-text transition-colors">Contact Us</Link></li>
              <li><Link to="/size-guide" className="text-sm text-text-muted hover:text-text transition-colors">Size Guide</Link></li>
              <li><Link to="/shipping-returns" className="text-sm text-text-muted hover:text-text transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/faq" className="text-sm text-text-muted hover:text-text transition-colors">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-sm font-medium mb-3">Company</h5>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-text-muted hover:text-text transition-colors">About Us</Link></li>
              <li><Link to="/care-guide" className="text-sm text-text-muted hover:text-text transition-colors">Jewelry Care</Link></li>
              <li><Link to="/privacy" className="text-sm text-text-muted hover:text-text transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-text-muted hover:text-text transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-bg mt-8 pt-6 text-center text-xs text-text-muted">
          &copy; {new Date().getFullYear()} Aurelia Jewels. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
