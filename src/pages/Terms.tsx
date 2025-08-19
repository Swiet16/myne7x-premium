import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  Calendar,
  Mail
} from 'lucide-react';

const Terms = () => {
  const sections = [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      content: `By accessing and using MYNE7X Store ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`
    },
    {
      id: "definitions",
      title: "2. Definitions",
      content: `
        • "Service" refers to MYNE7X Store platform and all associated services
        • "User" refers to any individual who accesses or uses our Service
        • "Digital Products" refers to downloadable files, software, templates, and other digital content
        • "Admin" refers to authorized personnel managing the platform
        • "Payment Request" refers to the process of requesting access to paid products
      `
    },
    {
      id: "use-license",
      title: "3. Use License",
      content: `
        Permission is granted to temporarily download one copy of the materials on MYNE7X Store for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
        
        • Modify or copy the materials
        • Use the materials for any commercial purpose or for any public display
        • Attempt to reverse engineer any software contained on the website
        • Remove any copyright or other proprietary notations from the materials
        
        This license shall automatically terminate if you violate any of these restrictions and may be terminated by us at any time.
      `
    },
    {
      id: "digital-products",
      title: "4. Digital Products & Services",
      content: `
        • All digital products are delivered electronically upon payment confirmation and admin approval
        • Products are licensed for personal use unless otherwise specified
        • Redistribution or resale of digital products is strictly prohibited
        • We reserve the right to modify or discontinue products at any time
        • Lifetime access is provided to approved purchases
        • Technical support is available for 30 days after purchase
      `
    },
    {
      id: "payment-policy",
      title: "5. Payment Policy",
      content: `
        • Payments are processed through NayaPay (+923184712251) or approved alternative methods
        • Payment proof (screenshot or transaction ID) is required for verification
        • All payments are subject to admin approval before product access is granted
        • Alternative payment methods require detailed verification (minimum 15 lines)
        • We reserve the right to reject any payment request
        • Refunds are processed according to our Refund Policy
      `
    },
    {
      id: "user-accounts",
      title: "6. User Accounts",
      content: `
        • You are responsible for maintaining the confidentiality of your account
        • You agree to accept responsibility for all activities under your account
        • You must provide accurate and complete information during registration
        • We reserve the right to terminate accounts that violate these terms
        • Account sharing is prohibited
        • Contact information must be kept current for payment verification
      `
    },
    {
      id: "prohibited-uses",
      title: "7. Prohibited Uses",
      content: `
        You may not use our Service:
        
        • For any unlawful purpose or to solicit others to unlawful acts
        • To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances
        • To transmit or procure the sending of any unsolicited or unauthorized advertising or promotional material
        • To impersonate or attempt to impersonate the company, employees, another user, or any other person
        • To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service
        • To upload, post, or transmit any content that infringes upon intellectual property rights
      `
    },
    {
      id: "intellectual-property",
      title: "8. Intellectual Property Rights",
      content: `
        • All content on MYNE7X Store is protected by copyright and other intellectual property laws
        • Digital products retain their original licensing terms as specified by creators
        • The MYNE7X Store brand, logo, and platform design are proprietary to us
        • Users retain rights to their personal data and uploaded content
        • We respect intellectual property rights and expect users to do the same
      `
    },
    {
      id: "disclaimers",
      title: "9. Disclaimers",
      content: `
        • The materials on MYNE7X Store are provided on an 'as is' basis
        • We make no warranties, expressed or implied, regarding the Service
        • We do not warrant that the service will be uninterrupted or error-free
        • We are not responsible for the content or quality of third-party products
        • Use of the Service is at your own risk
        • We disclaim all warranties and conditions with regard to the Service
      `
    },
    {
      id: "limitations",
      title: "10. Limitations of Liability",
      content: `
        In no event shall MYNE7X Store or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the Service, even if MYNE7X Store or an authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.
      `
    },
    {
      id: "privacy",
      title: "11. Privacy Policy",
      content: `
        Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our Service. By using our Service, you agree to the collection and use of information in accordance with our Privacy Policy.
      `
    },
    {
      id: "modifications",
      title: "12. Modifications to Terms",
      content: `
        We reserve the right to revise these Terms of Service at any time without notice. By continuing to use the Service after changes are made, you agree to be bound by the revised terms. We encourage you to review these terms periodically for any changes.
      `
    },
    {
      id: "termination",
      title: "13. Termination",
      content: `
        We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever including, without limitation, if you breach the Terms of Service.
      `
    },
    {
      id: "governing-law",
      title: "14. Governing Law",
      content: `
        These Terms shall be interpreted and governed by the laws of Pakistan. Any disputes arising from these terms shall be subject to the jurisdiction of Pakistani courts.
      `
    },
    {
      id: "contact",
      title: "15. Contact Information",
      content: `
        If you have any questions about these Terms of Service, please contact us at:
        
        • Email: myne7x@gmail.com
        • WhatsApp: +92 309 6626615
        • Website: MYNE7X Store
        
        We aim to respond to all inquiries within 24 hours.
      `
    }
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16 slide-in-up">
          <Badge className="mb-6 bg-primary/20 text-primary border-primary/50 pulse-neon">
            <FileText className="w-4 h-4 mr-2" />
            Legal Documentation
          </Badge>
          <h1 className="text-5xl md:text-7xl font-orbitron font-black mb-6 text-glow">
            Terms & Conditions
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Please read these Terms and Conditions carefully before using MYNE7X Store. 
            These terms govern your use of our platform and services.
          </p>
        </div>

        {/* Last Updated */}
        <div className="mb-12">
          <Card className="card-neon max-w-2xl mx-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-x-4 text-center">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-semibold">Last Updated</p>
                  <p className="text-sm text-muted-foreground">January 18, 2025</p>
                </div>
                <div className="border-l border-border h-8"></div>
                <div>
                  <p className="font-semibold">Effective Date</p>
                  <p className="text-sm text-muted-foreground">January 18, 2025</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Important Notice */}
        <div className="mb-12">
          <Card className="card-neon border-orange-500/50 bg-orange-500/5">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-400">
                <AlertTriangle className="w-6 h-6 mr-3" />
                Important Notice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                By creating an account or using any part of MYNE7X Store, you acknowledge that 
                you have read, understood, and agree to be bound by these Terms and Conditions. 
                If you do not agree with any part of these terms, you must not use our services.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Terms Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <Card className="card-neon sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg font-orbitron">Table of Contents</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <nav className="space-y-2">
                    {sections.map((section, index) => (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        className="block text-sm text-muted-foreground hover:text-primary transition-colors py-2 border-b border-border/20 last:border-0"
                      >
                        {section.title}
                      </a>
                    ))}
                  </nav>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Terms Sections */}
          <div className="lg:col-span-3 space-y-8">
            {sections.map((section, index) => (
              <Card key={section.id} id={section.id} className="card-neon slide-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                <CardHeader>
                  <CardTitle className="text-xl font-orbitron text-primary">
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-invert max-w-none">
                    <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {section.content}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Agreement Section */}
        <div className="mt-16">
          <Card className="card-neon bg-gradient-hero">
            <CardContent className="p-12 text-center">
              <div className="max-w-4xl mx-auto">
                <CheckCircle className="w-16 h-16 mx-auto mb-6 text-white" />
                <h2 className="text-4xl font-orbitron font-bold text-white mb-4">
                  Agreement Acknowledgment
                </h2>
                <p className="text-xl text-white/80 mb-8">
                  By using MYNE7X Store, you confirm that you have read, understood, 
                  and agree to be legally bound by these Terms and Conditions.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Mail className="w-5 h-5 mr-2" />
                      Questions about these Terms?
                    </h3>
                    <p className="text-white/80 mb-4">
                      If you have any questions or concerns about these Terms and Conditions, 
                      please don't hesitate to contact us.
                    </p>
                    <div className="space-y-2 text-sm text-white/70">
                      <p>📧 Email: myne7x@gmail.com</p>
                      <p>📱 WhatsApp: +92 309 6626615</p>
                    </div>
                  </div>
                  
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      Your Rights & Protection
                    </h3>
                    <p className="text-white/80 mb-4">
                      We are committed to protecting your rights and providing 
                      transparent terms that protect both parties.
                    </p>
                    <div className="space-y-2 text-sm text-white/70">
                      <p>✓ Data protection compliance</p>
                      <p>✓ Fair refund policy</p>
                      <p>✓ Transparent pricing</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default Terms;