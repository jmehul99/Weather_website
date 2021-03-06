const path = require('path')
const express = require('express')
const hbs = require('hbs')
const forecast = require('./utils/forecast')
const geoCode = require('./utils/geocode')
const aqi = require("./utils/aqi_forecast")
const aqi_forecast = require('./utils/aqi_forecast')

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather & AQI',
        name: 'Naman Jain'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Naman Jain'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text.',
        title: 'Help',
        name: 'Naman Jain'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        res.send({
            error: "Please provide the location!"
        })
    }
    else {
        geoCode(req.query.address, (error, data) => {
            if (error) {
                return res.send({ error })
            }
            forecast(data.latitude, data.longitude, (error, forecastdata) => {
                if (error) {
                    return res.send({ error })
                }
                res.send({
                    latitude: data.latitude,
                    longitude: data.longitude,
                    location: data.location,
                    forecast: forecastdata,
                    address: req.query.address
                })
            })
        })
    }
})

app.get('/aqi', (req, res) => {
    if (!req.query.address) {
        res.send({
            error: "Please provide the location!"
        })
    }
    else {
        geoCode(req.query.address, (error, data) => {
            if (error) {
                return res.send({ error })
            }
            aqi_forecast(data.latitude, data.longitude, (error, forecastdata) => {
                if (error) {
                    return res.send({ error })
                }

                res.send({
                    location: data.location,
                    forecast: forecastdata,
                    address: req.query.address
                })
            })
        })
    }
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Naman Jain',
        errorMessage: 'Help article not found.'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Naman Jain',
        errorMessage: 'Page not found.'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})