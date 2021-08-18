const path = require('path');
const fast_glob = require('fast-glob');
const replace = require('replace-in-file');

module.exports = function(snowpackConfig, pluginOptions) {
	const opts = {
		replace: "'snowpack-service-worker-assets'"
	};
	Object.assign(opts, pluginOptions);
	if( !opts.patterns ) throw new Error("Please specify 'patterns' config option.");
	if( !opts.worker ) throw new Error("Please specify 'worker' config option.")
	return {
		name: 'snowpack-service-worker-assets',
		async optimize({ buildDirectory }) {
			const all = await fast_glob(opts.patterns, {cwd:buildDirectory});
			const assets = all.map(f => `'./${f}'`);
			const results = await replace({
				files:path.join(buildDirectory, opts.worker),
				from: new RegExp(opts.replace),
				to: assets.join(",\n")
			});
			if( results.length !== 1 ) throw new Error(`Replace should have affected 1 file, got ${results.length}`);
			if( !results[0].hasChanged ) throw new Error(`Service worker file ${sw_file} was not changed. Is the replace string correct?`);
		}
	};
};

  