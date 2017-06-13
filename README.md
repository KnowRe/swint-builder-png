# swint-builder-png

[![Greenkeeper badge](https://badges.greenkeeper.io/Knowre-Dev/swint-builder-png.svg)](https://greenkeeper.io/)
PNG sprite builder for Swint

**Warning: This is not the final draft yet, so do not use this until its official version is launched**

## Dependency
[ImageMagicK](http://www.imagemagick.org/) should be installed and able to execute `$ convert` and `$ montage` on the command line

## Installation
```sh
$ npm install --save swint-builder-png
```

## Options
* `name` : `String`, default: `Project`
* `inDir` : `String`, default: `path.dirname(require.main.filename)`
* `outDir` : `String`, default: `path.join(path.dirname(require.main.filename), '../out')`
* `imgMetaDir` : `String`, default: `path.join(path.dirname(require.main.filename), '../imgMeta')`
* `walkOption` : `Object`, default: `{ ext: '*' }`

## Usage
```javascript
buildPNG({
	name: 'Test',
	inDir: path.join(__dirname, 'png'),
	outDir: path.join(__dirname, 'out'),
	imgMetaDir: path.join(__dirname, 'imgMeta')
}, function() {
	// Build complete
});
```
