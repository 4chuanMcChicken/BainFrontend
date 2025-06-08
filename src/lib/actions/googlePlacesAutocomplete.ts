import { browser } from '$app/environment';
import { PUBLIC_GOOGLE_MAPS_API_KEY } from '$env/static/public';

declare global {
    interface Window {
        google: typeof google;
        initGooglePlaces: () => void;
    }
}

// Simple debounce implementation
function debounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

interface AutocompleteOptions {
    apiKey?: string;
    onSelect?: (place: { 
        formatted_address?: string;
        address_components?: Array<{
            long_name: string;
            short_name: string;
            types: string[];
        }>;
        geometry?: {
            location: {
                lat: () => number;
                lng: () => number;
            };
        };
    }) => void;
    onError?: (error: Error) => void;
}

let scriptLoaded = false;
let scriptLoading = false;
let queue: (() => void)[] = [];

function loadGooglePlacesScript(apiKey: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (!browser) {
            resolve();
            return;
        }

        if (scriptLoaded) {
            resolve();
            return;
        }

        if (scriptLoading) {
            queue.push(resolve);
            return;
        }

        scriptLoading = true;
        window.initGooglePlaces = () => {
            scriptLoaded = true;
            scriptLoading = false;
            resolve();
            queue.forEach(cb => cb());
            queue = [];
        };

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGooglePlaces`;
        script.async = true;
        script.defer = true;
        script.onerror = () => {
            scriptLoading = false;
            reject(new Error('Failed to load Google Places API'));
            queue.forEach(cb => cb());
            queue = [];
        };

        document.head.appendChild(script);
    });
}

export function googlePlacesAutocomplete(
    node: HTMLInputElement,
    options: AutocompleteOptions = {}
) {
    const apiKey = PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
        console.error('Google Maps API key not found in environment variables');
        return;
    }

    let autocomplete: any = null;

    const initAutocomplete = async () => {
        try {
            await loadGooglePlacesScript(apiKey);

            autocomplete = new window.google.maps.places.Autocomplete(node, {
                types: ['address'],
            });

            autocomplete.addListener('place_changed', () => {
                const place = autocomplete?.getPlace();
                if (place?.formatted_address) {
                    node.value = place.formatted_address;
                    options.onSelect?.(place);
                }
            });

            // Style the autocomplete dropdown
            const container = node.parentElement;
            if (container) {
                const pacContainer = container.querySelector('.pac-container');
                if (pacContainer instanceof HTMLElement) {
                    pacContainer.classList.add(
                        'mt-1',
                        'bg-white',
                        'rounded-md',
                        'shadow-lg',
                        'border',
                        'border-gray-300'
                    );
                }
            }
        } catch (error) {
            console.error('Error initializing Google Places Autocomplete:', error);
            options.onError?.(error as Error);
        }
    };

    // Debounce the input to avoid excessive API calls
    const debouncedInput = debounce(() => {
        if (node.value.length >= 3) {
            // Trigger autocomplete
            const event = new Event('keydown', { bubbles: true });
            node.dispatchEvent(event);
        }
    }, 300);

    node.addEventListener('input', debouncedInput);

    // Initialize autocomplete
    initAutocomplete();

    return {
        destroy() {
            if (autocomplete) {
                window.google?.maps?.event?.clearInstanceListeners(autocomplete);
            }
            node.removeEventListener('input', debouncedInput);
        }
    };
} 