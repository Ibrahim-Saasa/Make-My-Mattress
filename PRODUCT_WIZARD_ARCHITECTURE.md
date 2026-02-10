# Product Wizard - Architecture & Data Flow

## Component Hierarchy

```
App.tsx
└── ProductWizardProvider
    ├── ProductWizardModal
    │   ├── ProductCategoryPicker (step: "category")
    │   ├── ProductQuestionnaire (step: "questionnaire")
    │   └── ProductWizardResults (step: "results")
    └── ProductWizardFloatingButton
```

## State Flow Diagram

```
ProductWizardContext
│
├── State:
│   ├── isOpen: boolean
│   ├── currentCategory: ProductCategory | null
│   └── step: "category" | "questionnaire" | "results"
│
└── Actions:
    ├── openWizard() → isOpen = true, step = "category"
    ├── closeWizard() → isOpen = false
    ├── selectCategory(cat) → currentCategory = cat, step = "questionnaire"
    ├── goBack() → step = "category"
    └── completeQuestionnaire(payload) → step = "results", savePreference()
```

## User Journey

```
Start
  ↓
[Floating Button] 🛏️
  ↓ click
[ProductWizardModal opens]
  ↓
[ProductCategoryPicker]
┌─────────────────────────────────────┐
│ Select: Mattress | Pillow |         │
│         Bedsheet | Accessories      │
└─────────────────────────────────────┘
  ↓ selectCategory("mattress")
[ProductQuestionnaire]
┌─────────────────────────────────────┐
│ Q1: Sleep Position?                 │
│ [Option A] [Option B] [Option C]    │
│                                     │
│ Question 1 of 5        [Back] [Next]│
└─────────────────────────────────────┘
  ↓ loop through 5 questions
[ProductWizardResults]
┌─────────────────────────────────────┐
│ Recommended Mattresses              │
│ ┌──────────────────────────────────┐│
│ │ Cloud Comfort - 95% Match        ││
│ │ $899 | Rating: 4.8/5             ││
│ │ [View Details]                   ││
│ └──────────────────────────────────┘│
│ ┌──────────────────────────────────┐│
│ │ Supreme Support - 88% Match      ││
│ │ $1299 | Rating: 4.7/5            ││
│ │ [View Details]                   ││
│ └──────────────────────────────────┘│
│ [Back] [Continue Shopping]           │
└─────────────────────────────────────┘
  ↓
End (modal closes)
```

## Data Flow: Answer → Scoring → Recommendations

```
┌────────────────────────────────────────────────────────────┐
│ ProductQuestionnaire                                       │
│ (User selects answers)                                     │
└────────────────────────────────────────────────────────────┘
                          ↓
┌────────────────────────────────────────────────────────────┐
│ completeQuestionnaire(payload)                             │
│ {                                                          │
│   product_category: "mattress",                            │
│   answers: [                                               │
│     { question_id: "q1", answer_id: "opt_a" },            │
│     { question_id: "q2", answer_id: "opt_c" }             │
│   ]                                                        │
│ }                                                          │
└────────────────────────────────────────────────────────────┘
                          ↓
┌────────────────────────────────────────────────────────────┐
│ preferenceService.scoreProductAnswers()                    │
│ • Load mattressQuestions.json                              │
│ • For each answer, sum option.weights for all tags         │
│ • Output: { firmness: 8.5, support: 7.2, ... }            │
└────────────────────────────────────────────────────────────┘
                          ↓
┌────────────────────────────────────────────────────────────┐
│ preferenceService.getRecommendations()                     │
│ • Query products table WHERE category = "mattress"         │
│ • Match products to tag_scores                             │
│ • Rank by match percentage                                 │
│ • Return top 3-5 products                                  │
└────────────────────────────────────────────────────────────┘
                          ↓
┌────────────────────────────────────────────────────────────┐
│ ProductWizardResults                                       │
│ • Display recommended products with match scores           │
│ • User can view details or continue shopping               │
└────────────────────────────────────────────────────────────┘
                          ↓
┌────────────────────────────────────────────────────────────┐
│ preferenceService.savePreference()                         │
│ • Insert into user_product_preferences table               │
│ • Store: user_id, category, answers, tag_scores,          │
│   recommended_product_ids                                  │
└────────────────────────────────────────────────────────────┘
```

