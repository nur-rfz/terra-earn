import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Real coastal locations with high debris activity
const locations = [
  { name: "Santa Monica Beach", lat: 34.0195, lng: -118.4912, city: "Santa Monica, CA" },
  { name: "Coney Island Beach", lat: 40.5755, lng: -73.9707, city: "Brooklyn, NY" },
  { name: "Miami Beach", lat: 25.7907, lng: -80.1300, city: "Miami, FL" },
  { name: "Galveston Beach", lat: 29.3013, lng: -94.7977, city: "Galveston, TX" },
  { name: "Ocean Beach", lat: 37.7694, lng: -122.5108, city: "San Francisco, CA" },
  { name: "Huntington Beach", lat: 33.6595, lng: -117.9988, city: "Huntington Beach, CA" },
  { name: "Myrtle Beach", lat: 33.6891, lng: -78.8867, city: "Myrtle Beach, SC" },
  { name: "Venice Beach", lat: 33.9850, lng: -118.4695, city: "Los Angeles, CA" },
];

// Marine Debris Tracker categories and common items
const debrisJobs = [
  {
    category: "trash",
    items: [
      { type: "Plastic bottles", urgency: "high", baseReward: 15 },
      { type: "Food wrappers", urgency: "medium", baseReward: 10 },
      { type: "Cigarette butts", urgency: "high", baseReward: 12 },
      { type: "Plastic bags", urgency: "high", baseReward: 15 },
      { type: "Straws and stirrers", urgency: "medium", baseReward: 8 },
    ]
  },
  {
    category: "pollution",
    items: [
      { type: "Oil spill residue", urgency: "critical", baseReward: 25 },
      { type: "Chemical containers", urgency: "critical", baseReward: 30 },
      { type: "Medical waste", urgency: "critical", baseReward: 35 },
      { type: "Industrial debris", urgency: "high", baseReward: 20 },
    ]
  },
  {
    category: "reporting",
    items: [
      { type: "Abandoned fishing gear", urgency: "high", baseReward: 18 },
      { type: "Large debris accumulation", urgency: "medium", baseReward: 12 },
      { type: "Wildlife hazard", urgency: "critical", baseReward: 20 },
      { type: "Illegal dumping site", urgency: "high", baseReward: 22 },
    ]
  }
];

function generateJobs() {
  const jobs = [];
  const usedLocations = new Set();
  
  // Generate 12-15 jobs across different locations
  const jobCount = 12 + Math.floor(Math.random() * 4);
  
  for (let i = 0; i < jobCount; i++) {
    // Select a location, preferring unused ones
    let location;
    if (usedLocations.size < locations.length) {
      do {
        location = locations[Math.floor(Math.random() * locations.length)];
      } while (usedLocations.has(location.name) && usedLocations.size < locations.length);
      usedLocations.add(location.name);
    } else {
      location = locations[Math.floor(Math.random() * locations.length)];
    }
    
    // Select debris type
    const categoryData = debrisJobs[Math.floor(Math.random() * debrisJobs.length)];
    const item = categoryData.items[Math.floor(Math.random() * categoryData.items.length)];
    
    // Add slight coordinate variation for jobs at same beach
    const latVariation = (Math.random() - 0.5) * 0.01;
    const lngVariation = (Math.random() - 0.5) * 0.01;
    
    // Calculate distance (simulated - in real app would use user's location)
    const distance = (Math.random() * 15 + 0.5).toFixed(1);
    
    jobs.push({
      id: `job-${Date.now()}-${i}`,
      title: `Clean up ${item.type}`,
      location: location.city,
      reward: item.baseReward + Math.floor(Math.random() * 5),
      duration: Math.floor(Math.random() * 30) + 15, // 15-45 minutes
      category: categoryData.category,
      urgency: item.urgency,
      distance: `${distance} mi`,
      lat: location.lat + latVariation,
      lng: location.lng + lngVariation,
      description: `Help clean up ${item.type.toLowerCase()} debris at ${location.name}. This is part of the Marine Debris Tracker initiative to monitor and remove pollution from our coastlines.`,
      reportedAt: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString(), // Within last 3 days
    });
  }
  
  // Sort by urgency (critical first) and then by reward
  const urgencyOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
  jobs.sort((a, b) => {
    const urgencyDiff = (urgencyOrder[a.urgency] ?? 3) - (urgencyOrder[b.urgency] ?? 3);
    if (urgencyDiff !== 0) return urgencyDiff;
    return b.reward - a.reward;
  });
  
  return jobs;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Generating environmental jobs based on marine debris data...');
    
    const jobs = generateJobs();
    
    console.log(`Generated ${jobs.length} environmental cleanup jobs`);

    return new Response(
      JSON.stringify({ jobs }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error generating jobs:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
