# swint-builder-png
PNG sprite builder for Swint

**Warning: This is not the final draft yet, so do not use this until its official version is launched**

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
