
const path = require('path')
//express returns just a function to start up a server
const express = require('express')
const hbs = require('hbs')
const geocode = require("./utils/geocode")
const forecast = require("./utils/forecast")

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public') // absolute path to the public directory
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')


const app = express()

// Setup handlebars
// a way to customize the server and point to the directory containing static content
app.set('view engine', 'hbs') // expects templates to be in a folder called "views" in the root directory ("web-server")
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)


// Setup static directory to serve
app.use(express.static(publicDirectoryPath))




app.get('', (req, res) => {
	res.render('index', {
		title: "Weather App",
		name: "Ben Stadnick"
	})
})

app.get('/about', (req, res) => {
	res.render('about', {
		title: "About Me",
		name: "Ben Stadnick"
	})
})

app.get('/help', (req, res) => {
	res.render('help', {
		title: "Help",
		message: "So you need my help?",
		name: "Ben Stadnick"
	})
})


app.get("/weather", (req, res) => {
	if (!req.query.address) {
		return res.send({
			error: "You must provide an address"
		})
	}
	geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
		if (error) {
			return res.send({ error })
		}

		forecast(latitude, longitude, (error, forecastData) => {
			if (error) {
				return res.send({ error })
			}

			res.send({
				location,
				forecast, forecastData,
				address: req.query.address
			})
		})
	})

})

app.get("/products", (req, res) => {
	if (!req.query.search) {
		return res.send({
			error: "You must provide a search term"
		})
	}
	console.log(req.query)
	res.send({
		products: []
	})
})

// has to be last for pattern matching
// otherwise express will serve this route
// first since * is the wildcard to match
// anything

app.get('/help/*', (req, res) => {
	res.render('404', {
		title: "404 Not Found",
		message: "Help article not found.",
		name: "Ben Stadnick"
	})
})

app.get("*", (req, res) => {
	res.render('404', {
		title: "404 Not Found",
		message: "Page not found.",
		name: "Ben Stadnick"
	})
})

app.listen(3000, () => {
	console.log("Server is up on port 3000.")
})

