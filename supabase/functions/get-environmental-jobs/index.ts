import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// South India coastal and inland locations with environmental hazards
const locations = [
  // Kerala Coast
  { name: "Kovalam Beach", lat: 8.4004, lng: 76.9790, city: "Thiruvananthapuram, Kerala" },
  { name: "Varkala Beach", lat: 8.7379, lng: 76.7163, city: "Varkala, Kerala" },
  { name: "Alappuzha Beach", lat: 9.4981, lng: 76.3388, city: "Alappuzha, Kerala" },
  { name: "Fort Kochi Beach", lat: 9.9654, lng: 76.2424, city: "Kochi, Kerala" },
  { name: "Kozhikode Beach", lat: 11.2588, lng: 75.7804, city: "Kozhikode, Kerala" },
  { name: "Kannur Beach", lat: 11.8745, lng: 75.3704, city: "Kannur, Kerala" },
  { name: "Munambam Beach", lat: 10.1726, lng: 76.1751, city: "Ernakulam, Kerala" },
  { name: "Cherai Beach", lat: 10.1426, lng: 76.1784, city: "Ernakulam, Kerala" },
  
  // Tamil Nadu Coast
  { name: "Marina Beach", lat: 13.0499, lng: 80.2824, city: "Chennai, Tamil Nadu" },
  { name: "Elliot's Beach", lat: 13.0067, lng: 80.2669, city: "Chennai, Tamil Nadu" },
  { name: "Mahabalipuram Beach", lat: 12.6269, lng: 80.1992, city: "Mahabalipuram, Tamil Nadu" },
  { name: "Pondicherry Beach", lat: 11.9139, lng: 79.8145, city: "Pondicherry" },
  { name: "Rameswaram Beach", lat: 9.2876, lng: 79.3129, city: "Rameswaram, Tamil Nadu" },
  { name: "Kanyakumari Beach", lat: 8.0883, lng: 77.5385, city: "Kanyakumari, Tamil Nadu" },
  { name: "Tuticorin Beach", lat: 8.8053, lng: 78.1455, city: "Tuticorin, Tamil Nadu" },
  { name: "Nagapattinam Beach", lat: 10.7672, lng: 79.8449, city: "Nagapattinam, Tamil Nadu" },
  { name: "Cuddalore Beach", lat: 11.7480, lng: 79.7714, city: "Cuddalore, Tamil Nadu" },
  
  // Karnataka Coast
  { name: "Mangalore Beach", lat: 12.8698, lng: 74.8420, city: "Mangalore, Karnataka" },
  { name: "Karwar Beach", lat: 14.8138, lng: 74.1290, city: "Karwar, Karnataka" },
  { name: "Udupi Beach", lat: 13.3409, lng: 74.7421, city: "Udupi, Karnataka" },
  { name: "Gokarna Beach", lat: 14.5479, lng: 74.3188, city: "Gokarna, Karnataka" },
  { name: "Malpe Beach", lat: 13.3503, lng: 74.7033, city: "Udupi, Karnataka" },
  
  // Andhra Pradesh Coast
  { name: "Visakhapatnam Beach", lat: 17.7231, lng: 83.3012, city: "Visakhapatnam, Andhra Pradesh" },
  { name: "Rushikonda Beach", lat: 17.7833, lng: 83.3833, city: "Visakhapatnam, Andhra Pradesh" },
  { name: "Bheemunipatnam Beach", lat: 17.8902, lng: 83.4545, city: "Visakhapatnam, Andhra Pradesh" },
  { name: "Kakinada Beach", lat: 16.9891, lng: 82.2475, city: "Kakinada, Andhra Pradesh" },
  { name: "Machilipatnam Beach", lat: 16.1875, lng: 81.1389, city: "Machilipatnam, Andhra Pradesh" },
  { name: "Nellore Beach", lat: 14.4426, lng: 79.9865, city: "Nellore, Andhra Pradesh" },
  
  // Inland South India - Rivers and Lakes
  { name: "Periyar River", lat: 10.0261, lng: 76.2711, city: "Ernakulam, Kerala" },
  { name: "Cauvery River", lat: 12.4244, lng: 78.7194, city: "Tiruchirappalli, Tamil Nadu" },
  { name: "Krishna River", lat: 16.5062, lng: 80.6480, city: "Vijayawada, Andhra Pradesh" },
  { name: "Tungabhadra River", lat: 15.3350, lng: 76.4600, city: "Hampi, Karnataka" },
  { name: "Vembanad Lake", lat: 9.6050, lng: 76.4010, city: "Kottayam, Kerala" },
  { name: "Ulsoor Lake", lat: 12.9897, lng: 77.6215, city: "Bangalore, Karnataka" },
  { name: "Hussain Sagar Lake", lat: 17.4239, lng: 78.4738, city: "Hyderabad, Telangana" },
  
  // Urban Areas
  { name: "Chennai Port", lat: 13.1067, lng: 80.3000, city: "Chennai, Tamil Nadu" },
  { name: "Kochi Port", lat: 9.9674, lng: 76.2663, city: "Kochi, Kerala" },
  { name: "Visakhapatnam Port", lat: 17.6868, lng: 83.2185, city: "Visakhapatnam, Andhra Pradesh" },
  { name: "Mangalore Port", lat: 12.9141, lng: 74.8560, city: "Mangalore, Karnataka" },
  { name: "Bangalore Lakes", lat: 12.9716, lng: 77.5946, city: "Bangalore, Karnataka" },
  { name: "Hyderabad Lakes", lat: 17.3850, lng: 78.4867, city: "Hyderabad, Telangana" },
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
  
  // Generate 1000 jobs across South India locations
  const jobCount = 1000;
  
  for (let i = 0; i < jobCount; i++) {
    // Select a random location (reusing is fine for 1000 jobs)
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    // Select debris type
    const categoryData = debrisJobs[Math.floor(Math.random() * debrisJobs.length)];
    const item = categoryData.items[Math.floor(Math.random() * categoryData.items.length)];
    
    // Add slight coordinate variation for jobs at same location (up to ~1.1km spread)
    const latVariation = (Math.random() - 0.5) * 0.02;
    const lngVariation = (Math.random() - 0.5) * 0.02;
    
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
