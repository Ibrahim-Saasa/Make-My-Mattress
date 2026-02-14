-- Create table to store quiz results for analytics and personalization
CREATE TABLE IF NOT EXISTS public.sleep_quiz_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  anonymous_session_id text,
  answers jsonb NOT NULL,
  tag_scores jsonb NOT NULL,
  top_tags text[] NOT NULL,
  recommended_type text,
  recommended_models text[],
  source text DEFAULT 'web',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Optional: enable RLS and add example policies (adjust for your auth model)
-- ALTER TABLE public.sleep_quiz_results ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "allow_insert_authenticated" ON public.sleep_quiz_results FOR INSERT USING (auth.role() IS NOT NULL);
-- CREATE POLICY "allow_select_own" ON public.sleep_quiz_results FOR SELECT USING (user_id = auth.uid());
