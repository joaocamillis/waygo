export declare const autocomplete: (input: string, lat?: number, lng?: number, lang?: string, limit?: number) => Promise<any>;
export declare const reverseGeocode: (lat: number, lng: number) => Promise<{
    latitude: number;
    longitude: number;
    address: any;
    displayName: any;
} | null>;
export declare const routing: (originLat: number, originLng: number, destinationLat: number, destinationLng: number) => Promise<{
    distanceKm: number;
    durationMin: number;
    coordinates: {
        latitude: number;
        longitude: number;
    }[] | null;
} | null>;
declare const _default: {
    autocomplete: (input: string, lat?: number, lng?: number, lang?: string, limit?: number) => Promise<any>;
    reverseGeocode: (lat: number, lng: number) => Promise<{
        latitude: number;
        longitude: number;
        address: any;
        displayName: any;
    } | null>;
    routing: (originLat: number, originLng: number, destinationLat: number, destinationLng: number) => Promise<{
        distanceKm: number;
        durationMin: number;
        coordinates: {
            latitude: number;
            longitude: number;
        }[] | null;
    } | null>;
};
export default _default;
//# sourceMappingURL=geoapifyService.d.ts.map