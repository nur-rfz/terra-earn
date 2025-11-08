import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.80.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const authHeader = req.headers.get('Authorization')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { action, jobId, completionId, rewardAmount, photoUrls, notes } = await req.json();
    
    console.log(`Processing ${action} action for job ${jobId}`);

    let result;

    switch (action) {
      case 'claim': {
        // Use the database function to claim the job
        const { data, error } = await supabase.rpc('claim_job', { p_job_id: jobId });
        
        if (error) throw error;
        
        result = { completionId: data, status: 'claimed' };
        break;
      }

      case 'start': {
        // Update job completion to in_progress
        const { data, error } = await supabase
          .from('job_completions')
          .update({
            status: 'in_progress',
            started_at: new Date().toISOString(),
          })
          .eq('id', completionId)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;
        result = data;
        break;
      }

      case 'complete': {
        // Update job completion with photos and mark as completed
        const updateData: any = {
          status: 'completed',
          completed_at: new Date().toISOString(),
          reward_amount: rewardAmount,
        };

        if (photoUrls?.before) updateData.before_photo_url = photoUrls.before;
        if (photoUrls?.after) updateData.after_photo_url = photoUrls.after;
        if (notes) updateData.notes = notes;

        const { data, error } = await supabase
          .from('job_completions')
          .update(updateData)
          .eq('id', completionId)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;
        result = data;
        break;
      }

      case 'check': {
        // Check if job is available or get user's existing completion
        const { data: existingCompletion } = await supabase
          .from('job_completions')
          .select('*')
          .eq('job_id', jobId)
          .eq('user_id', user.id)
          .in('status', ['claimed', 'in_progress', 'completed', 'pending_verification'])
          .maybeSingle();

        if (existingCompletion) {
          result = { available: false, completion: existingCompletion };
        } else {
          // Check if job is claimed by someone else
          const { data, error } = await supabase.rpc('is_job_available', { p_job_id: jobId });
          if (error) throw error;
          result = { available: data, completion: null };
        }
        break;
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in job-actions:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});