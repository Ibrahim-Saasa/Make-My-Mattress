import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Hero,
  GridSection,
  CTASection,
  Header,
  Footer,
  ProductCard,
  BrandCard,
  FeatureCard,
  StatCard,
  Section,
} from "../UI";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const featuredProducts = [
    {
      image: "/api/placeholder/400/300",
      badge: "Premium",
      badgeColor: "primary" as const,
      title: "Slumbersoft Memory Foam",
      subtitle: "Memory Foam",
      description: "Advanced contouring technology for ultimate comfort",
      price: "₹29,999",
      rating: 4.8,
      reviews: 256,
      tags: ["cooling", "hypoallergenic", "luxury"],
      onCTA: () => navigate("/configurator"),
      ctaText: "Customize Now",
    },
    {
      image: "/api/placeholder/400/300",
      badge: "Best Seller",
      badgeColor: "success" as const,
      title: "Sleepworks Latex",
      subtitle: "Natural Latex",
      description: "Organic latex with natural cooling properties",
      price: "₹34,999",
      rating: 4.9,
      reviews: 189,
      tags: ["organic", "cooling", "eco-friendly"],
      onCTA: () => navigate("/configurator"),
      ctaText: "Customize Now",
    },
    {
      image: "/api/placeholder/400/300",
      badge: "Value",
      badgeColor: "warning" as const,
      title: "Spinowell Basic",
      subtitle: "Hybrid",
      description: "Perfect balance of support and comfort",
      price: "₹19,999",
      rating: 4.6,
      reviews: 412,
      tags: ["support", "affordable", "durable"],
      onCTA: () => navigate("/configurator"),
      ctaText: "Customize Now",
    },
  ];

  const brands = [
    {
      name: "Sleepworks",
      type: "Premium Latex",
      description: "Organic, breathable natural latex for luxury sleep",
      accentColor: "#48BB78",
      features: ["Organic Latex", "Cooling", "Hypoallergenic"],
      onLearnMore: () => navigate("/brands/sleepworks"),
    },
    {
      name: "Spinowell",
      type: "Support Tech",
      description: "Advanced spinal support technology for health",
      accentColor: "#4299E1",
      features: ["Spine Align", "Pressure Relief", "Durable"],
      onLearnMore: () => navigate("/brands/spinowell"),
    },
    {
      name: "CloudComfort",
      type: "Ultra Soft",
      description: "Cloud-like softness with premium memory foam",
      accentColor: "#ED8936",
      features: ["Memory Foam", "Soft Surface", "Cooling Gel"],
      onLearnMore: () => navigate("/brands/cloudcomfort"),
    },
  ];

  const features = [
    {
      icon: "⚙️",
      title: "Fully Customizable",
      description: "Build your mattress with exact specifications",
      color: "primary",
    },
    {
      icon: "🏭",
      title: "Factory Direct",
      description: "Skip middlemen and save up to 40%",
      color: "secondary",
    },
    {
      icon: "🚚",
      title: "Free Delivery",
      description: "Fast and free shipping across major cities",
      color: "tertiary",
    },
    {
      icon: "💬",
      title: "Expert Support",
      description: "Sleep consultants available 24/7 to help",
      color: "accent",
    },
  ];

  const stats = [
    { value: "250+", label: "Happy Customers", icon: "😴", color: "primary" },
    { value: "6", label: "Premium Brands", icon: "🏆", color: "secondary" },
    {
      value: "10k+",
      label: "Combinations",
      icon: "🔧",
      color: "tertiary",
    },
    { value: "4.8", label: "Average Rating", icon: "⭐", color: "accent" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Navigation Header */}
      <Header
        navLinks={[
          { label: "Browse", href: "#featured" },
          { label: "Brands", href: "#brands" },
          { label: "Customize", href: "/configurator" },
          { label: "About", href: "#about" },
        ]}
        ctaButton={{
          text: "Build Mattress",
          onClick: () => navigate("/configurator"),
        }}
        showCart={false}
      />

      {/* Hero Section */}
      <Hero
        title="Sleep Experience, Your Way"
        subtitle="Customizable Premium Mattresses"
        description="Factory-direct pricing, fully customizable comfort, delivered to your door. No compromises. Just perfect sleep."
        primaryCTA={{
          text: "Start Customizing",
          onClick: () => navigate("/configurator"),
        }}
        secondaryCTA={{
          text: "Learn More",
          onClick: () =>
            document
              .getElementById("featured")
              ?.scrollIntoView({ behavior: "smooth" }),
        }}
        backgroundGradient="from-indigo-600 via-purple-600 to-pink-600"
        statsSection={[
          { label: "Happy Sleepers", value: "250+" },
          { label: "Premium Brands", value: "6" },
          { label: "Custom Options", value: "10k+" },
          { label: "Star Rating", value: "4.8" },
        ]}
      />

      {/* Featured Products Section */}
      <section id="featured">
        <GridSection
          title="Featured Mattresses"
          description="Hand-selected premium mattresses for different sleep styles and budgets"
          columns={3}
          gap="lg"
        >
          {featuredProducts.map((product) => (
            <ProductCard
              image={product.image}
              badge={product.badge}
              badgeColor={product.badgeColor}
              title={product.title}
              subtitle={product.subtitle}
              description={product.description}
              price={product.price}
              rating={product.rating}
              reviews={product.reviews}
              tags={product.tags}
              onCTA={product.onCTA}
              ctaText={product.ctaText}
            />
          ))}
        </GridSection>
      </section>

      {/* Features Section */}
      <Section maxWidth="2xl" className="py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Why Choose Us
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            We're reinventing mattress shopping with transparency, quality, and
            customization
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <FeatureCard
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color as any}
            />
          ))}
        </div>
      </Section>

      {/* Stats Section */}
      <Section
        maxWidth="2xl"
        className="py-16 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-2xl"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StatCard
              value={stat.value}
              label={stat.label}
              icon={stat.icon}
              color={stat.color as any}
            />
          ))}
        </div>
      </Section>

      {/* Brands Section */}
      <section id="brands">
        <GridSection
          title="Our Premium Brands"
          description="Trusted by customers across India. Each brand brings unique comfort technology."
          columns={3}
          gap="lg"
        >
          {brands.map((brand) => (
            <BrandCard
              name={brand.name}
              type={brand.type}
              description={brand.description}
              accentColor={brand.accentColor}
              features={brand.features}
              onLearnMore={brand.onLearnMore}
            />
          ))}
        </GridSection>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Ready to Sleep Better?"
        description="Join thousands of satisfied customers with custom-made mattresses tailored to your needs"
        theme="primary"
        primaryCTA={{
          text: "Start Building",
          onClick: () => navigate("/configurator"),
        }}
        secondaryCTA={{
          text: "Talk to Expert",
          onClick: () => alert("Chat widget would open here"),
        }}
      />

      {/* Footer */}
      <Footer
        sections={[
          {
            title: "Product",
            links: [
              { label: "Browse", href: "#featured" },
              { label: "Brands", href: "#brands" },
              { label: "Customize", href: "/configurator" },
              { label: "Reviews", href: "#" },
            ],
          },
          {
            title: "Company",
            links: [
              { label: "About Us", href: "#" },
              { label: "Careers", href: "#" },
              { label: "Blog", href: "#" },
              { label: "Press", href: "#" },
            ],
          },
          {
            title: "Support",
            links: [
              { label: "Help Center", href: "#" },
              { label: "Contact", href: "#" },
              { label: "Shipping", href: "#" },
              { label: "Returns", href: "#" },
            ],
          },
          {
            title: "Legal",
            links: [
              { label: "Privacy", href: "#" },
              { label: "Terms", href: "#" },
              { label: "Cookies", href: "#" },
              { label: "Disclaimer", href: "#" },
            ],
          },
        ]}
        onSocialClick={(platform) => {
          console.log(`Share on ${platform}`);
        }}
      />
    </div>
  );
};

export default HomePage;
