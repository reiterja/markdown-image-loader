const path = require('path');
const loaderUtils = require('loader-utils');
import schema from './options.json';
import validateOptions from 'schema-utils';

/**
 * Main loader method
 *
 * References:
 * - https://webpack.js.org/api/loaders/
 *S
 * @todo: Add options
 */
module.exports = function loader(src, map, meta) {
    var callback = this.async(); // Set the loader to async mode
    var options = loaderUtils.getOptions(this); // Get options

    const main = () => {
        validate();
        try {
            const parsed = parse();
            console.warn({ parsed });
            callback(null, parsed, map, meta);
        } catch (e) {
            callback(e);
        }
    };

    // Validate configuration
    const validate = () => {
        validateOptions(schema, options, {
            name: 'File Loader',
            baseDataPath: 'options',
        });
    };

    // Find images in the markdown, replace with the imported path
    const parse = () => {
        if (typeof src != 'string') {
            throw `Expected a string but got ${typeof src}`;
            console.error(src);
        }

        // For each image matching the pattern, replace it with it's resolved path
        let res = src.replace(/\(([\w-_~\/\.]+.(?:png|jpe?g|ico|gif))\)/gi, (match, imagePath) => {
            console.warn({ imagePath });
            // const fileName = `md`
            // let fileContents = fs.readFileSync(imagePath);
            // const resolvedPath = emitFile(fileName, fileContents);
            const resolvedPath = importImage(imagePath, src, options);
            console.warn({ resolvedPath });
            return `(${resolvedPath})`;
        });

        return res;
    };

    // Import the image and return the path
    // Based on https://github.com/webpack-contrib/file-loader/blob/master/src/index.js
    const importImage = (img) => {
        // the path should be absolute
        const url = loaderUtils.interpolateName({ resourcePath: img }, options.name || '[contenthash].[ext]', {
            context: this.rootContext,
            content: src,
            regExp: options.regExp,
        });

        let outputPath = url;
        if (options.outputPath) {
            if (typeof options.outputPath === 'function') {
                outputPath = options.outputPath(url, this.resourcePath, context);
            } else {
                outputPath = path.posix.join(options.outputPath, url);
            }
        }
        let publicPath = `__webpack_public_path__ + ${JSON.stringify(outputPath)}`;

        if (options.publicPath) {
            if (typeof options.publicPath === 'function') {
                publicPath = options.publicPath(url, this.resourcePath, context);
            } else {
                publicPath = `${
                    options.publicPath.endsWith('/') ? options.publicPath : `${options.publicPath}/`
                }${url}`;
            }

            publicPath = JSON.stringify(publicPath);
        }

        if (typeof options.emitFile === 'undefined' || options.emitFile) {
            this.emitFile(outputPath, content);
        }
    };

    main();
};

export const raw = true;
