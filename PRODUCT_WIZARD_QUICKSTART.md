# Product Wizard - Quick Start Guide

## 🚀 Launch the Feature

### 1. Start Development Server

```bash
cd c:\Users\imsaa\dyad-apps\Make-My-Mattress
pnpm dev
```

### 2. Open Browser

```
http://localhost:5173
```

### 3. Sign In

1. Click "Login" (top right if redirected)
2. Use existing account or create new one
3. Complete role selection if first time
4. Navigate to Brand Hall

### 4. Access Product Wizard

- Look for **🛏️ floating button** in bottom-right corner
- Click to open modal
- Start answering questions!

---

## 📖 User Journey

```
Sign In (as END_USER)
    ↓
Navigate to Brand Hall
    ↓
See Floating Button (🛏️)
    ↓
Click Button
    ↓
[Modal Opens] - Step 1: Select Category
┌─────────────────────────────────────┐
│  Find Your Perfect Product           │
│                                     │
│  [Mattress] [Pillow]                │
│  [Bedsheet] [Accessories]           │
│                                     │
│                            [Close X]│
└─────────────────────────────────────┘
    ↓ Click "Mattress"
    ↓
[Modal Updates] - Step 2: Answer Questions
┌─────────────────────────────────────┐
│  Mattress Questions                  │
│  Question 1 of 5                    │
│                                     │
│  What's your sleep position?        │
│  ⚪ Back sleeper                    │
│  ⚪ Side sleeper                    │
│  ⚪ Stomach sleeper                 │
│                                     │
│ [Back] [Next]                       │
└─────────────────────────────────────┘
    ↓ Answer all 5 questions
    ↓
[Modal Updates] - Step 3: View Results
┌─────────────────────────────────────┐
│  Recommended Mattresses              │
│                                     │
│  Cloud Comfort Mattress             │
│  Match Score: 95%                   │
│  $899 | Rating: 4.8/5               │
│  [View Details]                     │
│                                     │
│  Supreme Support Mattress           │
│  Match Score: 88%                   │
│  $1299 | Rating: 4.7/5              │
│  [View Details]                     │
│                                     │
│  [Back] [Continue Shopping]         │
└─────────────────────────────────────┘
    ↓
[Modal Closes] or [Continue Shopping] click
    ↓
Back to Brand Hall
```

---

## 🎨 Viewing in Storybook

```bash
# Start Storybook server
pnpm storybook

# Open browser
http://localhost:6006

# Navigate to stories:
# ProductWizard/ProductCategoryPicker
# ProductWizard/ProductQuestionnaire (4 variants)
# ProductWizard/ProductWizardResults (2 variants)
```

---

## 💾 Data Persistence

When you complete the questionnaire:

1. **Answers Saved**:

   ```json
   {
     "user_id": "uuid...",
     "product_category": "mattress",
     "answers": [
       { "question_id": "q_position", "answer_id": "pos_back" },
       { "question_id": "q_firmness", "answer_id": "firm_medium" }
     ]
   }
   ```

2. **View in Supabase**:
   - Go to Supabase dashboard
   - Navigate to `user_product_preferences` table
   - Filter by your user ID
   - See your saved preferences

---

## 🧪 Testing Each Component

### ProductCategoryPicker

```
✓ See 4 category buttons
✓ Each button has emoji icon
✓ Click highlights button
✓ Click advances to questionnaire step
```

### ProductQuestionnaire

```
✓ Question text displays
✓ All options are clickable
✓ Selected option is highlighted
✓ Progress indicator shows "X of Y"
✓ Back button is disabled on first question
✓ Next button is disabled until option selected
✓ Finish button on last question completes flow
```

### ProductWizardResults

```
✓ Product cards display
✓ Match score shows 0-100%
✓ Price and rating visible
✓ View Details button is clickable
✓ Back button returns to category picker
✓ Continue Shopping closes modal
```

### ProductWizardFloatingButton

```
✓ Button appears in bottom-right corner
✓ Button is fixed when scrolling
✓ Button is hidden when modal is open
✓ Button shows bed emoji (🛏️)
✓ Hover shows tooltip
```

---

## 🔧 Customization Examples

### Change Question Text

Edit `src/data/productQuestions/mattressQuestions.json`:

```json
{
  "id": "q_position",
  "text": "NEW TEXT HERE",  // ← Change this
  "options": [...]
}
```

### Change Button Color

Edit `components/ProductWizard/ProductCategoryPicker.tsx`:

```tsx
className = "bg-indigo-600 hover:bg-indigo-700";
// Change to:
className = "bg-blue-600 hover:bg-blue-700";
```

