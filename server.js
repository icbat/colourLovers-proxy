const express = require('express')
const app = express()
const request = require('request-promise-native')
const parseString = require('xml2js').parseString

const placeToProxy = 'http://www.colourlovers.com/api/'

app.get('/:pathParams*', (req, res, next) => {
    const path = reconstructPath(req, 'pathParams')
    const fullPath = placeToProxy + path
    console.log('proxying to', fullPath)
    return request(fullPath).then(
        (response) => {
            parseString(response, (error, result) => {
                if (error) {
                    console.log('Could not parse response', response);
                    return res.status(500).json('Could not parse response')
                }
                return res.status(200).json(result)
            })

        },
        (error) => {
            console.log('Could not contact', fullPath, error);
            return res.status(500).json(error)
        }
    )

})

const reconstructPath = (req, pathvar) => {
    let path = ''
    if (req && req.params) {
        if (req.params[pathvar]) {
            path += req.params[pathvar]
        }
        if (req.params['0']) {
            path += req.params['0']
        }
    }
    return path
}

const port =  process.env.PORT || 3000
app.listen(port, () => {
    console.log('Listening on', 3000);
})
