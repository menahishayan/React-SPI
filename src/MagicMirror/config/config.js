/* Config Sample
 *
 * For more information on how you can configure this file
 * see https://docs.magicmirror.builders/configuration/introduction.html
 * and https://docs.magicmirror.builders/modules/configuration.html
 *
 * You can use environment variables using a `config.js.template` file instead of `config.js`
 * which will be converted to `config.js` while starting. For more information
 * see https://docs.magicmirror.builders/configuration/introduction.html#enviromnent-variables
 */
let config = {
	// address: "localhost",	// Address to listen on, can be:
	address: "0.0.0.0", // Default is "localhost"

	// - "localhost", "127.0.0.1", "::1" to listen on loopback interface
	// - another specific IPv4/6 to listen on a specific interface
	// - "0.0.0.0", "::" to listen on any interface
	// Default, when address config is left out or empty, is "localhost"
	port: 8080,
	basePath: "/",	// The URL path where MagicMirror² is hosted. If you are using a Reverse proxy
	// you must set the sub path here. basePath must end with a /
	ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1", "192.168.0.1/24"],	// Set [] to allow all IP addresses
	// or add a specific IPv4 of 192.168.1.5 :
	// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.1.5"],
	// or IPv4 range of 192.168.3.0 --> 192.168.3.15 use CIDR format :
	// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.3.0/28"],

	useHttps: false,			// Support HTTPS or not, default "false" will use HTTP
	httpsPrivateKey: "",	// HTTPS private key path, only require when useHttps is true
	httpsCertificate: "",	// HTTPS Certificate path, only require when useHttps is true

	language: "en",
	locale: "en-US",   // this variable is provided as a consistent location
	// it is currently only used by 3rd party modules. no MagicMirror code uses this value
	// as we have no usage, we  have no constraints on what this field holds
	// see https://en.wikipedia.org/wiki/Locale_(computer_software) for the possibilities

	logLevel: ["INFO", "LOG", "WARN", "ERROR"], // Add "DEBUG" for even more logging
	timeFormat: 12,
	units: "imperial",
	modules: [
		{
			module: "clock",
			position: "middle_center",
			config: {
				timeFormat: 12,
				displaySeconds: false,
				showDate: true,
				dateFormat: "ddd, MMM D"
			}
		},
		{
			module: "weather",
			position: "top_left",
			config: {
				weatherProvider: "openmeteo",
				type: "current",
				// lat: 42,
				// lon: -71,
				showFeelsLike: true, // Ensure this is set to true to display the feels like temperature
				showTemp: false,     // Set this to false to hide the actual temperature
				showHumidity: "none", // Hide humidity information
				showWindDirection: false,     // Hide wind information
				showSun: false,      // Hide sunrise and sunset times
				roundTemp: true,     // Round temperature to nearest whole number
				showPrecipitationProbability: false, // Hide precipitation probability
				appendLocationNameToHeader: false, // Hide location name
			}
		},
		{
			module: 'MMM-MBTA',
			position: 'bottom_left', // This can be any of the regions.
			header: "MBTA:",
			config: {
				// apikey: MBTA_API_KEY,
				stations: ["Northeastern University"],
				updateInterval: 600,
				direction: "Outbound",
				maxEntries: 1
			}
		},
		{
			module: "calendar",
			position: "top_right", // This can be any of the regions. Best results in left or right regions.
			config: {
				coloredText: false,
				coloredBorder: false,
				coloredSymbol: false,
				coloredBackground: false,
				dateFormat: "MMM D",
				dateEndFormat: "h:mm A",
				flipDateHeaderTitle: true,
				timeFormat: "absolute", urgency: 0, getRelative: 0,
				calendars: [
					{
						// url: PRIVATE_ICAL_URL,
						symbol: 'calendar',
						maximumEntries: 2
					},
				],
			},
		},
		// {
		// 	module: 'MMM-Videoplayer',
		// 	position: 'middle_center',
		// 	config: {
		// 		video: "/modules/MMM-Videoplayer/video/test.mp4", // Can also be a URL to a mp4 file on the internet.
		// 		loop: true, // Repeat the video.
		// 		autoplay: true, // If set to true, sound (muted by default) has to be muted, otherwise the video will not auto play.
		// 		notification: "VIDEOPLAYER1", // Unique notification string for this player (to be able to play, pause, restart and next from another modules).
		// 	}
		// },
	],
	electronOptions: {
		fullscreen: true,
		webPreferences: {
			nodeIntegration: true,
			// zoomFactor: 0.8
		},
		additionalArguments: [
			'--enable-font-antialiasing',
			'--enable-smooth-scrolling',
			'--noerrdialogs',
			'--disable-infobars',
			'--disable-session-crashed-bubble',
			'--disable-gpu',
			'--disable-software-rasterizer'
		]
	},
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") { module.exports = config; }
