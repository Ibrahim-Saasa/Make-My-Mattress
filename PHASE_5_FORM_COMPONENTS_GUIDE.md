# Phase 5 Form Components - Quick Reference Guide

## 📚 Component Quick Reference

### 1. Checkbox

```tsx
import { Checkbox } from '@/components/UI';

// Default variant
<Checkbox
  label="I agree"
  description="Optional description text"
  checked={checked}
  onChange={() => setChecked(!checked)}
  error={error}
/>

// Toggle variant
<Checkbox
  variant="toggle"
  label="Enable feature"
  checked={enabled}
  onChange={() => setEnabled(!enabled)}
/>
```

**Use When:**

- Binary yes/no choices
- Optional preferences or agreements
- Multiple independent selections
- Toggle switches for on/off states

---

### 2. RadioGroup

```tsx
import { RadioGroup } from '@/components/UI';

// Default variant
<RadioGroup
  label="Select one"
  value={selected}
  onChange={(val) => setSelected(val)}
  options={[
    { value: 'opt1', label: 'Option 1', description: 'Help text' },
    { value: 'opt2', label: 'Option 2' },
    { value: 'opt3', label: 'Option 3' },
  ]}
  error={error}
/>

// Card variant
<RadioGroup
  variant="card"
  options={firmnesOptions}
  value={firmness}
  onChange={setFirmness}
/>
```

**Use When:**

- Mutually exclusive choices
- 3-5 options (use Select for more)
- Need visual comparison of options
- Want to provide descriptions per option

---

### 3. Textarea

```tsx
import { Textarea } from '@/components/UI';

// With character limit
<Textarea
  label="Comments"
  description="Tell us more"
  placeholder="Type here..."
  value={comments}
  onChange={(e) => setComments(e.target.value)}
  showCharCount
  charLimit={500}
  error={error}
/>

// Large variant
<Textarea
  variant="large"
  placeholder="Write your story..."
  value={content}
  onChange={(e) => setContent(e.target.value)}
/>
```

**Use When:**

- Multi-line text input needed
- Want to limit user input length
- Need character counter
- Collecting longer form text (reviews, feedback, etc.)

**Props:**

- `variant`: "default" | "large" (affects min-height)
- `charLimit`: Maximum character count
- `showCharCount`: Display character counter
- `error`: Error message to display

---

### 4. Select

```tsx
import { Select } from '@/components/UI';

// Basic select
<Select
  label="Choose option"
  placeholder="Select..."
  options={[
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' },
    { value: 'c', label: 'Option C', disabled: true },
  ]}
  value={selected}
  onChange={(val) => setSelected(val)}
  error={error}
/>

// Searchable with icons
<Select
  label="Category"
  searchable
  options={[
    { value: 'cat1', label: 'Category 1', icon: '📁' },
    { value: 'cat2', label: 'Category 2', icon: '🎯' },
  ]}
  value={category}
  onChange={setCategory}
/>
```

**Use When:**

- 5+ options (RadioGroup works for <5)
- Space is limited (dropdown saves space)
- Need search/filter capability
- Want keyboard navigation support
- Need option icons

**Props:**

- `searchable`: Enable search/filter
- `disabled`: Disable entire select
- `placeholder`: Default display text
- Options support `disabled` and `icon`

---

### 5. Dialog

```tsx
import { Dialog } from "@/components/UI";
import { useState } from "react";

const [isOpen, setIsOpen] = useState(false);

<Dialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  description="Are you sure?"
  size="md"
  actions={[
    {
      label: "Cancel",
      variant: "secondary",
      onClick: () => setIsOpen(false),
    },
    {
      label: "Confirm",
      variant: "primary",
      onClick: handleConfirm,
    },
    {
      label: "Delete",
      variant: "danger",
      onClick: handleDelete,
    },
  ]}
>
  <p>Modal content goes here</p>
</Dialog>;
```

**Use When:**

- Need to confirm critical actions
- Display important information
- Get user input in modal form
- Block background interaction

**Size Options:**

- `"sm"` - 384px max-width (small info)
- `"md"` - 448px max-width (default)
- `"lg"` - 512px max-width (forms)
- `"xl"` - 576px max-width (large forms)

**Button Variants:**

- `"primary"` - Blue, main action
- `"secondary"` - Outlined blue, alternative
- `"danger"` - Red, destructive action

---

### 6. FormGroup

```tsx
import { FormGroup } from '@/components/UI';

// Single column
<FormGroup
  title="Personal Information"
  description="Required fields"
>
  <Input label="Name" />
  <Input label="Email" />
</FormGroup>

// Two columns (responsive)
<FormGroup
  title="Address"
  columns={2}
>
  <Input label="Street" />
  <Input label="City" />
  <Input label="State" />
  <Input label="ZIP" />
</FormGroup>

// Three columns
<FormGroup
  title="Advanced Options"
  columns={3}
>
  {/* 3 items per row on large screens */}
</FormGroup>
```

**Use When:**

- Organizing related form fields
- Grouping complex forms into sections
- Want automatic responsive grid
- Need scroll-reveal animation

**Responsive Behavior:**

- Mobile (default): 1 column
- Tablet (md): columns={2} → 2 columns
- Desktop (lg): columns={3} → 3 columns

---

## 🎨 Styling & Customization

### Dark Mode

All components automatically support dark mode:

```tsx
// Light mode: bg-white dark:bg-slate-900
// Dark text: text-slate-900 dark:text-white
// Focus ring: focus:ring-indigo-100 dark:focus:ring-indigo-900/30
```

