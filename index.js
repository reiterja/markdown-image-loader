const path = require('path');
const loaderUtils = require('loader-utils');
const schema = require('./options.json');
const validateOptions = require('schema-utils');
const fs = require('fs');

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
    var options = loaderUtils.getOptions(this) || {}; // Get options

    const main = () => {
        validate();
        try {
            const parsed = parse();
            callback(null, parsed, map, meta);
        } catch (e) {
            callback(e);
        }
    };

    // Validate configuration
    const validate = () => {
        validateOptions(schema, options, {
            name: 'markdown-image-loader',
            baseDataPath: 'options',
        });
    };

    // Find images in the markdown, replace with the imported path
    const parse = () => {
        if (typeof src != 'string') {
            console.error(src);
            throw `Expected a string but got ${typeof src}`;
        }

        // For each image matching the pattern, replace it with it's resolved path
        // Regex tester -> https://regex101.com/r/Rg9eWA/1
        let res = src.replace(/\(([\w-_~\/\.]+.(?:png|jpe?g|ico|gif))\)/gi, (match, imagePath) => {
            const resolvedPath = importImage(imagePath, src, options);
            // console.warn({ resolvedPath });
            return `(${resolvedPath})`;
        });

        return res;
    };

    // Import the image and return the path
    // Based on https://github.com/webpack-contrib/file-loader/blob/master/src/index.js
    const importImage = (imagePath) => {
        const markDownFileFolder = this.resourcePath
            .split(/[\/\\]/)
            .slice(0, -1)
            .join('/');
        const absoluteImagePath = path.resolve(markDownFileFolder, imagePath);
        const imageData = fs.readFileSync(absoluteImagePath);

        const url = loaderUtils.interpolateName(
            { resourcePath: absoluteImagePath },
            options.name || '[contenthash].[ext]',
            {
                context: this.rootContext,
                content: src,
                regExp: options.regExp,
            }
        );

        let outputPath = url;

        console.warn({ url });

        if (options.outputPath) {
            if (typeof options.outputPath === 'function') {
                outputPath = options.outputPath(url, absoluteImagePath, context);
            } else {
                outputPath = path.posix.join(options.outputPath, url);
            }
        }
        let publicPath = `__webpack_public_path__ + ${JSON.stringify(outputPath)}`;

        if (options.publicPath) {
            if (typeof options.publicPath === 'function') {
                publicPath = options.publicPath(url, absoluteImagePath, imageData);
            } else {
                publicPath = `${
                    options.publicPath.endsWith('/') ? options.publicPath : `${options.publicPath}/`
                }${url}`;
            }

            publicPath = JSON.stringify(publicPath);
        }

        if (typeof options.emitFile === 'undefined' || options.emitFile) {
            this.emitFile(outputPath, imageData);
        }

        return outputPath;
    };

    main();
};
