const CACHE_NAME = "BrowserNOTE";

self.addEventListener('install', (e) => {
    e.waitUntill(() => {
        cache.open(CACHE_NAME, '/');
        console.log('Installed.');
    });
});