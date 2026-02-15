# UI Component Library - Phase 2 Complete

Complete premium component library for Make-My-Mattress redesign. All components are production-ready, accessible, and follow design system standards.

## Components Overview

### Basic Components (`components/UI/index.tsx`)

#### Button

Versatile button component with 6 variants and 3 sizes.

```tsx
import { Button } from '@/components/UI';

// Primary button (main CTAs)
<Button variant="primary" size="md" onClick={handleClick}>
  Shop Now
</Button>

// With icon
<Button
  variant="accent"
  icon={<ShoppingIcon />}
  iconPosition="right"
>
  Add to Cart
</Button>

// Loading state
<Button isLoading={true}>Processing...</Button>

// Full width
<Button fullWidth>Continue</Button>
```

**Variants:** primary | secondary | tertiary | accent | success | danger
**Sizes:** sm | md | lg
**Props:** isLoading, fullWidth, icon, iconPosition, disabled

---

#### Card

Premium card container with multiple visual styles.

```tsx
import { Card } from '@/components/UI';

// Minimal (light)
<Card variant="minimal">
  Content here
</Card>

// Elevated (prominent)
<Card variant="elevated" interactive>
  Click me for details
</Card>

// Gradient background
<Card variant="gradient">
  Premium feature
</Card>

// Glassmorphism
<Card variant="glass">
  Modern look with blur
</Card>
```

**Variants:** minimal | elevated | gradient | glass
**Props:** interactive, children

---

#### Label

Accessible form label with optional required indicator.

```tsx
import { Label } from '@/components/UI';

<Label htmlFor="email" required>
  Email Address
</Label>
<Input id="email" type="email" />
```

**Props:** required, htmlFor, children

---

#### Input

Premium text input with multiple variants and states.

```tsx
import { Input } from '@/components/UI';

// Basic input
<Input placeholder="Enter text..." />

// Large input
<Input variant="large" placeholder="Big input" />

// With icon
<Input
  icon={<SearchIcon />}
  iconPosition="left"
  placeholder="Search..."
/>

// Error state
<Input error placeholder="Invalid input" />

// Success state
<Input success placeholder="Valid input" />
```

**Variants:** default | large | minimal
**Props:** error, success, icon, iconPosition, placeholder

---

#### Badge

Status and tag badges for highlighting information.

```tsx
import { Badge } from '@/components/UI';

// Color variants
<Badge variant="primary">New</Badge>
<Badge variant="success">In Stock</Badge>
<Badge variant="warning">Low Stock</Badge>
<Badge variant="error">Sold Out</Badge>

// With icon
<Badge variant="primary" icon={<StarIcon />}>
  Featured
</Badge>
```

**Variants:** primary | success | warning | error | secondary

---

#### Section

Consistent section wrapper with responsive spacing.

```tsx
import { Section } from "@/components/UI";

<Section maxWidth="xl">
  <h2>Section Title</h2>
  <p>Content with consistent spacing</p>
</Section>;
```

**Props:** maxWidth (sm|md|lg|xl|2xl|full), children

---

### Advanced Components (`components/UI/Advanced.tsx`)

#### ProductCard

Showcase products with image, specs, rating, and CTA.

```tsx
import { ProductCard } from "@/components/UI";

<ProductCard
  image="/mattress.jpg"
  badge="Premium"
  badgeColor="primary"
  title="Slumbersoft Memory Foam"
  subtitle="Memory Foam"
  description="Advanced contouring technology..."
  price="₹29,999"
  rating={4.8}
  reviews={256}
  tags={["cooling", "hypoallergenic", "luxury"]}
  onCTA={() => navigate("/configurator")}
  ctaText="Customize Now"
/>;
```

**Props:**

- image, badge, badgeColor
- title, subtitle, description
- price, rating, reviews
- tags, onCTA, ctaText

---

#### BrandCard

Feature brand information with visual accent.

