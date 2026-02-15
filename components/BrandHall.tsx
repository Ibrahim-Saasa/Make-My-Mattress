import React from "react";
import { useNavigate } from "react-router-dom";
import { BRANDS } from "../constants";
import { BrandMetadata } from "../types";
import { useTheme } from "../src/contexts/ThemeContext";
import {
  Header,
  GridSection,
  BrandCard,
  CTASection,
  Footer,
  Section,
} from "./UI";

interface Props {
  onSelectBrand: (brand: BrandMetadata) => void;
  userName: string | null;
}

const BrandHall: React.FC<Props> = ({ onSelectBrand, userName }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Brand accent colors mapping
  const brandAccentColors: { [key: string]: string } = {
    Slumbersoft: "#A78BFA",
    Sleepworks: "#34D399",
    Spinowell: "#60A5FA",
    "Bedding N More": "#F97316",
    Sleepson: "#94A3B8",
    SleepGenie: "#4F46E5",
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Navigation Header */}
      <Header
        navLinks={[
          { label: "Brands", href: "#" },
          { label: "Customize", href: "/configurator" },
          { label: "About", href: "#" },
        ]}
        ctaButton={{
          text: "Build Mattress",
          onClick: () => navigate("/configurator"),
        }}
        showCart={false}
      />

      {/* Hero Section */}
      <Section maxWidth="2xl" className="py-20">
        <div className="text-center mb-12">
          {userName && (
            <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-3">
              Welcome back, {userName}!
            </p>
          )}
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Select Your Sleep Series
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Each premium brand is engineered for specific comfort profiles and
            sleep styles
          </p>
        </div>
      </Section>

      {/* Brands Grid Section */}
      <section className="py-12">
        <Section maxWidth="2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BRANDS.map((brand) => (
              <div
                key={brand.id}
                onClick={() => onSelectBrand(brand)}
                className="cursor-pointer transition-transform hover:scale-105"
              >
                <BrandCard
                  name={brand.name}
                  type={brand.type}
                  description={brand.description}
                  accentColor={brandAccentColors[brand.name] || "#6366F1"}
                  features={
                    brand.features || [
                      "Premium Materials",
                      "Expert Support",
                      "Custom Comfort",
                    ]
                  }
                  onLearnMore={() => onSelectBrand(brand)}
                />
              </div>
            ))}
          </div>
        </Section>
      </section>

      {/* Feature Highlight Section */}
      <Section maxWidth="2xl" className="py-20">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Why Choose Our Brands?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            Each of our carefully curated brands offers unique technology and
            materials to match your sleep preferences
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white dark:bg-slate-900 rounded-lg">
              <div className="text-4xl mb-3">🛏️</div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                Premium Materials
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Handpicked fabrics, foams, and springs for maximum comfort
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-900 rounded-lg">
              <div className="text-4xl mb-3">🔬</div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                Advanced Technology
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Innovative cooling, support, and durability features
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-900 rounded-lg">
              <div className="text-4xl mb-3">💯</div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                Satisfaction Guaranteed
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                100-night trial and expert sleep consultants
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <CTASection
        title="Ready to Customize?"
        description="Let's find the perfect mattress for your sleep needs"
        theme="primary"
        primaryCTA={{
          text: "Start Customizing",
          onClick: () => navigate("/configurator"),
        }}
        secondaryCTA={{
          text: "Get Sleep Consultation",
          onClick: () => alert("Chat with sleep expert"),
        }}
      />

      {/* Footer */}
      <Footer
        sections={[
          {
            title: "Brands",
            links: [
              { label: "All Brands", href: "#" },
              { label: "Compare", href: "#" },
              { label: "Technology", href: "#" },
              { label: "Reviews", href: "#" },
            ],
          },
          {
            title: "Customize",
            links: [
              { label: "Build Mattress", href: "/configurator" },
              { label: "Size Guide", href: "#" },
              { label: "Firmness Guide", href: "#" },
              { label: "FAQ", href: "#" },
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
            title: "Company",
            links: [
              { label: "About", href: "#" },
              { label: "Blog", href: "#" },
              { label: "Careers", href: "#" },
              { label: "Press", href: "#" },
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

export default BrandHall;
