import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Coastal locations in disadvantaged countries with high marine debris activity
const locations = [
  // Southeast Asia
  { name: "Manila Bay", lat: 14.5639, lng: 120.9726, city: "Manila, Philippines" },
  { name: "Kuta Beach", lat: -8.7185, lng: 115.1690, city: "Bali, Indonesia" },
  { name: "Pattaya Beach", lat: 12.9236, lng: 100.8825, city: "Pattaya, Thailand" },
  { name: "Vung Tau Beach", lat: 10.3460, lng: 107.0843, city: "Vung Tau, Vietnam" },
  
  // South Asia
  { name: "Juhu Beach", lat: 19.0990, lng: 72.8267, city: "Mumbai, India" },
  { name: "Versova Beach", lat: 19.1342, lng: 72.8119, city: "Mumbai, India" },
  { name: "Cox's Bazar", lat: 21.4272, lng: 92.0058, city: "Chittagong, Bangladesh" },
  { name: "Karachi Beach", lat: 24.8230, lng: 67.0285, city: "Karachi, Pakistan" },
  
  // Africa
  { name: "Labadi Beach", lat: 5.5467, lng: -0.1515, city: "Accra, Ghana" },
  { name: "Lekki Beach", lat: 6.4281, lng: 3.4219, city: "Lagos, Nigeria" },
  { name: "Durban Beach", lat: -29.8587, lng: 31.0218, city: "Durban, South Africa" },
  { name: "Mombasa Beach", lat: -4.0435, lng: 39.6682, city: "Mombasa, Kenya" },
  
  // Latin America
  { name: "Copacabana Beach", lat: -22.9711, lng: -43.1822, city: "Rio de Janeiro, Brazil" },
  { name: "Cartagena Beach", lat: 10.3932, lng: -75.4832, city: "Cartagena, Colombia" },
  { name: "Lima Beaches", lat: -12.0464, lng: -77.0428, city: "Lima, Peru" },
  { name: "Santo Domingo Beach", lat: 18.4861, lng: -69.9312, city: "Santo Domingo, Dominican Republic" },
  
  // Caribbean
  { name: "Kingston Harbor", lat: 17.9714, lng: -76.7931, city: "Kingston, Jamaica" },
  { name: "Port-au-Prince Bay", lat: 18.5944, lng: -72.3074, city: "Port-au-Prince, Haiti" },
  
  // Middle East
  { name: "Alexandria Beach", lat: 31.2001, lng: 29.9187, city: "Alexandria, Egypt" },
  { name: "Jeddah Beach", lat: 21.5433, lng: 39.1728, city: "Jeddah, Saudi Arabia" },
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
  
  // Generate 15-20 jobs across different locations
  const jobCount = 15 + Math.floor(Math.random() * 6);
  
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
