"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Map,
  AdvancedMarker,
  useMap,
  MapMouseEvent,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// ─── Types ────────────────────────────────────────────────────────────────────

type LatLng = { lat: number; lng: number };

export type ResolvedAddress = {
  address_detail?: string;
  village?: string;
  district?: string;
  city?: string;
  province?: string;
  postal_code?: string;
};

// ─── Address component parser ─────────────────────────────────────────────────

function parseAddressComponents(
  components: google.maps.GeocoderAddressComponent[],
): ResolvedAddress {
  const get = (...types: string[]) =>
    types.reduce<string>(
      (found, t) => found || (components.find((c) => c.types.includes(t))?.long_name ?? ""),
      "",
    );

  return {
    address_detail: [get("street_number"), get("route")].filter(Boolean).join(" "),
    village:
      get("administrative_area_level_4") ||
      get("sublocality_level_1") ||
      get("sublocality"),
    district: get("administrative_area_level_3"),
    city: get("administrative_area_level_2") || get("locality"),
    province: get("administrative_area_level_1"),
    postal_code: get("postal_code"),
  };
}

// ─── Places Search ────────────────────────────────────────────────────────────

function PlacesSearch({
  onPlaceSelected,
}: {
  onPlaceSelected: (pos: LatLng, resolved: ResolvedAddress) => void;
}) {
  const placesLib = useMapsLibrary("places");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!placesLib || !inputRef.current) return;

    const autocomplete = new placesLib.Autocomplete(inputRef.current, {
      fields: ["address_components", "geometry"],
      componentRestrictions: { country: "id" },
    });

    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry?.location) return;

      const pos = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      const resolved = place.address_components
        ? parseAddressComponents(place.address_components)
        : {};

      onPlaceSelected(pos, resolved);
    });

    return () => google.maps.event.removeListener(listener);
  }, [placesLib, onPlaceSelected]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#727272] pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        placeholder="Cari alamat di peta..."
        className="h-10 w-full rounded-md border border-gray-200 bg-white pl-9 pr-4 text-sm outline-none transition-colors focus:border-[#ffcf02] focus:ring-1 focus:ring-[#ffcf02]"
      />
    </div>
  );
}

// ─── Map Content (inside APIProvider context) ─────────────────────────────────

function MapContent({
  position,
  onPositionChange,
  onAddressResolved,
}: {
  position: LatLng;
  onPositionChange: (pos: LatLng) => void;
  onAddressResolved: (resolved: ResolvedAddress) => void;
}) {
  const map = useMap();
  const geocodingLib = useMapsLibrary("geocoding");
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  useEffect(() => {
    if (geocodingLib) geocoderRef.current = new geocodingLib.Geocoder();
  }, [geocodingLib]);

  const reverseGeocode = useCallback(
    (pos: LatLng) => {
      geocoderRef.current?.geocode({ location: pos }, (results, status) => {
        if (status === "OK" && results?.[0]?.address_components) {
          onAddressResolved(parseAddressComponents(results[0].address_components));
        }
      });
    },
    [onAddressResolved],
  );

  const handleMapClick = useCallback(
    (e: MapMouseEvent) => {
      if (!e.detail.latLng) return;
      const pos = { lat: e.detail.latLng.lat, lng: e.detail.latLng.lng };
      onPositionChange(pos);
      map?.panTo(pos);
      reverseGeocode(pos);
    },
    [map, onPositionChange, reverseGeocode],
  );

  const handleDragEnd = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      onPositionChange(pos);
      reverseGeocode(pos);
    },
    [onPositionChange, reverseGeocode],
  );

  const handlePlaceSelected = useCallback(
    (pos: LatLng, resolved: ResolvedAddress) => {
      onPositionChange(pos);
      onAddressResolved(resolved);
      map?.panTo(pos);
      map?.setZoom(17);
    },
    [map, onPositionChange, onAddressResolved],
  );

  return (
    <div className="flex h-full flex-col gap-2">
      <PlacesSearch onPlaceSelected={handlePlaceSelected} />
      <div className="flex-1 min-h-0">
        <Map
          defaultCenter={position}
          defaultZoom={15}
          mapId="bulky-map"
          gestureHandling="greedy"
          disableDefaultUI={false}
          onClick={handleMapClick}
          className="h-full w-full rounded-md"
        >
          <AdvancedMarker
            position={position}
            draggable
            onDragEnd={handleDragEnd}
          />
        </Map>
      </div>
    </div>
  );
}

