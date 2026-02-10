# Product Preference Questionnaire - Implementation Guide

## Overview

The Product Preference Questionnaire is an optional post-sign-in feature that helps customers discover products matching their needs. It consists of separate questionnaires for Mattresses, Pillows, Bedsheets, and Accessories.

## Architecture

### Components

#### **ProductWizardModal** (`components/ProductWizard/ProductWizardModal.tsx`)

- Main modal container that orchestrates the wizard flow
- Manages step progression (category → questionnaire → results)
- Renders appropriate child component based on current step
- Handles mock recommendations (TODO: integrate with preferenceService)

#### **ProductCategoryPicker** (`components/ProductWizard/ProductCategoryPicker.tsx`)

- First step: Displays 4 product category buttons with emoji icons
- Click triggers `selectCategory()` → advances to questionnaire step
- Grid layout, accessible buttons

#### **ProductQuestionnaire** (`components/ProductWizard/ProductQuestionnaire.tsx`)

- Interactive multi-step questionnaire for each product category
- Dynamically loads questions from JSON based on selected category
- Features:
  - Multi-step form with Back/Next buttons
  - Progress indicator (Question X of Y)
  - Single-option selection per question
  - Keyboard navigation support (todo)
  - Calls `completeQuestionnaire()` on finish
- Reuses scoring logic from SleepQuiz (tag-weight model)

#### **ProductWizardResults** (`components/ProductWizard/ProductWizardResults.tsx`)

- Displays recommended products based on questionnaire answers
- Shows:
  - Product name, description
  - Match score (0-100%)
  - Price, rating
  - View Details button (wired to product page)
- Navigation: Back to Categories, Continue Shopping

#### **ProductWizardFloatingButton** (`components/ProductWizard/ProductWizardFloatingButton.tsx`)

- Floating action button in bottom-right corner
- Emoji icon (🛏️)
- Only visible when wizard is closed
- Triggers `openWizard()` on click
- Hidden for non-END_USER roles or when not authenticated

### Context

#### **ProductWizardContext** (`contexts/ProductWizardContext.tsx`)

- Manages wizard state:
  - `isOpen`: Modal visibility
  - `currentCategory`: Selected product category
  - `step`: "category" | "questionnaire" | "results"
- Methods:
  - `openWizard()`: Opens modal at category picker step
  - `closeWizard()`: Closes modal
  - `selectCategory(category)`: Moves to questionnaire step
  - `goBack()`: Returns to category picker
  - `completeQuestionnaire(payload)`: Processes answers, saves preferences
- Integrates with `preferenceService` for persistence (todo)

### Services

#### **preferenceService** (`services/preferenceService.ts`)

- `scoreProductAnswers()`: Scores answers using tag-weight model from JSON
- `getRecommendations()`: Fetches matching products (todo: integrate with products table)
- `savePreference()`: Saves user preference to Supabase `user_product_preferences` table
- `getUserPreferences()`: Retrieves user's previous preference responses
- `getProductCategories()`: Returns metadata for all 4 product categories

### Database

#### **user_product_preferences** Table

Created via migration: `db/migrations/2026-02-05_create_user_product_preferences.sql`

Schema:

```sql
- id: UUID (primary key)
- user_id: UUID (FK to auth.users)
- product_category: TEXT (mattress|pillow|bedsheet|accessories)
- answers: JSONB (array of { question_id, answer_id })
- tag_scores: JSONB (computed { tag: score })
- recommended_product_ids: TEXT[] (array of matched SKUs)
- created_at, updated_at: TIMESTAMP
```

RLS Policies:

- Users can only view/insert/update their own preferences
- Indexed on user_id, category, created_at for efficient queries

### Question Data

#### JSON Structure

Location: `src/data/productQuestions/[category]Questions.json`

```json
[
  {
    "id": "q1",
    "text": "Question text?",
    "options": [
      {
        "id": "opt1",
        "label": "Option label",
        "weights": {
          "tag1": 3,
          "tag2": 1
        }
      }
    ]
  }
]
```

#### Available Files

- `mattressQuestions.json`: 5 questions (position, firmness, body type, temperature, size)
- `pillowQuestions.json`: 5 questions (firmness, position, neck pain, material, budget)
- `bedsheetQuestions.json`: 5 questions (material, thread count, temp, size, budget)
- `accessoriesQuestions.json`: 4 questions (type, purpose, allergies, budget)

### Scoring Algorithm

1. **Load Questions**: Fetch JSON for selected category
2. **Weight Answers**: For each answer, accumulate tag scores from option.weights
3. **Normalize**: (TODO) Implement normalization similar to quizService
4. **Match Products**: (TODO) Query products table, filter by category, rank by tag relevance
5. **Display Top 3-5**: Show highest-scoring products with match percentage

