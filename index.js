var fs = require('fs');
fs = fs.promises;
var path = require('path');
const replace = require('replace-in-file');

module.exports = function(snowpackConfig, pluginOptions) {
	return {
		name: 'snowpack-service-worker-assets',
		async optimize({ buildDirectory }) {
			console.log("build dir: "+buildDirectory);

			const all = [];
			await walk(buildDirectory, '', all);

			let sw_file;
			let assets = [];
			all.forEach( f => {
				console.log(f);
				const base = path.basename(f);

				// check if it's possibly sw
				if( base.startsWith('sw') ) {
					sw_file = f;
				}
				else {
					assets.push(`'./${f}'`);
				}
				// if not sw, is it a file we want?
			});

			if( !sw_file ) throw new Error("failed to find service worker file");

			try {
				const results = await replace({
					files:path.join(buildDirectory, sw_file),
					from: /'snowpack-service-worker-assets'/g,
					to: assets.join(",\n")
				})
				console.log('Replacement results:', results);
			}
			catch (error) {
				console.error('Error occurred:', error);
			}
		}
	};
};

async function walk(baseDir, subDir, arr) {
	const files = await fs.readdir(path.join(baseDir, subDir));
	for( const file of files ) {
		const fullPath = path.join(baseDir, subDir, file);
		console.log(file, fullPath);
		const f = await fs.stat(fullPath);
		if (f.isDirectory()) {
			await walk(baseDir, path.join(subDir, file), arr);
		} else {
			arr.push(path.join(subDir, file));
		}
	}
};
  