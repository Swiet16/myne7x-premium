import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Mail, 
  MessageCircle, 
  Heart, 
  ArrowUp,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-card/50 backdrop-blur-sm border-t border-border/20 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-orbitron font-bold text-glow mb-2">
                MYNE7X
                <span className="block text-primary">STORE</span>
              </h3>
              <p className="text-muted-foreground">
                Premium digital products for the modern world
              </p>
            </div>
            <div className="flex space-x-3">
              <Button size="sm" variant="outline" className="p-2 border-primary/50 hover:bg-primary/10">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="p-2 border-primary/50 hover:bg-primary/10">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="p-2 border-primary/50 hover:bg-primary/10">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="p-2 border-primary/50 hover:bg-primary/10">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-orbitron font-semibold mb-4 text-primary">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-muted-foreground hover:text-primary transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-muted-foreground hover:text-primary transition-colors">
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-orbitron font-semibold mb-4 text-primary">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/refund" className="text-muted-foreground hover:text-primary transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-orbitron font-semibold mb-4 text-primary">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary" />
                <a 
                  href="mailto:myne7x@gmail.com" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  myne7x@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MessageCircle className="h-4 w-4 text-neon-green" />
                <a 
                  href="https://wa.me/923096626615" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-neon-green transition-colors"
                >
                  +92 309 6626615
                </a>
              </div>
              <Badge className="bg-gradient-neon text-primary-foreground border-0 mt-4">
                24/7 Support Available
              </Badge>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 text-muted-foreground mb-4 md:mb-0">
            <span>© 2025 Myne7x-Store. Made with</span>
            <Heart className="h-4 w-4 text-red-500 animate-pulse" />
            <span>All rights reserved.</span>
          </div>
          
          <Button 
            onClick={scrollToTop}
            size="sm" 
            className="btn-neon p-2"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;