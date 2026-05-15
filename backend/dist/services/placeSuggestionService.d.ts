export interface PlaceSuggestion {
    placeId: string;
    displayName: string;
    address: string;
    latitude: number;
    longitude: number;
    source: 'history' | 'geoapify';
}
export declare const searchPlaces: (userId: string, input: string, lat?: number, lng?: number) => Promise<PlaceSuggestion[]>;
export declare const getPlaceDetails: (placeId: string) => Promise<PlaceSuggestion | null>;
declare const _default: {
    searchPlaces: (userId: string, input: string, lat?: number, lng?: number) => Promise<PlaceSuggestion[]>;
    getPlaceDetails: (placeId: string) => Promise<PlaceSuggestion | null>;
};
export default _default;
//# sourceMappingURL=placeSuggestionService.d.ts.map