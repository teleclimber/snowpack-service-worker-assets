# snowpack-service-worker-assets

This is a very simple [Snowpack]() plugin to help you if you are rolling your own service worker.

A typical service worker has the following lines (copied from [MDN article](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers#install_and_activate_populating_your_cache)):

```
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        './sw-test/',
        './sw-test/index.html',
        './sw-test/style.css',
        './sw-test/app.js',
        './sw-test/image-list.js',
        './sw-test/star-wars-logo.jpg',
        './sw-test/gallery/',
        './sw-test/gallery/bountyHunters.jpg',
        './sw-test/gallery/myLittleVader.jpg',
        './sw-test/gallery/snowTroopers.jpg'
      ]);
    })
  );
});
```

The problem is populating the `cache.addAll()` array automatically. After your bundler has finished, the created assets that should be cached by the service worker need to be added to that array.

This could be done manually, but will quickly get out of hand if you have a lot of assets (like icons and images). This will also stop being fun if you rename your bundled files with a content hash (using [snowpack-plugin-hash](https://github.com/TylorS/snowpack-plugin-hash) for example).

This plugin automates the process. It runs after your bundler and looks for assets in your build directory that match a pattern. These filenames are injected in your service worker using simple string replacement.

## Install

```sh
npm i --save-dev snowpack-service-worker-assets

yarn add -d snowpack-service-worker-assets
```

## Usage

..coming later..

## License

MIT
