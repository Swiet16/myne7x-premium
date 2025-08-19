import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Search, HelpCircle, MessageCircle, Mail, Phone } from 'lucide-react';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const faqs = [
    {
      question: "How do I purchase a digital product?",
      answer: "To purchase a digital product: 1) Browse our products page, 2) Click 'Request Access' on your desired product, 3) Fill out the payment request form with your payment details, 4) Submit the form and wait for admin approval (usually within 24 hours), 5) Once approved, you'll get access to download the product."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept various payment methods including bank transfers, mobile money, cryptocurrency, and other payment options. You can specify your preferred method when submitting a payment request."
    },
    {
      question: "How long does it take to get access after payment?",
      answer: "Payment requests are typically reviewed and approved within 24 hours. You'll receive a notification once your payment is verified and access is granted."
    },
    {
      question: "Can I get a refund if I'm not satisfied?",
      answer: "Due to the digital nature of our products, all sales are final. However, if you experience technical issues or the product doesn't match its description, please contact our support team for assistance."
    },
    {
      question: "Are there any free products available?",
      answer: "Yes! We offer some free digital products. These will be clearly marked with a $0 price and can be accessed immediately after creating an account."
    },
    {
      question: "How do I download my purchased products?",
      answer: "Once your payment is approved, you'll see a 'Download' button on the product page. You can also access all your purchased products from your profile page."
    },
    {
      question: "What file formats do you offer?",
      answer: "We offer various file formats depending on the product type - including PDF, ZIP archives, software installers, templates, and more. The format is usually specified in the product description."
    },
    {
      question: "Can I re-download a product I've already purchased?",
      answer: "Yes! Once you've purchased a product, you have lifetime access to download it. Simply log into your account and visit the product page or your profile to access your downloads."
    },
    {
      question: "Do you offer customer support?",
      answer: "Absolutely! We provide customer support via WhatsApp (+923096626615), email (myne7x@gmail.com), and through our contact form. Our team is here to help with any questions or issues."
    },
    {
      question: "How do I create an account?",
      answer: "Click the 'Sign In' button and choose 'Sign Up' to create a new account. You can register using your email address. Account creation is free and gives you access to browse and purchase our digital products."
    },
    {
      question: "Is my personal information secure?",
      answer: "Yes, we take your privacy seriously. We use secure authentication and encryption to protect your personal information. We only collect necessary information for processing your orders and providing support."
    },
    {
      question: "Can I suggest new products or features?",
      answer: "We love hearing from our customers! You can suggest new products or features by contacting us through WhatsApp, email, or our contact form. We consider all feedback for future updates."
    }
  ];

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background/50 via-background to-background/50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-neon-blue/10 rounded-full mb-6">
              <HelpCircle className="h-8 w-8 text-neon-blue" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-glow">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about our digital products and services
            </p>
          </div>

          {/* Search */}
          <Card className="card-neon mb-8">
            <CardContent className="pt-6">
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* FAQ Accordion */}
          <Card className="card-neon mb-8">
            <CardHeader>
              <CardTitle className="text-glow-secondary">Questions & Answers</CardTitle>
              <CardDescription>
                {filteredFAQs.length} {filteredFAQs.length === 1 ? 'question' : 'questions'} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredFAQs.length > 0 ? (
                <Accordion type="single" collapsible className="space-y-2">
                  {filteredFAQs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                      <AccordionTrigger className="text-left hover:no-underline">
                        <span className="font-medium">{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pt-2 pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-8">
                  <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No FAQs Found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search terms or browse all questions above.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card className="card-neon">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-glow">
                <MessageCircle className="h-5 w-5" />
                Still Need Help?
              </CardTitle>
              <CardDescription>
                Can't find what you're looking for? Get in touch with our support team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="h-auto flex-col gap-2 p-6 hover-scale"
                  onClick={() => window.open('https://wa.me/923096626615', '_blank')}
                >
                  <Phone className="h-6 w-6 text-neon-green" />
                  <div className="text-center">
                    <div className="font-semibold">WhatsApp</div>
                    <div className="text-xs text-muted-foreground">+923096626615</div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-auto flex-col gap-2 p-6 hover-scale"
                  onClick={() => window.location.href = 'mailto:myne7x@gmail.com'}
                >
                  <Mail className="h-6 w-6 text-neon-blue" />
                  <div className="text-center">
                    <div className="font-semibold">Email</div>
                    <div className="text-xs text-muted-foreground">myne7x@gmail.com</div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-auto flex-col gap-2 p-6 hover-scale"
                  onClick={() => window.location.href = '/contact'}
                >
                  <MessageCircle className="h-6 w-6 text-neon-purple" />
                  <div className="text-center">
                    <div className="font-semibold">Contact Form</div>
                    <div className="text-xs text-muted-foreground">Send us a message</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FAQ;