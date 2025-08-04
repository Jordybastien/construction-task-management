import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TaskStatus } from '@/database/schemas/base.schema';
import type { FloorPlanWithStats } from '@/database/dtos/floorPlan.dto';
import type { TaskWithDetails } from '@/database/dtos/task.dto';
import type { RoomWithStats } from '@/database/dtos/room.dto';

interface LeafletFloorPlanProps {
  floorPlan: FloorPlanWithStats;
  tasks?: TaskWithDetails[];
  rooms?: RoomWithStats[];
  onTaskSelect?: (task: TaskWithDetails) => void;
  onTaskCreate?: (lat: number, lng: number) => void;
  onRoomSelect?: (room: RoomWithStats) => void;
}

// Status-based marker colors
const TASK_COLORS = {
  [TaskStatus.NOT_STARTED]: '#6b7280',
  [TaskStatus.IN_PROGRESS]: '#3b82f6',
  [TaskStatus.BLOCKED]: '#ef4444',
  [TaskStatus.FINAL_CHECK]: '#f59e0b',
  [TaskStatus.DONE]: '#10b981',
};

// TODO: Cleanup this implementation(useEffect)
const LeafletFloorPlan = ({
  floorPlan,
  tasks = [],
  rooms = [],
  onTaskSelect,
  onTaskCreate,
  onRoomSelect,
}: LeafletFloorPlanProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Custom CRS for floor plan coordinates
  const customCRS = L.CRS.Simple;

  useEffect(() => {
    if (!mapContainerRef.current || !floorPlan.image_url) return;

    // Initialize map with custom CRS
    const map = L.map(mapContainerRef.current, {
      crs: customCRS,
      minZoom: -2,
      maxZoom: 3,
      zoomSnap: 0.1,
      zoomDelta: 0.5,
    });

    mapRef.current = map;

    const imageBounds: L.LatLngBoundsExpression = [
      [0, 0],
      [floorPlan.image_height, floorPlan.image_width],
    ];

    // Add floor plan image as overlay
    L.imageOverlay(floorPlan.image_url, imageBounds).addTo(map);

    // Fit map to image bounds
    map.fitBounds(imageBounds);

    // Handle map clicks for task creation
    if (onTaskCreate) {
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        onTaskCreate(lat, lng);
      });
    }

    // Cleanup on unmount
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [floorPlan.image_url, onTaskCreate]);

  // Add task markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !tasks.length) return;

    const markers: L.Marker[] = [];

    tasks.forEach((task) => {
      const color = TASK_COLORS[task.status];

      // Create custom marker HTML with MapPin icon
      const markerHtml = `
        <div style="
          color: ${color};
          background: white;
          border: 2px solid ${color};
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        ">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-task-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([task.position_lat, task.position_lng], {
        icon: customIcon,
      })
        .addTo(map)
        .bindTooltip(task.title, {
          direction: 'top',
          offset: [0, -5],
        });

      // Handle marker click
      if (onTaskSelect) {
        marker.on('click', (e) => {
          L.DomEvent.stopPropagation(e);
          onTaskSelect(task);
        });
      }

      markers.push(marker);
    });

    // Cleanup markers on re-render
    return () => {
      markers.forEach((marker) => map.removeLayer(marker));
    };
  }, [tasks, onTaskSelect]);
  // Add room polygons
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !rooms.length) return;

    const roomLayers: L.Layer[] = [];

    rooms.forEach((room) => {
      try {
        // Parse boundary coordinates
        const coordinates = JSON.parse(room.boundary_coordinates);
        if (!Array.isArray(coordinates) || coordinates.length < 3) return;

        // Convert coordinates to Leaflet format
        const latlngs: L.LatLngExpression[] = coordinates.map(
          ([lat, lng]: [number, number]) => [lat, lng]
        );

        // Create polygon
        const polygon = L.polygon(latlngs, {
          color: '#3b82f6',
          fillColor: '#3b82f6',
          fillOpacity: 0.1,
          weight: 2,
          className: 'custom-room-polygon',
        }).addTo(map);

        // Add tooltip with room name
        polygon.bindTooltip(room.name, {
          direction: 'center',
          permanent: false,
        });

        // Handle polygon click
        if (onRoomSelect) {
          polygon.on('click', (e) => {
            L.DomEvent.stopPropagation(e);
            onRoomSelect(room);
          });
        }

        roomLayers.push(polygon);
      } catch (error) {
        console.warn(
          'Failed to parse room boundary coordinates:',
          room.name,
          error
        );
      }
    });

    // Cleanup room layers on re-render
    return () => {
      roomLayers.forEach((layer) => map.removeLayer(layer));
    };
  }, [rooms, onRoomSelect]);

  return (
    <div className="relative floor-plan-map-container">
      <div
        ref={mapContainerRef}
        className="h-[400px] w-full rounded-lg border-2 border-gray-200 bg-white"
        style={{ minHeight: '300px' }}
      />
    </div>
  );
};

export default LeafletFloorPlan;
