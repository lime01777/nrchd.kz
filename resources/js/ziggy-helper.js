// Import the route function from ziggy-js
import { route as ziggyRoute } from 'ziggy-js';

// Export a helper function that wraps the ziggy route function
export function route(name, params, absolute) {
    try {
        return ziggyRoute(name, params, absolute);
    } catch (error) {
        console.error(`Error generating route '${name}':`, error);
        return '#'; // Fallback to a hash link
    }
}
