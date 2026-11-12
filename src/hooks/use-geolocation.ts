'use client';

import { useCallback, useEffect, useState } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  error: string | null;
  isLoading: boolean;
}

export function useGeolocation(options?: PositionOptions) {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    isLoading: true,
  });

  const updatePosition = useCallback((position: GeolocationPosition) => {
    setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      error: null,
      isLoading: false,
    });
  }, []);

  const handleError = useCallback((error: GeolocationPositionError) => {
    setState((prev) => ({
      ...prev,
      error: error.message,
      isLoading: false,
    }));
  }, []);

  const refresh = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: 'Geolocation is not supported by this browser.',
        isLoading: false,
      }));
      return;
    }
    setState((prev) => ({ ...prev, isLoading: true }));
    navigator.geolocation.getCurrentPosition(updatePosition, handleError, options);
  }, [updatePosition, handleError, options]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { ...state, refresh };
}
