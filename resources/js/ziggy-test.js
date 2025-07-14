// This file is just to test if Ziggy is working correctly
import { Ziggy } from './ziggy';
import { route } from 'ziggy-js';

console.log('Ziggy routes:', Ziggy.routes);
console.log('Home route:', route('home', [], false, Ziggy));

// Export a test function
export function testZiggy() {
    return {
        routes: Ziggy.routes,
        homeRoute: route('home', [], false, Ziggy)
    };
}
