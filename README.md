# snowpack-service-worker-assets

This is a very simple [Snowpack](https://www.snowpack.dev/) plugin to help you if you are rolling your own service worker.

A typical service worker has the following lines to cache application assets (copied from [MDN article](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers#install_and_activate_populating_your_cache)):

```JS
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

When you have numerous files, or the filenames are determined at build time (perhaps because you use [snowpack-plugin-hash](https://github.com/TylorS/snowpack-plugin-hash) for example) adding these filenames to the `addAll` array becomes difficult.

This plugin automates the process. It runs after your bundler and looks for assets in your build directory that match a pattern. These filenames are injected in your service worker using simple string replacement.

## Install

```sh
npm i --save-dev snowpack-service-worker-assets
```

or:
```sh
yarn add -d snowpack-service-worker-assets
```

## Usage

Add `snowpack-service-worker-assets` to the end of your snowpack plugins.

```js
plugins: [
	...plugins
	[
		'snowpack-service-worker-assets',
		{
			patterns: ['**/*', '!sw.js', '!**/*.map'],	//required
			worker: 'sw.js',	//required
			replace: "'snowpack-service-worker-assets'"	// optional, default value shown
		}
	]
],
```

There are three options:

- `patterns` tells the plugin which files to add to the service worker. These patterns are fed straight to [fast-glob](https://github.com/mrmlnc/fast-glob#options-3) so refer to that project for help on patterns. The file patterns are relative to your snowpack build directory.
- `worker` is the path (relative to build dir) of the service worker.
- `replace` is the string that the plugin will seek to replace in the service worker file. Note the nested quotes in the example above. Your service worker needs to include that string:

```JS
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        'snowpack-service-worker-assets'
      ]);
    })
  );
});
```

## License

MIT
