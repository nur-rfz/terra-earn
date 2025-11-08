-- Create storage bucket for job photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('job-photos', 'job-photos', true);

-- Create table for job completion data including photos
CREATE TABLE public.job_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  job_id TEXT NOT NULL,
  before_photo_url TEXT,
  after_photo_url TEXT,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reward_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_verification'
);

-- Enable Row Level Security
ALTER TABLE public.job_completions ENABLE ROW LEVEL SECURITY;

-- Create policies for job_completions
CREATE POLICY "Users can view their own job completions"
ON public.job_completions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own job completions"
ON public.job_completions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create storage policies for job photos
CREATE POLICY "Job photos are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'job-photos');

CREATE POLICY "Users can upload their own job photos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'job-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own job photos"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'job-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own job photos"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'job-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create index for faster queries
CREATE INDEX idx_job_completions_user_id ON public.job_completions(user_id);
CREATE INDEX idx_job_completions_job_id ON public.job_completions(job_id);