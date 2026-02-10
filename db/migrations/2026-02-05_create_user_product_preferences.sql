-- Create user_product_preferences table
-- Stores user responses to product questionnaires and recommended products

CREATE TABLE IF NOT EXISTS user_product_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_category TEXT NOT NULL CHECK (product_category IN ('mattress', 'pillow', 'bedsheet', 'accessories')),
  
  -- Store the raw answers as JSON
  answers JSONB NOT NULL DEFAULT '[]',
  
  -- Store computed tag scores (e.g., {"firmness": 8.5, "support": 7.2})
  tag_scores JSONB NOT NULL DEFAULT '{}',
  
  -- Store IDs of recommended products
  recommended_product_ids TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Composite index for user + category lookups
  UNIQUE(user_id, product_category, created_at)
);

-- Enable RLS
ALTER TABLE user_product_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own preferences
CREATE POLICY "Users can view their own preferences"
  ON user_product_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Users can insert their own preferences
CREATE POLICY "Users can insert their own preferences"
  ON user_product_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update their own preferences
CREATE POLICY "Users can update their own preferences"
  ON user_product_preferences
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Index for efficient querying
CREATE INDEX idx_user_product_preferences_user_id 
  ON user_product_preferences(user_id);

CREATE INDEX idx_user_product_preferences_category 
  ON user_product_preferences(product_category);

CREATE INDEX idx_user_product_preferences_created_at 
  ON user_product_preferences(created_at DESC);
