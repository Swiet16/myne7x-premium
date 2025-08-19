import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Eye, 
  Heart, 
  Users, 
  Award, 
  Rocket,
  Shield,
  Star,
  TrendingUp
} from 'lucide-react';
import ceoImage from '@/assets/ceo-myne-winner.jpg';

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Innovation",
      description: "We constantly push boundaries to deliver cutting-edge digital solutions."
    },
    {
      icon: Shield,
      title: "Quality",
      description: "Every product undergoes rigorous testing to ensure premium quality."
    },
    {
      icon: Heart,
      title: "Customer First",
      description: "Our customers' success is our primary motivation and measure of achievement."
    },
    {
      icon: Star,
      title: "Excellence",
      description: "We strive for perfection in every aspect of our business operations."
    }
  ];

  const stats = [
    { icon: Users, number: "10,000+", label: "Happy Customers" },
    { icon: Award, number: "500+", label: "Products Delivered" },
    { icon: TrendingUp, number: "99.9%", label: "Customer Satisfaction" },
    { icon: Rocket, number: "5+", label: "Years of Excellence" }
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        
        {/* Hero Section */}
        <div className="text-center mb-20 slide-in-up">
          <Badge className="mb-6 bg-primary/20 text-primary border-primary/50 pulse-neon">
            About MYNE7X Store
          </Badge>
          <h1 className="text-5xl md:text-7xl font-orbitron font-black mb-6 text-glow">
            Our Story
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Founded with a vision to democratize access to premium digital products, MYNE7X Store 
            has become a trusted platform for thousands of creators, entrepreneurs, and businesses 
            worldwide seeking high-quality digital solutions.
          </p>
        </div>

        {/* CEO Section */}
        <section className="mb-20">
          <Card className="card-neon overflow-hidden max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="relative overflow-hidden">
                <img
                  src={ceoImage}
                  alt="Myne Winner - CEO & Founder"
                  className="w-full h-full object-cover min-h-[400px] lg:min-h-[500px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <Badge className="w-fit mb-4 bg-gradient-neon text-primary-foreground border-0">
                  CEO & Founder
                </Badge>
                <h2 className="text-3xl lg:text-4xl font-orbitron font-bold mb-4 text-glow">
                  Myne Winner
                </h2>
                <blockquote className="text-lg text-muted-foreground mb-6 leading-relaxed italic">
                  "Technology should empower, not complicate. At MYNE7X Store, we believe 
                  every individual and business deserves access to tools that can transform 
                  their digital presence and accelerate their growth."
                </blockquote>
                <p className="text-muted-foreground leading-relaxed">
                  With over a decade of experience in the digital industry, Myne Winner 
                  founded MYNE7X Store to bridge the gap between innovative technology 
                  and practical business solutions. His vision continues to drive our 
                  commitment to excellence and customer satisfaction.
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Mission & Vision */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="card-neon slide-in-left">
              <CardHeader>
                <div className="w-16 h-16 mb-4 rounded-full bg-gradient-neon flex items-center justify-center">
                  <Target className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-3xl font-orbitron text-glow">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  To empower individuals and businesses worldwide by providing access to 
                  premium digital products that drive innovation, efficiency, and success. 
                  We strive to make cutting-edge technology accessible, affordable, and 
                  easy to implement for everyone.
                </p>
              </CardContent>
            </Card>

            <Card className="card-neon slide-in-right">
              <CardHeader>
                <div className="w-16 h-16 mb-4 rounded-full bg-gradient-neon-secondary flex items-center justify-center">
                  <Eye className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-3xl font-orbitron text-glow-secondary">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  To become the world's most trusted marketplace for digital products, 
                  where quality meets innovation. We envision a future where every creator 
                  and entrepreneur has the tools they need to build, scale, and succeed 
                  in the digital economy.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Values */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-4 text-glow">
              Our Core Values
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              These principles guide everything we do and shape our relationship with customers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="card-neon text-center slide-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-neon-accent flex items-center justify-center">
                    <value.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="font-orbitron text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="mb-20">
          <Card className="card-neon bg-gradient-hero">
            <CardContent className="p-12">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-4 text-white">
                  Our Impact
                </h2>
                <p className="text-xl text-white/80 max-w-3xl mx-auto">
                  Numbers that reflect our commitment to excellence and customer satisfaction
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center slide-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-4xl font-orbitron font-bold text-white mb-2">{stat.number}</h3>
                    <p className="text-white/80">{stat.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Story */}
        <section className="mb-20">
          <div className="max-w-4xl mx-auto">
            <Card className="card-neon">
              <CardHeader className="text-center">
                <CardTitle className="text-4xl font-orbitron font-bold text-glow mb-4">
                  Our Journey
                </CardTitle>
                <CardDescription className="text-lg">
                  From humble beginnings to global recognition
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  MYNE7X Store began as a small project in 2019 when our founder, Myne Winner, 
                  recognized the growing need for accessible, high-quality digital products 
                  in an increasingly digital world. What started as a solution for a few 
                  close colleagues quickly evolved into something much larger.
                </p>
                <p>
                  By 2020, we had served our first 100 customers and realized we were onto 
                  something special. The positive feedback and word-of-mouth referrals 
                  encouraged us to expand our catalog and improve our platform continuously.
                </p>
                <p>
                  Today, MYNE7X Store serves thousands of customers worldwide, offering 
                  carefully curated digital products that meet the highest standards of 
                  quality and innovation. Our commitment to excellence remains unchanged, 
                  and our vision continues to drive us forward.
                </p>
                <p>
                  As we look to the future, we remain dedicated to our core mission: 
                  empowering success through premium digital solutions. Every product 
                  we offer, every feature we develop, and every interaction we have 
                  is guided by this fundamental purpose.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

      </div>
    </div>
  );
};

export default About;