/**
 * RouteHelper.js - Centralized utility for handling route generation with proper locale support
 * 
 * This utility provides consistent route handling with the following features:
 * - Automatically includes locale parameter in all routes
 * - Safely handles missing routes with fallbacks
 * - Provides descriptive console warnings for debugging
 * - Handles edge cases like nested locale parameters
 * 
 * NOTE: As of version 2.0, this utility works in tandem with ziggyPatch.js, which globally
 * patches the route() function to automatically include locale parameter.
 */

/**
 * Generate a URL for a route with proper locale handling
 * 
 * @param {string} routeName - Name of the route
 * @param {object} params - Additional route parameters
 * @param {string} defaultLocale - Fallback locale if none provided (defaults to 'ru')
 * @returns {string} - URL for the route
 */
export function getLocaleRoute(routeName, params = {}, defaultLocale = 'ru') {
    try {
        // Get locale either from params or default
        const locale = params.locale || defaultLocale;
        
        // Early exit for missing route name
        if (!routeName) {
            console.warn('RouteHelper: No route name provided');
            return '#';
        }

        // Known missing routes that we should handle silently (no console warnings)
        const knownMissingRoutes = [
            'services.medicalExpertise'
            // Add other known missing routes as they are discovered
        ];
        
        // Check if route exists in Ziggy
        if (route().has(routeName)) {
            // Make a copy of params to avoid modifying the original
            const routeParams = { ...params };
            
            // Always ensure locale is included
            if (!routeParams.locale) {
                routeParams.locale = locale;
            }
            
            // Handle nested params.locale if it exists
            if (routeParams.params && routeParams.params.locale) {
                delete routeParams.params.locale;
            }
            
            return route(routeName, routeParams);
        } else if (!knownMissingRoutes.includes(routeName)) {
            // Only log warnings for routes that aren't in our known missing routes list
            console.warn(`RouteHelper: Route '${routeName}' not found in Ziggy routes list`);
            // Log to our application log file
            try {
                if (typeof window !== 'undefined' && window.logToFile) {
                    window.logToFile(`Missing route: ${routeName}`, 'warning');
                }
            } catch (e) {
                // Silently fail if logging function isn't available
            }
            return '#';
        } else {
            // Silently handle known missing routes
            return '#';
        }
    } catch (error) {
        console.error(`RouteHelper: Error generating route for '${routeName}':`, error);
        return '#';
    }
}

/**
 * Get current application locale from page props or localStorage
 * 
 * @returns {string} - Current locale code (e.g., 'ru', 'en', 'kz')
 */
export function getCurrentLocale() {
    try {
        // Try to get locale from Inertia page props if available
        if (typeof usePage === 'function') {
            try {
                const { locale } = usePage().props;
                if (locale) return locale;
            } catch (e) {
                // Silently fail if usePage is not available
            }
        }
        
        // Fallback to localStorage
        const storedLocale = localStorage.getItem('locale');
        if (storedLocale && ['ru', 'en', 'kz'].includes(storedLocale)) {
            return storedLocale;
        }
        
        // Default fallback
        return 'ru';
    } catch (error) {
        console.error('RouteHelper: Error getting current locale:', error);
        return 'ru';
    }
}

/**
 * Generate URL for language switching with proper handling of current routes
 * 
 * @param {string} targetLocale - Target locale code ('ru', 'en', 'kz')
 * @returns {string} - URL with the proper locale
 */
export function getLanguageSwitchUrl(targetLocale) {
    try {
        // Handle home page special case
        if (window.location.pathname === '/' || 
            window.location.pathname === '/ru' || 
            window.location.pathname === '/en' || 
            window.location.pathname === '/kz') {
            return `/${targetLocale}`;
        }
        
        // Try Ziggy route generation if possible
        const currentRoute = route().current();
        if (currentRoute) {
            // Get current parameters without locale
            const params = { ...route().params };
            
            // Set the new locale
            params.locale = targetLocale;
            
            // Clean up any nested locale params
            if (params.params && params.params.locale) {
                delete params.params.locale;
            }
            
            return route(currentRoute, params);
        }
        
        // Fallback to URL path manipulation
        const currentPath = window.location.pathname;
        
        // Replace locale prefix if it exists
        if (currentPath.match(/^\/(ru|kz|en)($|\/)/)) {
            return currentPath.replace(/^\/(ru|kz|en)($|\/)/, `/${targetLocale}$2`);
        }
        
        // Otherwise add locale prefix
        return `/${targetLocale}${currentPath.startsWith('/') ? currentPath : '/' + currentPath}`;
    } catch (error) {
        console.error('RouteHelper: Error generating language switch URL:', error);
        return `/${targetLocale}`;
    }
}

export default {
    getLocaleRoute,
    getCurrentLocale,
    getLanguageSwitchUrl
};