## Question File Structure

```
mattressQuestions.json
[
  {
    id: "q_position",
    text: "What is your primary sleeping position?",
    options: [
      {
        id: "pos_back",
        label: "Back sleeper",
        weights: {
          "support": 3,
          "medium": 2,
          "spinal_alignment": 3
        }
      },
      {
        id: "pos_side",
        label: "Side sleeper",
        weights: {
          "pressure_relief": 3,
          "soft": 2,
          "shoulder_support": 2
        }
      },
      ...
    ]
  },
  ... (4 more questions)
]
```

## Database Schema

```
user_product_preferences
├── id: UUID (PK)
├── user_id: UUID (FK → auth.users)
├── product_category: TEXT ('mattress' | 'pillow' | 'bedsheet' | 'accessories')
├── answers: JSONB
│   └── [
│         { question_id: "q1", answer_id: "opt_a" },
│         { question_id: "q2", answer_id: "opt_c" }
│       ]
├── tag_scores: JSONB
│   └── { "firmness": 8.5, "support": 7.2, "pressure_relief": 6.8 }
├── recommended_product_ids: TEXT[]
│   └── ["sku_001", "sku_002", "sku_003"]
├── created_at: TIMESTAMP
└── updated_at: TIMESTAMP
```

## Integration Points

### 1. App.tsx

- Provides `ProductWizardProvider` context wrapper
- Renders `<ProductWizardModal />` and `<ProductWizardFloatingButton />`
- Conditionally renders only for authenticated END_USER role

### 2. Session Context

- Used to fetch current `userId` for database saves
- Check authentication status before showing wizard

### 3. Products Table (TODO)

- Required for actual recommendation matching
- Schema: id, category, name, tags[], price, rating, sku, description
- Used by `preferenceService.getRecommendations()`

### 4. Theme Context

- Modal and components respect light/dark theme
- Uses Tailwind theme variables

## Scoring Algorithm

```
For each answer:
  1. Find the question in questions.json
  2. Find the selected option
  3. Extract option.weights object
  4. For each tag in weights:
       tagScores[tag] += weight

Result: { "firmness": X, "support": Y, "pressure_relief": Z, ... }

Recommendation Matching:
  1. Query products table by category
  2. Calculate overlap between product tags and user tag_scores
  3. Score = (sum of overlapping weights) / (total user weights)
  4. Sort by score, return top 3-5
```

## Component Props & Event Flow

### ProductCategoryPicker

```tsx
Props: None (uses context)
Events:
  click button → selectCategory(category) → change step to "questionnaire"
```

### ProductQuestionnaire

```tsx
Props: { category: ProductCategory }
Events:
  click option → setSelected(option.id)
  click Back → step = "category"
  click Next/Finish → completeQuestionnaire(answers)
```

### ProductWizardResults

```tsx
Props: {
  recommendations: ProductRecommendation[]
  category: string
}
Events:
  click Back → goBack() → step = "category"
  click Continue → closeWizard()
  click View Details → navigate to /pdp?category=mattress
```

## Error Handling Strategy

```
Try:
  → Score answers
  → Get recommendations
  → Save to DB
Catch:
  → Log to ErrorLogger
  → Show user-friendly toast
  → Offer retry option
  → Fall back to mock data (dev)
```

## Performance Considerations

1. **Question Loading**: Questions are imported as static JSON (no runtime cost)
2. **Scoring**: O(n\*m) where n=answers, m=tags per option (fast for <10 questions)
3. **Product Matching**: O(p) where p=products (paginate/limit results)
4. **Database**: Indexed on user_id + category for quick lookups

## Future Enhancements

1. **ML Recommendations**: Learn from user behavior over time
2. **Social Proof**: "People with your answers also liked..."
3. **A/B Testing**: Different question wordings, scoring algorithms
4. **Progress Saving**: Save incomplete answers, resume later
5. **Sharing**: Share quiz results with friends
6. **API Endpoint**: Export quiz data for external recommendation engines

## Testing Strategy

1. **Unit**: Score calculations with known inputs/outputs
2. **Component**: Storybook stories for UI variations
3. **Integration**: E2E test full flow (select → answer → results → save)
4. **Database**: Verify RLS policies, correct schema
5. **Performance**: Measure scoring time, DB query time
