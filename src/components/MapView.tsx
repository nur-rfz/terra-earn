import { useEffect, useState } from "react";
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from "@vis.gl/react-google-maps";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, DollarSign, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MicroJob {
  id: string;
  title: string;
  location: string;
  reward: number;
  duration: number | string;
  category: "trash" | "pollution" | "reporting";
  urgency: "low" | "medium" | "high" | "critical";
  distance: string;
  lat: number;
  lng: number;
  description?: string;
  reportedAt?: string;
}

interface MapViewProps {
  jobs: MicroJob[];
}

const MapView = ({ jobs }: MapViewProps) => {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState<string>("");
  const [selectedJob, setSelectedJob] = useState<MicroJob | null>(null);
  const [loading, setLoading] = useState(true);

  const formatDuration = (duration: number | string) => {
    if (typeof duration === 'string') return duration;
    return `${duration} min`;
  };

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("get-maps-config");
        if (error) throw error;
        setApiKey(data.apiKey);
      } catch (error) {
        console.error("Error fetching Maps API key:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApiKey();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[500px] rounded-lg bg-muted animate-pulse flex items-center justify-center">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div className="w-full h-[500px] rounded-lg bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">Map configuration error</p>
      </div>
    );
  }

  // Calculate center of all jobs
  const centerLat = jobs.reduce((sum, job) => sum + job.lat, 0) / jobs.length;
  const centerLng = jobs.reduce((sum, job) => sum + job.lng, 0) / jobs.length;

  return (
    <APIProvider apiKey={apiKey}>
      <div className="w-full h-[500px] rounded-lg overflow-hidden border border-border">
        <Map
          defaultCenter={{ lat: centerLat, lng: centerLng }}
          defaultZoom={13}
          mapId="eco-action-map"
          gestureHandling="greedy"
        >
          {jobs.map((job) => (
            <AdvancedMarker
              key={job.id}
              position={{ lat: job.lat, lng: job.lng }}
              onClick={() => setSelectedJob(job)}
            >
              <Pin
                background={
                  job.urgency === "critical" ? "#dc2626" :
                  job.urgency === "high" ? "#ef4444" : 
                  job.urgency === "medium" ? "#f59e0b" : 
                  "#10b981"
                }
                borderColor="#fff"
                glyphColor="#fff"
              />
            </AdvancedMarker>
          ))}

          {selectedJob && (
            <InfoWindow
              position={{ lat: selectedJob.lat, lng: selectedJob.lng }}
              onCloseClick={() => setSelectedJob(null)}
            >
              <Card className="border-0 shadow-none">
                <CardContent className="p-3">
                  <h3 className="font-semibold text-sm mb-2">{selectedJob.title}</h3>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {selectedJob.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDuration(selectedJob.duration)}
                    </div>
                    <div className="flex items-center gap-1 text-primary font-semibold">
                      <DollarSign className="w-3 h-3" />
                      {selectedJob.reward}
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/job/${selectedJob.id}`)}
                    className="mt-2 w-full bg-primary text-primary-foreground text-xs py-1 px-2 rounded hover:bg-primary/90 transition-colors"
                  >
                    View Details
                  </button>
                </CardContent>
              </Card>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
};

export default MapView;
