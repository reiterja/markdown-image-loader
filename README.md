# About

A web pack loader to import images from markdown files and return the raw markdown with the image paths updated

## Webpack configuration

This is designed to be used in conjunction with other loaders.

In your webpack config file:

```js
let config = {
    module:  {
        rules: [
            {
                test: /\.md$/,
                use: [
                    { loader: 'json-loader' },
                    { loader: 'yaml-frontmatter-loader' },
                    {
                        loader: 'markdown-image-loader',
                        options: {
                            name: `img/md/[name].[ext]`,
                            publicPath: config.publicPath,
                        },
                    },
                ],
            },
        ]
    }
}
```

## Markdown format

Markdown image paths should be relative to the path of the markdown file

```markdown
![Figure 12 Front Page of the Application](img/fig12.png)
```

## Options

All options are optional

- [name](https://github.com/webpack-contrib/file-loader#name): The filename template for the target file(s)
- [outputPath](https://github.com/webpack-contrib/file-loader#outputpath): A filesystem path where the target file(s) will be placed
- [publicPath](https://github.com/webpack-contrib/file-loader#publicpath): A custom public path for the target file(s) 
- [regExp](https://github.com/webpack-contrib/file-loader#regexp): A Regular Expression to one or many parts of the target file path. The capture groups can be reused in the name property using [N] placeholder