## Integration

### App.tsx

```tsx
import { ProductWizardProvider } from "./contexts/ProductWizardContext";
import ProductWizardModal from "./components/ProductWizard/ProductWizardModal";
import ProductWizardFloatingButton from "./components/ProductWizard/ProductWizardFloatingButton";

// In main return:
<ProductWizardProvider>
  {/* App content */}
  {session && userRole === UserRole.END_USER && (
    <>
      <ProductWizardModal />
      <ProductWizardFloatingButton />
    </>
  )}
</ProductWizardProvider>;
```

## User Flow

1. **Sign In** → End User on Brand Hall
2. **See Floating Button** → 🛏️ in bottom-right corner
3. **Click Button** → Modal opens with Category Picker
4. **Select Category** → e.g., "Mattress"
5. **Answer Questions** → 5 multi-choice questions
6. **View Results** → Top 3 recommended products with match scores
7. **View Details / Continue** → Back to Brand Hall or view product page

## Customization

### Adding New Product Category

1. Create `src/data/productQuestions/newCategoryQuestions.json` with 5-6 questions
2. Add to `ProductCategory` enum in `types.ts`
3. Update `preferenceService.getProductCategories()`
4. Update category picker emoji/name in `ProductCategoryPicker.tsx`
5. Add mock data in `ProductWizardModal.tsx` getMockRecommendations()

### Modifying Questions

- Edit JSON files in `src/data/productQuestions/`
- Change `weights` object keys to match your tag system
- Ensure option IDs are unique within a question

### Changing Scoring Logic

- See `preferenceService.scoreProductAnswers()`
- Compare with `quizService.scoreAnswers()` for reference implementation

## Testing

### Storybook Stories

- `ProductWizard/ProductCategoryPicker.stories.tsx`
- `ProductWizard/ProductQuestionnaire.stories.tsx` (4 variants: mattress, pillow, bedsheet, accessories)
- `ProductWizard/ProductWizardResults.stories.tsx` (2 variants: with/without recommendations)

### Manual Testing

1. Run `pnpm dev`
2. Sign in as END_USER
3. Click floating button on brand-hall
4. Walk through all steps and verify state transitions
5. Check Supabase `user_product_preferences` table for saved data

## TODO

1. **Wire Scoring & Product Matching**
   - Call `preferenceService.scoreProductAnswers()` in `ProductQuestionnaire` completion
   - Implement actual product matching in `preferenceService.getRecommendations()`
   - Query products table for category and tag matches

2. **Create Products Table** (if not exists)
   - Schema: id, category, name, tags[], price, rating, sku
   - Seed with initial product catalog
   - Add RLS policies for public read access

3. **Enhance Results View**
   - Add "Add to Cart" button for each product
   - Link "View Details" to ProductDetailPage with pre-filled category
   - Show "Build in Studio" CTA with category/recommendation pre-filled

4. **Persistence Wiring**
   - In `ProductWizardContext.completeQuestionnaire()`, call `preferenceService.savePreference()`
   - Pass userId from session context
   - Show success/error toast

5. **Accessibility**
   - Add ARIA labels to buttons
   - Keyboard navigation in questionnaire (arrow keys to navigate options)
   - Screen reader support for progress indicator

6. **Analytics**
   - Track wizard opens/closes
   - Track category selections
   - Track completion rates
   - Log which products are viewed vs. added to cart

7. **Animations**
   - Smooth transitions between steps
   - Modal slide-in/out
   - Progress bar animation

## Files Changed

- `App.tsx`: Added ProductWizardProvider wrapper, modal & button components
- `components/ProductWizard/ProductCategoryPicker.tsx`: NEW
- `components/ProductWizard/ProductQuestionnaire.tsx`: NEW
- `components/ProductWizard/ProductWizardResults.tsx`: NEW
- `components/ProductWizard/ProductWizardModal.tsx`: NEW
- `components/ProductWizard/ProductWizardFloatingButton.tsx`: NEW
- `contexts/ProductWizardContext.tsx`: NEW
- `services/preferenceService.ts`: NEW
- `src/data/productQuestions/mattressQuestions.json`: NEW
- `src/data/productQuestions/pillowQuestions.json`: NEW
- `src/data/productQuestions/bedsheetQuestions.json`: NEW
- `src/data/productQuestions/accessoriesQuestions.json`: NEW
- `db/migrations/2026-02-05_create_user_product_preferences.sql`: NEW
- `types.ts`: Added ProductCategory, ProductCategoryConfig, ProductPreferenceResponse, ProductRecommendation
