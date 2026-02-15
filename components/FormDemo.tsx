/**
 * Form Components Demonstration Page
 * Showcases all Phase 5 form components in action
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Button,
  Checkbox,
  RadioGroup,
  Textarea,
  Select,
  Dialog,
  FormGroup,
  Card,
  Hero,
  Footer,
  Header,
} from "@/components/UI";
import { fadeInUp, staggerContainer } from "@/src/utils/animations";

interface FormData {
  name: string;
  email: string;
  mattressType: string;
  specifications: string;
  firmness: string;
  acceptTerms: boolean;
  newsletter: boolean;
  reviews: string;
  features: string[];
}

export default function FormDemo() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    mattressType: "",
    specifications: "",
    firmness: "",
    acceptTerms: false,
    newsletter: false,
    reviews: "",
    features: [],
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCheckboxChange = (field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field as keyof FormData],
    }));
  };

  const handleFeaturesChange = (feature: string) => {
    setFormData((prev) => {
      const features = prev.features || [];
      if (features.includes(feature)) {
        return {
          ...prev,
          features: features.filter((f) => f !== feature),
        };
      } else {
        return {
          ...prev,
          features: [...features, feature],
        };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    const newErrors: Partial<FormData> = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.mattressType)
      newErrors.mattressType = "Mattress type is required";
    if (!formData.firmness) newErrors.firmness = "Firmness level is required";
    if (!formData.acceptTerms)
      newErrors.acceptTerms = "You must accept the terms" as any;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsDialogOpen(true);
  };

  const firmnessOptions = [
    {
      value: "soft",
      label: "Soft (1-3)",
      description: "Maximum comfort and sink-in feel",
    },
    {
      value: "medium",
      label: "Medium (4-6)",
      description: "Balanced comfort and support",
    },
    {
      value: "firm",
      label: "Firm (7-9)",
      description: "Maximum support and responsiveness",
    },
    {
      value: "extra-firm",
      label: "Extra Firm (10)",
      description: "Minimal compression",
    },
  ];

  const features = [
    "Memory Foam",
    "Cooling Gel",
    "Hypoallergenic",
    "Spring Support",
    "Organic Cotton",
    "Latex Layer",
  ];

  return (
    <>
      <Header />

      <Hero
        title="Form Components in Action"
        subtitle="Experience our comprehensive form component library"
        description="Phase 5 delivers a complete set of accessible, animated form elements for any application"
        primaryCTA={{
          text: "View Documentation",
          onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
        }}
      />

      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-slate-950 dark:to-slate-900">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          {/* Form Header */}
          <motion.div
            className="text-center mb-12"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Configure Your Perfect Mattress
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Fill out the form below to create your custom mattress
              configuration
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information Group */}
                <FormGroup
                  title="Basic Information"
                  description="Start with your personal details"
                  columns={2}
                >
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all duration-200"
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                        {errors.name as string}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all duration-200"
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                        {errors.email as string}
                      </p>
                    )}
                  </div>
                </FormGroup>

                {/* Mattress Selection Group */}
                <FormGroup
                  title="Mattress Configuration"
                  description="Choose your mattress specifications"
                  columns={2}
                >
                  <div>
                    <Select
                      label="Mattress Type"
                      placeholder="Select mattress type"
                      searchable
                      value={formData.mattressType}
                      onChange={(val) => handleInputChange("mattressType", val)}
                      error={errors.mattressType as string}
                      options={[
                        {
                          value: "memory-foam",
                          label: "Memory Foam",
                          icon: "🛏️",
                        },
                        { value: "hybrid", label: "Hybrid", icon: "⚙️" },
                        { value: "latex", label: "Natural Latex", icon: "🌿" },
                        {
                          value: "innerspring",
                          label: "Traditional Innerspring",
                          icon: "🔄",
                        },
                        {
                          value: "adjustable",
                          label: "Adjustable Air",
                          icon: "💨",
                        },
                      ]}
                    />
                  </div>

                  <div>
                    <Select
                      label="Firmness Level"
                      placeholder="Select firmness"
                      value={formData.firmness}
                      onChange={(val) => handleInputChange("firmness", val)}
                      error={errors.firmness as string}
                      options={firmnessOptions}
                    />
                  </div>
                </FormGroup>

                {/* Features Selection */}
                <FormGroup
                  title="Special Features"
                  description="Select the features you want in your mattress"
                >
                  <div className="space-y-3">
                    {features.map((feature) => (
                      <Checkbox
                        key={feature}
                        label={feature}
                        checked={formData.features.includes(feature)}
                        onChange={() => handleFeaturesChange(feature)}
                      />
                    ))}
                  </div>
                </FormGroup>

                {/* Specifications */}
                <FormGroup
                  title="Additional Specifications"
                  description="Tell us more about your needs"
                >
                  <Textarea
                    label="Custom Requirements"
                    placeholder="Any special requirements or preferences? (e.g., pet-friendly, eco-friendly materials, specific allergies)"
                    value={formData.specifications}
                    onChange={(e) =>
                      handleInputChange("specifications", e.target.value)
                    }
                    showCharCount
                    charLimit={500}
                    variant="large"
                  />

                  <Textarea
                    label="What are you looking for in a mattress?"
                    placeholder="Share what matters most to you in a mattress (comfort, support, temperature regulation, durability, etc.)"
                    value={formData.reviews}
                    onChange={(e) =>
                      handleInputChange("reviews", e.target.value)
                    }
                    showCharCount
                    charLimit={500}
                  />
                </FormGroup>

                {/* Preferences */}
                <FormGroup
                  title="Preferences"
                  description="Customize your experience with us"
                >
                  <div className="space-y-4">
                    <Checkbox
                      label="I accept the terms and conditions"
                      description="By checking this, you agree to our terms of service and privacy policy"
                      checked={formData.acceptTerms}
                      onChange={() => handleCheckboxChange("acceptTerms")}
                      error={
                        errors.acceptTerms
                          ? "You must accept the terms"
                          : undefined
                      }
                    />

                    <Checkbox
                      variant="toggle"
                      label="Subscribe to our newsletter"
                      checked={formData.newsletter}
                      onChange={() => handleCheckboxChange("newsletter")}
                    />
                  </div>
                </FormGroup>

                {/* Form Actions */}
                <div className="flex gap-4 pt-8 border-t border-gray-200 dark:border-slate-700">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleSubmit}
                  >
                    Submit Configuration
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>

          {/* Component Showcase */}
          <motion.div
            className="mt-20"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
              Form Component Library
            </h3>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Checkbox Info */}
              <Card className="p-6">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                  Checkbox Component
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Fully accessible checkbox with smooth animations. Supports
                  both default and toggle variants for flexible UI design.
                </p>
                <div className="space-y-3">
                  <Checkbox label="Standard checkbox" />
                  <Checkbox variant="toggle" label="Toggle variant" />
                </div>
              </Card>

              {/* RadioGroup Info */}
              <Card className="p-6">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                  Radio Group Component
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Accessible radio button groups with animated selection states.
                  Perfect for single-choice questions.
                </p>
                <RadioGroup
                  options={[
                    { value: "opt1", label: "Option 1" },
                    { value: "opt2", label: "Option 2" },
                  ]}
                  value="opt1"
                />
              </Card>

              {/* Textarea Info */}
              <Card className="p-6">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                  Textarea Component
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Multi-line text input with optional character limit,
                  auto-expand, and character counter.
                </p>
                <Textarea
                  placeholder="Type something..."
                  showCharCount
                  charLimit={200}
                />
              </Card>

              {/* Select Info */}
              <Card className="p-6">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                  Select Component
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Custom dropdown with search capability, keyboard navigation,
                  and smooth animations.
                </p>
                <Select
                  placeholder="Choose an option"
                  searchable
                  options={[
                    { value: "1", label: "Option 1" },
                    { value: "2", label: "Option 2" },
                    { value: "3", label: "Option 3" },
                  ]}
                />
              </Card>

              {/* Dialog Info */}
              <Card className="p-6">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                  Dialog Component
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Accessible modal dialog with backdrop, smooth animations, and
                  customizable actions.
                </p>
                <Button
                  variant="secondary"
                  onClick={() => setIsDialogOpen(true)}
                  fullWidth
                >
                  Open Dialog
                </Button>
              </Card>

              {/* FormGroup Info */}
              <Card className="p-6">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                  FormGroup Component
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Wrapper component for organizing related form fields with
                  titles and descriptions.
                </p>
                <div className="text-xs text-indigo-600 dark:text-indigo-400 font-mono bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
                  &lt;FormGroup columns={"{2}"}&gt;
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Dialog Demo */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Configuration Submitted!"
        description="Your mattress configuration has been received"
        size="md"
        actions={[
          {
            label: "Continue Shopping",
            variant: "primary",
            onClick: () => setIsDialogOpen(false),
          },
          {
            label: "View Cart",
            variant: "secondary",
            onClick: () => setIsDialogOpen(false),
          },
        ]}
      >
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
              Your Configuration:
            </h3>
            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <p>
                <strong>Name:</strong> {formData.name}
              </p>
              <p>
                <strong>Email:</strong> {formData.email}
              </p>
              <p>
                <strong>Mattress Type:</strong> {formData.mattressType}
              </p>
              <p>
                <strong>Firmness:</strong> {formData.firmness}
              </p>
              <p>
                <strong>Features:</strong> {formData.features.join(", ")}
              </p>
            </div>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-800 dark:text-green-200">
              ✓ Thank you for your submission! Our team will review your
              configuration and contact you shortly.
            </p>
          </div>
        </div>
      </Dialog>

      <Footer />
    </>
  );
}
