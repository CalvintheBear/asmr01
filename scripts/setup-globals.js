// 设置全局变量polyfill
if (typeof global !== 'undefined') {
  if (!global.self) {
    global.self = global;
  }
  if (!global.window) {
    global.window = global;
  }
}

console.log('✅ Global polyfills initialized for server-side rendering'); 