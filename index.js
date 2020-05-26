/**
 * Main loader method
 * 
 * References: 
 * - https://webpack.js.org/api/loaders/
 * - 
 * 
 * @todo: Add options
 */
module.exports = function (src, map, meta) {
  var callback = this.async;
  try {
    const parsed = parse(src);
    callback(null, parsed, map, meta);
  } catch (e) {
    callbackc(e);
  }
};

/**
 * Markdown Image extractor
 * @param {string} src - Markdown source
 */
function parse(src) {

  if (typeof src != 'string'){
    throw `Expected a string but got ${typeof src}`;
    console.error(src);
  }
  
  let res = src.replace(/\(([\w-_~\/\.]+.(?:png|jpe?g|ico|gif))\)/ig, (imagePath) => {
    console.info({imagePath});
    // const fileName = `md`
    // let fileContents = fs.readFileSync(imagePath);
    // const resolvedPath = emitFile(fileName, fileContents);
    const resolvedPath = import(imagePath);
    console.warn({resolvedPath});
    return resolvedPath;
  })

  return res;
}

// Tells webpack to preserve to treat the output as a string rather
// than a module
module.exports.raw = true;
