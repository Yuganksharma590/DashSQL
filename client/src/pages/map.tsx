import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Leaf } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Activity } from "@shared/schema";

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function Map() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const { data: activities } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  const activitiesWithLocation = activities?.filter(a => a.location?.lat && a.location?.lng) || [];

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([37.7749, -122.4194], 12); // Default to San Francisco

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !activitiesWithLocation.length) return;

    // Clear existing markers
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        layer.remove();
      }
    });

    // Add markers for activities
    const bounds = L.latLngBounds([]);
    
    activitiesWithLocation.forEach((activity) => {
      if (activity.location?.lat && activity.location?.lng) {
        const marker = L.marker([activity.location.lat, activity.location.lng])
          .addTo(mapInstanceRef.current!)
          .bindPopup(`
            <div style="font-family: Inter, sans-serif;">
              <strong style="color: hsl(142, 70%, 35%);">${activity.activityType}</strong>
              <p style="margin: 4px 0; font-size: 0.875rem;">${activity.quantity} ${activity.unit}</p>
              <p style="margin: 4px 0; font-size: 0.75rem; color: #666;">
                ${activity.carbonSaved.toFixed(1)} kg CO₂ saved
              </p>
              ${activity.location.name ? `<p style="margin: 4px 0; font-size: 0.75rem;">${activity.location.name}</p>` : ''}
            </div>
          `);

        bounds.extend([activity.location.lat, activity.location.lng]);
      }
    });

    // Fit map to show all markers
    if (activitiesWithLocation.length > 0) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [activitiesWithLocation]);

  return (
    <div className="p-6 md:p-8 h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2">Activity Map</h1>
        <p className="text-muted-foreground">View your eco-friendly activities on the map</p>
      </div>

      <div className="flex-1 min-h-0 grid gap-6 lg:grid-cols-4">
        {/* Map */}
        <Card className="lg:col-span-3 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Activity Locations
            </CardTitle>
            <CardDescription>
              {activitiesWithLocation.length} activities with location data
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-0">
            <div 
              ref={mapRef} 
              className="w-full h-full min-h-[400px] rounded-md border"
              data-testid="map-container"
            />
          </CardContent>
        </Card>

        {/* Activity Legend */}
        <Card>
          <CardHeader>
            <CardTitle>Mapped Activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activitiesWithLocation.length > 0 ? (
              <>
                {activitiesWithLocation.slice(0, 10).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-md bg-card border hover-elevate"
                    data-testid={`map-activity-${activity.id}`}
                  >
                    <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{activity.activityType}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.location?.name || "Unknown location"}
                      </p>
                      <div className="flex gap-1 mt-1">
                        <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                          {activity.carbonSaved.toFixed(1)} kg CO₂
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
                {activitiesWithLocation.length > 10 && (
                  <p className="text-xs text-muted-foreground text-center pt-2">
                    +{activitiesWithLocation.length - 10} more activities
                  </p>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No activities with location data</p>
                <p className="text-xs mt-1">Add locations when logging activities to see them here!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {!activitiesWithLocation.length && activities && activities.length > 0 && (
        <Card className="mt-6">
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <Leaf className="h-10 w-10 text-muted-foreground/50" />
              <div>
                <h3 className="font-semibold">Add locations to your activities</h3>
                <p className="text-sm text-muted-foreground">
                  You have {activities.length} activities without location data. Add locations when logging activities to visualize them on the map!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
