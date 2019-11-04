module.exports = {
	files: {
		javascripts: {joinTo: {
			"librairies.js": /^(?!app\/)/,
			"index.js": /^app\//,
		}},
		stylesheets: {joinTo: "index.css"}
	}
};