```tsx
import { BrandCard } from "@/components/UI";

<BrandCard
  name="Sleepworks"
  type="Latex Premium"
  description="Organic, breathable natural latex..."
  accentColor="#48BB78"
  features={["Organic Latex", "Cooling", "Hypoallergenic"]}
  onLearnMore={() => navigate("/brand/sleepworks")}
/>;
```

**Props:**

- logo, name, type, description
- accentColor, features
- onLearnMore

---

#### TestimonialCard

Display customer testimonials with rating.

```tsx
import { TestimonialCard } from "@/components/UI";

<TestimonialCard
  quote="Best mattress I've ever slept on! Changed my sleep quality completely."
  author="Sarah Johnson"
  role="Brand Manager at TechCorp"
  avatar="/avatar.jpg"
  rating={5}
/>;
```

**Props:** quote, author, role, avatar, rating

---

#### FeatureCard

Highlight product features with icons.

```tsx
import { FeatureCard } from "@/components/UI";

<FeatureCard
  icon="❄️"
  title="Advanced Cooling"
  description="Gel-infused memory foam keeps you cool all night"
  color="tertiary"
/>;
```

**Props:** icon, title, description, color

**Colors:** primary | secondary | tertiary | accent

---

#### StatCard

Display statistics and metrics.

```tsx
import { StatCard } from "@/components/UI";

<StatCard
  value="250+"
  label="Happy Customers"
  icon="😴"
  color="primary"
  suffix="k"
/>;
```

**Props:** value, label, icon, color, suffix

---

#### Footer

Premium footer with links and social media.

```tsx
import { Footer } from "@/components/UI";

<Footer
  sections={[
    {
      title: "Product",
      links: [
        { label: "Browse", href: "#" },
        { label: "Customize", href: "#" },
      ],
    },
    // More sections...
  ]}
  onSocialClick={(platform) => console.log(platform)}
/>;
```

---

### Layout Components (`components/UI/Layouts.tsx`)

#### Header

Sticky navigation header with responsive menu.

```tsx
import { Header } from "@/components/UI";

<Header
  navLinks={[
    { label: "Browse", href: "#" },
    { label: "Brands", href: "#" },
    { label: "Customize", href: "#" },
  ]}
  ctaButton={{
    text: "Sign In",
    onClick: () => navigate("/login"),
  }}
  showCart={true}
  cartCount={3}
  onCartClick={() => setCartOpen(true)}
  authUser={user}
  onLogout={handleLogout}
/>;
```

**Props:**

- navLinks, ctaButton
- showCart, cartCount, onCartClick
- authUser, onLogout
- logo, onMenuToggle

---

#### Hero

Full-height hero section with animated background.

```tsx
import { Hero } from "@/components/UI";

<Hero
  title="Sleep Like Never Before"
  subtitle="Premium Mattresses, Customized for You"
  description="Factory-direct pricing with personalized comfort..."
  primaryCTA={{
    text: "Start Customizing",
    onClick: () => navigate("/configurator"),
  }}
  secondaryCTA={{
    text: "Learn More",
    onClick: () => scrollTo("features"),
  }}
  backgroundGradient="from-indigo-600 via-purple-600 to-pink-600"
  statsSection={[
    { label: "Happy Customers", value: "250+" },
    { label: "Premium Brands", value: "6" },
    { label: "Customization Options", value: "10k+" },
    { label: "Star Rating", value: "4.8" },
  ]}
/>;
```

**Props:**

- title, subtitle, description
- primaryCTA, secondaryCTA
- backgroundImage, backgroundGradient
- accentColor, statsSection

---

#### CTASection

Prominent call-to-action container section.

```tsx
import { CTASection } from "@/components/UI";

<CTASection
  title="Ready to Sleep Better?"
  description="Join thousands of satisfied customers with custom-made mattresses"
  theme="primary"
  primaryCTA={{
    text: "Get Started",
    onClick: () => navigate("/configurator"),
  }}
  secondaryCTA={{
    text: "View Collection",
    onClick: () => navigate("/brands"),
  }}
/>;
```

