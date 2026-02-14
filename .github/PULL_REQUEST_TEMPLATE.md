<!-- Title: feat/onboarding-studio-skeleton - Onboarding, Home & Studio skeletons -->

## Summary

Add scaffolding for Onboarding, Home, and Studio features to provide a place for iterative implementation and review. This PR includes placeholder components, Storybook stories, and context/service stubs to support further development.

## What I did ✅

- Added Onboarding skeletons:
  - `components/Onboarding/SplashScreen.tsx`
  - `components/Onboarding/OnboardingRouter.tsx`
  - `components/Onboarding/AuthGate.tsx`
  - `components/Onboarding/SleepQuiz.tsx`
  - `components/Onboarding/SleepQuizResult.tsx`
- Added Home skeletons:
  - `components/Home/HeroBanner.tsx`
  - `components/Home/CategoryGrid.tsx`
  - `components/Home/WhyUsCards.tsx`
  - `components/Home/BlogVlogList.tsx`
- Added Studio skeletons:
  - `components/Studio/StudioIntro.tsx`
  - `components/Studio/StudioStepper.tsx`
  - `components/Studio/ConfigurationCard.tsx`
  - `components/Studio/Live3DPreview.tsx` (placeholder)
  - `components/Studio/StudioSummary.tsx`
- Added contexts:
  - `contexts/OnboardingContext.tsx`
  - `contexts/ConfiguratorContext.tsx`
- Added services (stubs):
  - `services/contentService.ts`
  - `services/threeModelService.ts`
- Storybook stories for major components (stubs)
- Unit test stub: `components/Onboarding/SplashScreen.test.tsx`
- Minor TypeScript / Vite env typing fixes to support the new components

## Why this change?

- Provides a safe scaffolding for iterative development and review
- Allows designers and stakeholders to review UI/flow early through Storybook
- Separates concerns with contexts and service stubs for future integration

## How to test ✅

1. Pull the branch: `git fetch && git checkout feat/onboarding-studio-skeleton`
2. Run the app: `pnpm install && pnpm dev` and visit `/` -> navigate to `/onboarding` or `/studio` routes
3. Storybook stories were added to each component, but the project does not yet include Storybook configuration in `package.json`. If you want to preview them now, add Storybook to the repo and run `pnpm storybook` to verify the new stories appear (recommended as a follow-up).
4. Run tests: `pnpm test` (note: tests are stubs; one test exists for SplashScreen)

## Checklist (please complete before merge) ⚠️

- [ ] Design review + Storybook validation
- [ ] Add proper unit & integration tests
- [ ] Implement Supabase schema and API endpoints for content & config
- [ ] Add Live3DPreview integration using `<model-viewer>` MVP or `react-three-fiber`
- [ ] Accessibility checks and i18n review
- [ ] CI: Storybook visual test integration

## Follow-up work / TODOs

- Save quiz results to user profile (`sleep_quiz_results` table)
- Implement `contentService` to fetch banners and blog content (`content_items`, `banners`)
- `threeModelService` to serve 3D assets and configuration metadata
- Studio: pricing deltas, Add to Cart flow, persistent configs, Share feature

---

Please mark this PR as a draft if you want to iterate further before review. Comments and feedback welcome.
