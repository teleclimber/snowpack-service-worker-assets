const path = require('path');
const fast_glob = require('fast-glob');
const replace = require('replace-in-file');

module.exports = function(snowpackConfig, pluginOptions) {
	const opts = {
		patterns: ['**/*', '!**/*.map'],
		worker: '^sw.*\.js',
		replace: "'snowpack-service-worker-assets'"
	};
	Object.assign(opts, pluginOptions);
	return {
		name: 'snowpack-service-worker-assets',
		async optimize({ buildDirectory }) {
			const all = await fast_glob(opts.patterns, {cwd:buildDirectory});

			const sw_re = new RegExp(opts.worker);
			let sw_file;
			const assets = [];
			all.forEach(f => {
				if( sw_re.test(path.basename(f)) ) {
					if( sw_file ) throw new Error(`Found two service workers: ${sw_file} and ${f}`);
					sw_file = f;
				}
				assets.push(`'./${f}'`);
			});

			if( !sw_file ) throw new Error("failed to find service worker file");

			const results = await replace({
				files:path.join(buildDirectory, sw_file),
				from: new RegExp(opts.replace),
				to: assets.join(",\n")
			});
			if( results.length !== 1 ) throw new Error(`Replace should have affected 1 file, got ${results.length}`);
			if( !results[0].hasChanged ) throw new Error(`Service worker file ${sw_file} was not changed. Is the replace string correct?`);
		}
	};
};

  