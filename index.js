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
  var callback = this.async();
  try {
    const parsed = parse(src);
    console.warn({parsed});
    callback(null, parsed, map, meta);
  } catch (e) {
    callback(e);
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
  
  // For each image matching the pattern, replace it with it's resolved path
  let res = src.replace(/\(([\w-_~\/\.]+.(?:png|jpe?g|ico|gif))\)/ig, (match, imagePath) => {
    console.warn({imagePath});
    // const fileName = `md`
    // let fileContents = fs.readFileSync(imagePath);
    // const resolvedPath = emitFile(fileName, fileContents);
    const resolvedPath = import(imagePath);
    console.warn({resolvedPath});
    return `(${resolvedPath})`;
  })

  return res;
}
