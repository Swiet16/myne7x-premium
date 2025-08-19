import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Shield, 
  Lock, 
  Eye, 
  Database,
  Calendar,
  Mail,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const Privacy = () => {
  const sections = [
    {
      id: "introduction",
      title: "1. Introduction",
      content: `
        Welcome to MYNE7X Store. We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
        
        This policy applies to all information collected or submitted on the MYNE7X Store website and services. By using our Service, you agree to the collection and use of information in accordance with this policy.
      `
    },
    {
      id: "information-we-collect",
      title: "2. Information We Collect",
      content: `
        We collect several types of information for various purposes to provide and improve our Service:
        
        Personal Information:
        • Name and email address (required for account creation)
        • Contact information (WhatsApp number or Telegram ID for payment verification)
        • Profile information you choose to provide
        
        Payment Information:
        • Payment screenshots and transaction IDs
        • Alternative payment method details when provided
        • Payment history and status
        
        Technical Information:
        • IP address, browser type, and version
        • Device information and operating system
        • Pages visited, time spent, and click data
        • Cookies and similar tracking technologies
        
        Communication Data:
        • Messages sent through our platform
        • Support requests and correspondence
        • Notifications and preferences
      `
    },
    {
      id: "how-we-use-information",
      title: "3. How We Use Your Information",
      content: `
        We use the collected information for various purposes:
        
        Service Provision:
        • To create and manage your account
        • To process payment requests and verify transactions
        • To provide access to purchased digital products
        • To send notifications about your purchases and account
        
        Communication:
        • To respond to your inquiries and support requests
        • To send important updates about our services
        • To notify you about changes to our terms or policies
        
        Improvement and Analytics:
        • To understand how our Service is used
        • To improve user experience and platform functionality
        • To develop new features and services
        • To conduct research and analytics
        
        Security and Legal:
        • To detect and prevent fraud
        • To enforce our terms and conditions
        • To comply with legal obligations
        • To protect our rights and the rights of others
      `
    },
    {
      id: "information-sharing",
      title: "4. Information Sharing and Disclosure",
      content: `
        We do not sell, trade, or otherwise transfer your personal information to third parties, except in the following circumstances:
        
        Service Providers:
        • Payment processors (NayaPay) for transaction verification
        • Cloud storage providers for secure data storage
        • Email service providers for communication
        • Analytics providers for service improvement
        
        Legal Requirements:
        • When required by law or legal process
        • To protect our rights, property, or safety
        • To protect the rights, property, or safety of others
        • To prevent or investigate possible wrongdoing
        
        Business Transfers:
        • In the event of a merger, acquisition, or asset sale
        • During bankruptcy or similar proceedings
        
        With Your Consent:
        • When you explicitly consent to sharing
        • For purposes you specifically authorize
      `
    },
    {
      id: "data-security",
      title: "5. Data Security",
      content: `
        We implement appropriate technical and organizational measures to protect your personal information:
        
        Technical Safeguards:
        • Encryption of sensitive data in transit and at rest
        • Secure servers with access controls
        • Regular security audits and updates
        • Firewall and intrusion detection systems
        
        Organizational Measures:
        • Limited access to personal data on a need-to-know basis
        • Regular staff training on data protection
        • Incident response procedures
        • Regular review of security practices
        
        While we strive to protect your personal information, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security but commit to taking all reasonable measures to protect your data.
      `
    },
    {
      id: "data-retention",
      title: "6. Data Retention",
      content: `
        We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy:
        
        Account Information:
        • Retained while your account is active
        • May be retained for up to 2 years after account deletion for legal purposes
        
        Payment Data:
        • Transaction records retained for 7 years for accounting and legal requirements
        • Payment screenshots deleted after 1 year unless needed for disputes
        
        Communication Data:
        • Support messages retained for 2 years
        • Marketing preferences retained until you opt out
        
        Technical Data:
        • Log files typically retained for 90 days
        • Analytics data aggregated and anonymized after 1 year
        
        You may request deletion of your personal data at any time, subject to legal retention requirements.
      `
    },
    {
      id: "your-rights",
      title: "7. Your Privacy Rights",
      content: `
        You have several rights regarding your personal information:
        
        Access Rights:
        • Request copies of your personal data
        • Ask about how your data is being processed
        • Receive information about data sharing
        
        Correction Rights:
        • Update or correct inaccurate information
        • Complete incomplete data
        • Modify your preferences
        
        Deletion Rights:
        • Request deletion of your personal data
        • Right to be forgotten (subject to legal requirements)
        • Account termination and data removal
        
        Control Rights:
        • Opt out of marketing communications
        • Manage cookie preferences
        • Control notification settings
        
        Portability Rights:
        • Request your data in a portable format
        • Transfer data to another service
        
        To exercise these rights, contact us at myne7x@gmail.com
      `
    },
    {
      id: "cookies",
      title: "8. Cookies and Tracking",
      content: `
        We use cookies and similar technologies to enhance your experience:
        
        Essential Cookies:
        • Required for basic website functionality
        • Authentication and security
        • Cannot be disabled
        
        Analytics Cookies:
        • Help us understand how the site is used
        • Improve user experience
        • Measure website performance
        
        Preference Cookies:
        • Remember your settings and preferences
        • Customize your experience
        • Language and theme preferences
        
        You can control cookies through your browser settings. However, disabling certain cookies may affect website functionality.
      `
    },
    {
      id: "children-privacy",
      title: "9. Children's Privacy",
      content: `
        Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
        
        If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately. We will take steps to remove such information from our servers.
        
        If you are between 13 and 18 years old, you may only use our Service with the involvement and consent of a parent or guardian.
      `
    },
    {
      id: "international-transfers",
      title: "10. International Data Transfers",
      content: `
        Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws.
        
        When we transfer your personal data internationally, we ensure appropriate safeguards are in place:
        • Standard contractual clauses
        • Adequacy decisions by relevant authorities
        • Your explicit consent when required
        
        By using our Service, you consent to the transfer of your information to countries outside your residence.
      `
    },
    {
      id: "policy-changes",
      title: "11. Changes to This Privacy Policy",
      content: `
        We may update this Privacy Policy from time to time. When we make changes:
        
        • We will post the new Privacy Policy on this page
        • We will update the "Last Updated" date
        • For significant changes, we will notify you via email or platform notification
        • Continued use of the Service after changes constitutes acceptance
        
        We encourage you to review this Privacy Policy periodically for any changes.
      `
    },
    {
      id: "contact-us",
      title: "12. Contact Information",
      content: `
        If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
        
        Data Protection Officer:
        Email: myne7x@gmail.com
        WhatsApp: +92 309 6626615
        
        Mailing Address:
        MYNE7X Store
        Digital Innovation Center
        Karachi, Pakistan
        
        We aim to respond to all privacy inquiries within 30 days.
        
        If you are not satisfied with our response, you have the right to lodge a complaint with your local data protection authority.
      `
    }
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16 slide-in-up">
          <Badge className="mb-6 bg-primary/20 text-primary border-primary/50 pulse-neon">
            <Shield className="w-4 h-4 mr-2" />
            Privacy & Data Protection
          </Badge>
          <h1 className="text-5xl md:text-7xl font-orbitron font-black mb-6 text-glow">
            Privacy Policy
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Your privacy matters to us. This policy explains how we collect, use, and protect 
            your personal information when you use MYNE7X Store.
          </p>
        </div>

        {/* Privacy Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="card-neon text-center slide-in-left">
            <CardHeader>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-neon flex items-center justify-center">
                <Lock className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="font-orbitron">Data Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We use industry-standard encryption and security measures to protect your data
              </p>
            </CardContent>
          </Card>

          <Card className="card-neon text-center slide-in-up">
            <CardHeader>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-neon-secondary flex items-center justify-center">
                <Eye className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="font-orbitron">Transparency</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Clear and honest communication about how we collect and use your information
              </p>
            </CardContent>
          </Card>

          <Card className="card-neon text-center slide-in-right">
            <CardHeader>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-neon-accent flex items-center justify-center">
                <Database className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="font-orbitron">Your Control</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                You have full control over your data with rights to access, modify, or delete
              </p>
            </CardContent>
          </Card>
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

        {/* Quick Summary */}
        <div className="mb-12">
          <Card className="card-neon border-green-500/50 bg-green-500/5">
            <CardHeader>
              <CardTitle className="flex items-center text-green-400">
                <CheckCircle className="w-6 h-6 mr-3" />
                Quick Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2 text-foreground">What We Collect:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Account information (name, email)</li>
                  <li>• Payment verification data</li>
                  <li>• Contact details for support</li>
                  <li>• Basic usage analytics</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-foreground">How We Use It:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Provide and improve our services</li>
                  <li>• Process payments and deliver products</li>
                  <li>• Communicate important updates</li>
                  <li>• Ensure platform security</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Privacy Policy Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <Card className="card-neon sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg font-orbitron">Contents</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <nav className="space-y-2">
                    {sections.map((section) => (
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

          {/* Policy Sections */}
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

        {/* Contact Section */}
        <div className="mt-16">
          <Card className="card-neon bg-gradient-hero">
            <CardContent className="p-12 text-center">
              <div className="max-w-4xl mx-auto">
                <Mail className="w-16 h-16 mx-auto mb-6 text-white" />
                <h2 className="text-4xl font-orbitron font-bold text-white mb-4">
                  Questions About Your Privacy?
                </h2>
                <p className="text-xl text-white/80 mb-8">
                  We're here to help! If you have any questions about this Privacy Policy 
                  or how we handle your data, please don't hesitate to reach out.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                  <div className="text-left bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Data Protection Officer
                    </h3>
                    <div className="space-y-2 text-white/80">
                      <p>📧 myne7x@gmail.com</p>
                      <p>📱 +92 309 6626615</p>
                      <p>⏰ Response within 30 days</p>
                    </div>
                  </div>
                  
                  <div className="text-left bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Your Rights Include
                    </h3>
                    <div className="space-y-2 text-white/80">
                      <p>✓ Access your data</p>
                      <p>✓ Correct inaccuracies</p>
                      <p>✓ Delete your information</p>
                      <p>✓ Data portability</p>
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

export default Privacy;