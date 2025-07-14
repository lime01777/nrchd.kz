import { route as ziggyRoute } from 'ziggy-js';

export default function route(name, params, absolute) {
    return ziggyRoute(name, params, absolute, Ziggy);
}