### Change Floating Button Emoji

Edit `components/ProductWizard/ProductWizardFloatingButton.tsx`:

```tsx
<span className="text-2xl">🛏️</span>
// Change to:
<span className="text-2xl">⭐</span>  // or any emoji
```

### Add New Product Category

1. Create `src/data/productQuestions/newCategoryQuestions.json`
2. Add to `ProductCategory` enum in `types.ts`:
   ```tsx
   type ProductCategory =
     | "mattress"
     | "pillow"
     | "bedsheet"
     | "accessories"
     | "newcategory";
   ```
3. Add category to picker in `ProductCategoryPicker.tsx`
4. Add mock data in `ProductWizardModal.tsx` getMockRecommendations()

---

## 🐛 Troubleshooting

### Floating Button Not Visible

**Cause**: Not logged in as END_USER  
**Fix**: Complete role selection after signup, ensure role is set to "END_USER"

### Modal Doesn't Open

**Cause**: ProductWizardProvider missing from App.tsx  
**Fix**: Check that `<ProductWizardProvider>` wraps entire app content

### Questions Not Loading

**Cause**: JSON import path incorrect  
**Fix**: Verify file exists: `src/data/productQuestions/[category]Questions.json`

### Database Errors

**Cause**: Migration not run or RLS policies blocking access  
**Fix**: Run migration SQL in Supabase SQL editor, verify policies

### TypeScript Errors

**Cause**: Types not imported  
**Fix**: Ensure `import { ProductCategory } from "../../types"`

---

## 📊 Monitoring

### View User Preferences

```sql
SELECT user_id, product_category, tag_scores, created_at
FROM user_product_preferences
ORDER BY created_at DESC
LIMIT 10;
```

### View Recommendations Sent

```sql
SELECT user_id, product_category,
       array_length(recommended_product_ids, 1) as count
FROM user_product_preferences
WHERE recommended_product_ids IS NOT NULL
     AND array_length(recommended_product_ids, 1) > 0;
```

### View Popular Questions

```sql
-- Which answers are selected most?
SELECT answers->0->'answer_id' as most_common_answer,
       COUNT(*) as frequency
FROM user_product_preferences
WHERE product_category = 'mattress'
GROUP BY answers->0->'answer_id'
ORDER BY frequency DESC;
```

---

## 🚦 Feature Flags

### To Disable for Testing

Edit `App.tsx`:

```tsx
{
  session && userRole === UserRole.END_USER && (
    <>
      <ProductWizardModal />
      <ProductWizardFloatingButton />
    </>
  );
}
// Change to:
{
  false && ( // ← Disabled
    <>
      <ProductWizardModal />
      <ProductWizardFloatingButton />
    </>
  );
}
```

### To Test Different Roles

Modify role in Supabase:

```sql
UPDATE profiles
SET role = 'TECHNICIAN'
WHERE id = 'your-user-id';
```

---

## 📞 Support

### Check These Files First

1. `PRODUCT_WIZARD_README.md` - Full implementation details
2. `PRODUCT_WIZARD_ARCHITECTURE.md` - Technical diagrams
3. `types.ts` - Type definitions
4. `components/ProductWizard/*.tsx` - Component source code

### Debug Mode

Add to `ProductWizardModal.tsx`:

```tsx
console.log("Current Step:", step);
console.log("Current Category:", currentCategory);
console.log("Is Open:", isOpen);
```

### Test in Browser Console

```javascript
// Check if context is available
window.__PRODUCT_WIZARD_CONTEXT__;

// View component props in React DevTools
// (Install React DevTools extension)
```

---

## 🎯 Next Features to Build

1. ✨ **Add to Cart** from results
2. 🎨 **Smooth Animations** between steps
3. 📊 **Analytics Dashboard** to view results
4. 🤖 **ML-Based Recommendations**
5. 👥 **Social Proof** - Compare with similar users
6. 💾 **Save & Resume** - Come back later
7. 📱 **Mobile Optimized** - Better mobile UX

---

## ✅ Feature Checklist

Before deploying to production:

- [ ] All TODOs completed (see PRODUCT_WIZARD_README.md)
- [ ] Database migration run in production
- [ ] Product recommendations wired
- [ ] Error handling tested
- [ ] Loading states added
- [ ] Toast notifications for success/error
- [ ] Mobile responsive tested
- [ ] Accessibility audit passed (WCAG 2.1 AA)
- [ ] Analytics events tracked
- [ ] Performance tested (<3s load time)
- [ ] RLS policies verified
- [ ] User data privacy compliant

---

Happy building! 🚀
