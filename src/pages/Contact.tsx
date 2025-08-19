import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { 
  Mail, 
  MessageCircle, 
  Clock, 
  MapPin,
  Send,
  Phone,
  Globe,
  Headphones
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent Successfully!",
        description: "We'll get back to you within 24 hours.",
      });
      
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 2000);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help via email",
      contact: "myne7x@gmail.com",
      action: "mailto:myne7x@gmail.com",
      color: "text-neon-blue"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      description: "Chat with us directly",
      contact: "+92 309 6626615",
      action: "https://wa.me/923096626615",
      color: "text-neon-green"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Call us directly",
      contact: "+92 309 6626615",
      action: "tel:+923096626615",
      color: "text-neon-purple"
    },
    {
      icon: Globe,
      title: "Website",
      description: "Visit our main site",
      contact: "myne7x-store.com",
      action: "#",
      color: "text-neon-cyan"
    }
  ];

  const faqItems = [
    {
      question: "How quickly will I receive my digital product?",
      answer: "Digital products are delivered instantly after payment confirmation and admin approval."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept NayaPay payments and alternative payment methods with detailed verification."
    },
    {
      question: "Can I get a refund if I'm not satisfied?",
      answer: "We offer refunds within 7 days for valid reasons. Please check our refund policy for details."
    },
    {
      question: "How do I access my purchased products?",
      answer: "Once approved, you'll receive a notification with download links and lifetime access to your products."
    }
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        
        {/* Hero Section */}
        <div className="text-center mb-20 slide-in-up">
          <Badge className="mb-6 bg-primary/20 text-primary border-primary/50 pulse-neon">
            <Headphones className="w-4 h-4 mr-2" />
            24/7 Customer Support
          </Badge>
          <h1 className="text-5xl md:text-7xl font-orbitron font-black mb-6 text-glow">
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Have questions? Need support? We're here to help! Reach out to us through any 
            of the channels below and we'll get back to you as soon as possible.
          </p>
        </div>

        {/* Contact Methods */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <Card key={index} className="card-neon text-center group cursor-pointer slide-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-neon flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <method.icon className={`w-8 h-8 ${method.color}`} />
                  </div>
                  <CardTitle className="font-orbitron text-xl">{method.title}</CardTitle>
                  <CardDescription>{method.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <a 
                    href={method.action}
                    className="text-primary hover:text-primary/80 transition-colors font-semibold"
                    target={method.action.startsWith('http') ? '_blank' : undefined}
                    rel={method.action.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {method.contact}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <Card className="card-neon slide-in-left">
              <CardHeader>
                <CardTitle className="text-3xl font-orbitron text-glow flex items-center">
                  <Send className="w-8 h-8 mr-3 text-primary" />
                  Send us a Message
                </CardTitle>
                <CardDescription className="text-lg">
                  Fill out the form below and we'll respond within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        required
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        required
                        className="mt-2"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="What is this regarding?"
                      required
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us how we can help you..."
                      required
                      rows={6}
                      className="mt-2"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full btn-neon"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>Sending...</>
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info & Business Hours */}
            <div className="space-y-8">
              
              {/* Business Hours */}
              <Card className="card-neon slide-in-right">
                <CardHeader>
                  <CardTitle className="text-2xl font-orbitron text-glow flex items-center">
                    <Clock className="w-6 h-6 mr-3 text-primary" />
                    Business Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-border/20">
                    <span className="text-muted-foreground">Monday - Friday</span>
                    <Badge className="bg-gradient-neon text-primary-foreground border-0">
                      9:00 AM - 6:00 PM
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/20">
                    <span className="text-muted-foreground">Saturday</span>
                    <Badge variant="outline" className="border-primary/50">
                      10:00 AM - 4:00 PM
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Sunday</span>
                    <Badge variant="outline" className="border-muted">
                      Closed
                    </Badge>
                  </div>
                  <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                    <p className="text-sm text-primary font-semibold">
                      💡 Emergency support available 24/7 via WhatsApp
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Office Location */}
              <Card className="card-neon slide-in-right" style={{ animationDelay: '0.2s' }}>
                <CardHeader>
                  <CardTitle className="text-2xl font-orbitron text-glow flex items-center">
                    <MapPin className="w-6 h-6 mr-3 text-primary" />
                    Our Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">MYNE7X Store Headquarters</strong><br />
                      Digital Innovation Center<br />
                      Karachi, Pakistan
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-primary">
                      <MapPin className="w-4 h-4" />
                      <span>Available for virtual meetings worldwide</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-4 text-glow">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Quick answers to common questions about our products and services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {faqItems.map((item, index) => (
              <Card key={index} className="card-neon slide-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <CardTitle className="text-lg font-orbitron text-primary">
                    {item.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <Card className="card-neon bg-gradient-hero text-center">
            <CardContent className="p-12">
              <h2 className="text-4xl font-orbitron font-bold text-white mb-4">
                Still Have Questions?
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Don't hesitate to reach out! Our support team is always ready to help 
                you with any questions or concerns you might have.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="https://wa.me/923096626615" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-neon-green hover:bg-neon-green/90 text-white px-8 py-4 text-lg font-semibold">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    WhatsApp Now
                  </Button>
                </a>
                <a href="mailto:myne7x@gmail.com">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg">
                    <Mail className="mr-2 h-5 w-5" />
                    Email Us
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </section>

      </div>
    </div>
  );
};

export default Contact;