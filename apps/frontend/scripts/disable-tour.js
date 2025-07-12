/**
 * Quick script to disable the tour for testing
 * Run this in the browser console to disable the tour
 */

// Disable tour
localStorage.setItem('bitebase-tour-completed', 'true');
localStorage.setItem('bitebase-tour-skipped', 'true');

console.log('✅ Tour disabled! Refresh the page to see the dashboard without the tour.');
console.log('To re-enable the tour, run: localStorage.removeItem("bitebase-tour-completed"); localStorage.removeItem("bitebase-tour-skipped"); location.reload();');
