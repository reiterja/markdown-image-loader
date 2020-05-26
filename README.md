# About

Imports images for markdown files and exports the raw markdown

## Usage

This is designed to be used in conjunction with other loaders.

In your webpack config file:

```js
            // Markdown: (Loaders run in reverse order) 1. Load images, 2. Read, 3. Export markdown with metadata
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
```

All options are optional