**Props:**

- title, description
- primaryCTA, secondaryCTA
- theme (primary | secondary | dark)

---

#### GridSection

Responsive grid container for displaying item collections.

```tsx
import { GridSection, ProductCard } from "@/components/UI";

<GridSection
  title="Featured Mattresses"
  description="Hand-picked premium selections for different sleep styles"
  columns={3}
  gap="lg"
>
  {products.map((product) => (
    <ProductCard key={product.id} {...product} />
  ))}
</GridSection>;
```

**Props:**

- title, description
- columns (1|2|3|4)
- gap (sm|md|lg)
- children

---

#### ComparisonTable

Detailed product comparison table.

```tsx
import { ComparisonTable } from "@/components/UI";

<ComparisonTable
  title="Compare Mattresses"
  items={["Slumbersoft", "Sleepworks", "Spinowell"]}
  comparisons={[
    {
      feature: "Cooling",
      items: [true, true, false],
    },
    {
      feature: "Warranty",
      items: ["10 Years", "12 Years", "10 Years"],
    },
    // More comparisons...
  ]}
/>;
```

**Props:**

- title, items, comparisons

---

## Design Tokens

Access the comprehensive design system:

```tsx
import {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  SHADOWS,
  GRADIENTS,
  ANIMATIONS,
  BRAND_COLORS,
} from "@/design-tokens";

// Use in custom components
const customStyle = {
  background: COLORS.primary[500],
  padding: SPACING.xl,
  boxShadow: SHADOWS.lg,
};
```

---

## Color Tokens

### Primary Palette

- Primary (Indigo): #6366F1
- Secondary (Rose): #EC4899
- Tertiary (Teal): #14B8A6
- Accent (Amber): #F59E0B

### Semantic Colors

- Success: #22C55E
- Warning: #F59E0B
- Error: #EC4899
- Info: #6366F1

---

## Usage Best Practices

1. **Use TypeScript Inference**: Let TypeScript help with prop types

   ```tsx
   <Button variant="primary" /> // ✅ Type-safe
   ```

2. **Compose Components**: Build complex UIs from basic blocks

   ```tsx
   <Hero>
     <GridSection>
       <ProductCard />
     </GridSection>
   </Hero>
   ```

3. **Responsive Design**: Components are mobile-first by default

   ```tsx
   <GridSection columns={3} /> // Auto-responsive
   ```

4. **Accessibility**: All components include WCAG features

   ```tsx
   <Button focusRing="2" /> // Built-in focus management
   ```

5. **Dark Mode**: All components support light/dark themes
   ```tsx
   // Automatically responds to class="dark" on <html>
   ```

---

## Migration Guide

### From Old Components

If updating existing pages:

```tsx
// Old way
<div className="p-6 rounded-lg bg-white border shadow-lg">
  <h3 className="text-2xl font-bold">Title</h3>
</div>

// New way
<Card variant="elevated">
  <h3 className="text-2xl font-bold">Title</h3>
</Card>
```

---

## Next Steps (Phase 3)

- Add entrance animations with Framer Motion
- Create form-specific input components (Select, Checkbox, Radio, Textarea)
- Build modal/dialog component
- Add toast notification component
- Create tooltip/popover components
- Add skeleton loader component

---

## Component Status

✅ **Complete & Ready to Use**

- Button, Card, Label, Input, Badge, Section
- ProductCard, BrandCard, TestimonialCard, FeatureCard, StatCard
- Footer, Header, Hero, CTASection, GridSection, ComparisonTable

🟨 **Phase 3 (Upcoming)**

- Advanced form components
- Modal/Dialog
- Toast notifications
- Skeleton loaders
- Tooltips/Popovers

---

## Support & Customization

All components use Tailwind CSS and support custom className props:

```tsx
<Button className="custom-class" />
<Card className="!rounded-lg" />  // Override with !
```

For advanced customization, export and modify component source in `components/UI/`.