### Custom Styling

```tsx
// Add className to any form component
<Input
  className="max-w-sm"  // Restrict width
/>

<textarea
  className="h-64"  // Custom height
/>
```

### Focus Styling

All inputs use consistent focus styling:

- Border: 2px `indigo-600` (light) / `indigo-400` (dark)
- Ring: 2px `indigo-100` (light) / `indigo-900/30` (dark)

---

## ✨ Animation Features

### Component Animations

- **Checkbox**: Animated checkmark entrance (0.3s)
- **RadioGroup**: Option stagger animation (0.05s delay between items)
- **Textarea**: Fade-in entrance with opacity+y translation
- **Select**: Spring-based dropdown open/close (stiffness: 300)
- **Dialog**: Backdrop fade + content scale animation
- **FormGroup**: Scroll-reveal on viewport entry

### State Animations

- Hover: Scale 1.05 → 1 transition
- Tap: Scale 0.95 (press effect)
- Focus: Smooth border and ring color transition
- Error: Fade-in error message slide-up

---

## 📋 Form Validation Pattern

```tsx
const [form, setForm] = useState({ name: "" });
const [errors, setErrors] = useState({});

const handleSubmit = (e) => {
  e.preventDefault();

  // Validate
  const newErrors = {};
  if (!form.name) newErrors.name = "Name is required";

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  // Submit
  handleApiCall();
};

// Clear error on input change
const handleChange = (field, value) => {
  setForm((prev) => ({ ...prev, [field]: value }));
  if (errors[field]) {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }
};

// Use in component
<Input
  value={form.name}
  onChange={(e) => handleChange("name", e.target.value)}
  error={errors.name}
/>;
```

---

## 🔍 Accessibility Features

### Built-in Support

- ✅ Semantic HTML (label, fieldset, input)
- ✅ Keyboard navigation (Tab, Enter, Arrow keys)
- ✅ Screen reader friendly (aria labels)
- ✅ Focus visible indicator (2px ring)
- ✅ Error announcements
- ✅ Color contrast compliance (WCAG AA)

### Best Practices

```tsx
// Always use label prop for accessibility
<Input label="Email" />  // ✅ Good
<Input />  // ❌ Missing label

// Group related radios/checkboxes
<RadioGroup label="Choose one">
  {/* Options */}
</RadioGroup>

// Provide error messages
<Input error="Email is required" />

// Disclose disabled state clearly
<Button disabled>Unavailable</Button>
```

---

## 🚀 Performance Tips

1. **Use Select for large lists** (5+ options)
   - More performant than RadioGroup
   - Takes less vertical space

2. **Lazy-load Dialog content**

   ```tsx
   <Dialog isOpen={isOpen}>{isOpen && <ExpensiveComponent />}</Dialog>
   ```

3. **Memo FormGroup with many fields**

   ```tsx
   const FormGroupSection = memo(({ data }) => (
     <FormGroup>{/* render fields */}</FormGroup>
   ));
   ```

4. **Debounce Select search**
   ```tsx
   const [search, setSearch] = useState("");
   const debouncedSearch = useDebounce(search, 300);
   ```

---

## 🐛 Common Patterns

### Form with All Components

```tsx
function FullForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    type: "",
    features: [],
    message: "",
    agree: false,
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFeature = (feature) => {
    setForm((prev) => {
      const features = prev.features || [];
      return {
        ...prev,
        features: features.includes(feature)
          ? features.filter((f) => f !== feature)
          : [...features, feature],
      };
    });
  };

  return (
    <form>
      <FormGroup columns={2}>
        <input
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        <input
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
      </FormGroup>

      <FormGroup>
        <Select
          options={tipos}
          value={form.type}
          onChange={(val) => handleChange("type", val)}
        />
      </FormGroup>

      <FormGroup>
        <div className="space-y-2">
          {features.map((f) => (
            <Checkbox
              key={f}
              label={f}
              checked={form.features.includes(f)}
              onChange={() => handleFeature(f)}
            />
          ))}
        </div>
      </FormGroup>

      <Textarea
        value={form.message}
        onChange={(e) => handleChange("message", e.target.value)}
        charLimit={500}
        showCharCount
      />

      <Checkbox
        label="I agree"
        checked={form.agree}
        onChange={() => handleChange("agree", !form.agree)}
      />
    </form>
  );
}
```

---

## 📖 API Reference

### Common Props (All Form Components)

```tsx
interface CommonFormProps {
  label?: string; // Label text
  error?: string; // Error message
  disabled?: boolean; // Disabled state
  className?: string; // Additional CSS classes
}
```

### All Exports

```tsx
export {
  Checkbox, // ✅ Boolean option
  RadioGroup, // ⭕ Single choice from multiple
  Textarea, // 📝 Multi-line text input
  Select, // 📋 Dropdown selection
  Dialog, // 🗂️ Modal dialog
  FormGroup, // 📦 Form section wrapper
};
```

---

## 🔗 See Also

- [Design Tokens](../../design-tokens.ts) - Color, spacing, typography
- [Animations](../../src/utils/animations.ts) - Animation variants
- [FormDemo](../FormDemo.tsx) - Full working example
- [PHASE_5_FORMS_COMPLETE](../../PHASE_5_FORMS_COMPLETE.md) - Detailed docs

---

_Quick Reference Guide - Phase 5 Form Components_  
_Updated: February 15, 2026_