// ─── Map Picker Dialog ────────────────────────────────────────────────────────

export function MapPickerDialog({
  open,
  onOpenChange,
  latitude,
  longitude,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  latitude: string;
  longitude: string;
  onConfirm: (lat: string, lng: string, resolved?: ResolvedAddress) => void;
}) {
  const initialLat = parseFloat(latitude) || -6.2;
  const initialLng = parseFloat(longitude) || 106.816;

  const [position, setPosition] = useState<LatLng>({ lat: initialLat, lng: initialLng });
  const [resolved, setResolved] = useState<ResolvedAddress>({});

  // Reset state when dialog opens with potentially different coords
  useEffect(() => {
    if (open) {
      setPosition({ lat: parseFloat(latitude) || -6.2, lng: parseFloat(longitude) || 106.816 });
      setResolved({});
    }
  }, [open, latitude, longitude]);

  const handleConfirm = () => {
    const hasResolved = Object.values(resolved).some(Boolean);
    onConfirm(String(position.lat), String(position.lng), hasResolved ? resolved : undefined);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-0 p-0">
        <DialogHeader className="px-6 pt-6 pb-3">
          <DialogTitle>Pilih Lokasi</DialogTitle>
          <p className="text-sm text-[#727272]">
            Cari alamat atau klik/seret pin untuk menentukan titik lokasi.
          </p>
        </DialogHeader>

        <div className="h-[400px] w-full px-6">
          <MapContent
            position={position}
            onPositionChange={setPosition}
            onAddressResolved={setResolved}
          />
        </div>

        <div className="flex items-center gap-2 px-6 py-3 text-xs text-[#727272]">
          <MapPin className="size-3.5 shrink-0 text-[#ffcf02]" />
          <span>
            {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
          </span>
          {Object.values(resolved).some(Boolean) && (
            <span className="ml-auto rounded-full bg-[#fff7cc] px-2 py-0.5 text-[10px] font-semibold text-[#b38a00]">
              Alamat terdeteksi
            </span>
          )}
        </div>

        <DialogFooter className="px-6 pb-6">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button
            type="button"
            className="bg-[#ffcf02] text-black shadow-none hover:bg-[#f0c300]"
            onClick={handleConfirm}
          >
            Konfirmasi Lokasi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Inline trigger button ────────────────────────────────────────────────────

export function MapPickerTrigger({
  latitude,
  longitude,
  onConfirm,
}: {
  latitude: string;
  longitude: string;
  onConfirm: (lat: string, lng: string, resolved?: ResolvedAddress) => void;
}) {
  const [open, setOpen] = useState(false);

  const hasCoords = parseFloat(latitude) !== 0 || parseFloat(longitude) !== 0;

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="h-9 w-full gap-2 border-dashed text-sm text-[#727272] shadow-none hover:border-[#ffcf02] hover:bg-[#fff7cc] hover:text-black"
        onClick={() => setOpen(true)}
      >
        <MapPin className="size-4 shrink-0" />
        {hasCoords ? (
          <span className="truncate">
            {parseFloat(latitude).toFixed(5)}, {parseFloat(longitude).toFixed(5)}
          </span>
        ) : (
          "Pilih Titik Lokasi di Peta"
        )}
      </Button>

      <MapPickerDialog
        open={open}
        onOpenChange={setOpen}
        latitude={latitude}
        longitude={longitude}
        onConfirm={onConfirm}
      />
    </>
  );
}
