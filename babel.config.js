module.exports = {
	"presets": [
		["@babel/preset-env", {
			useBuiltIns: "usage",
			modules: false,
			debug: false,
			corejs: "3",
			targets: {
				browsers: ["> 1%", "last 2 versions", "not ie <= 8"]
			}
		}]
	],
	"plugins": [
		"@babel/plugin-transform-runtime", "lodash",
		["@babel/plugin-transform-modules-commonjs", {"strictMode": false}]
	]
}
