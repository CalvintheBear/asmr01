// SSR polyfills for browser globals
if (typeof global !== 'undefined') {
  // 在服务器端提供 self 的 polyfill
  if (!global.self) {
    global.self = global;
  }
  
  // 在服务器端提供 window 的 polyfill（如果需要）
  if (!global.window) {
    global.window = global;
  }
  
  // 在服务器端提供 document 的基础 polyfill
  if (!global.document) {
    global.document = {
      createElement: () => ({}),
      addEventListener: () => {},
      removeEventListener: () => {},
    };
  }
  
  // 在服务器端提供 navigator 的基础 polyfill
  if (!global.navigator) {
    global.navigator = {
      userAgent: 'Node.js',
    };
  }
  
  // 在服务器端提供 location 的基础 polyfill
  if (!global.location) {
    global.location = {
      href: '',
      hostname: '',
      pathname: '',
      search: '',
    };
  }
} 