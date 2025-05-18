import '@testing-library/jest-dom';

// Mock matchMedia for components that might use it (like some Ant Design components)
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {},
    addEventListener: function() {},
    removeEventListener: function() {},
    dispatchEvent: function() { return false; },
  };
};

// Suppress console errors from Ant Design component warnings during tests
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' && 
    (args[0].includes('Warning: ReactDOM.render') || 
     args[0].includes('Warning: React does not recognize') ||
     args[0].includes('Warning: Each child in a list should have a unique "key" prop'))
  ) {
    return;
  }
  originalError(...args);
};