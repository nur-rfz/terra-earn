-- Add more statuses to job_completions for the full workflow
-- Update the status column to support: claimed, in_progress, completed, verified, rejected

-- First, add claimed_at timestamp to track when jobs are reserved
ALTER TABLE public.job_completions
ADD COLUMN IF NOT EXISTS claimed_at timestamp with time zone;

-- Add started_at timestamp to track when work begins
ALTER TABLE public.job_completions
ADD COLUMN IF NOT EXISTS started_at timestamp with time zone;

-- Add notes column for additional context
ALTER TABLE public.job_completions
ADD COLUMN IF NOT EXISTS notes text;

-- Add verification timestamp
ALTER TABLE public.job_completions
ADD COLUMN IF NOT EXISTS verified_at timestamp with time zone;

-- Create index on job_id and status for faster queries
CREATE INDEX IF NOT EXISTS idx_job_completions_job_status 
ON public.job_completions(job_id, status);

-- Create index on user_id and status
CREATE INDEX IF NOT EXISTS idx_job_completions_user_status 
ON public.job_completions(user_id, status);

-- Add RLS policy for users to update their own job completions
CREATE POLICY "Users can update their own job completions"
ON public.job_completions
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create a function to check if a job is already claimed by someone
CREATE OR REPLACE FUNCTION public.is_job_available(p_job_id text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 
    FROM public.job_completions 
    WHERE job_id = p_job_id 
    AND status IN ('claimed', 'in_progress', 'completed', 'pending_verification')
    AND completed_at > NOW() - INTERVAL '24 hours'
  );
END;
$$;

-- Create a function to claim a job
CREATE OR REPLACE FUNCTION public.claim_job(p_job_id text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_completion_id uuid;
BEGIN
  -- Check if job is available
  IF NOT public.is_job_available(p_job_id) THEN
    RAISE EXCEPTION 'Job is already claimed by another user';
  END IF;
  
  -- Create a new job completion record
  INSERT INTO public.job_completions (
    user_id,
    job_id,
    status,
    claimed_at,
    reward_amount
  ) VALUES (
    auth.uid(),
    p_job_id,
    'claimed',
    NOW(),
    0 -- Will be updated when job is completed
  )
  RETURNING id INTO v_completion_id;
  
  RETURN v_completion_id;
END;
$$;