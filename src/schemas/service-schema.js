/**
 * Not entirely sure if this is the best way to describe a json object but I want to put an example out there similar to an interface for us to follow
 * if there is a better implementation of this please let me know :)
 * @type {{alias: string, description: string, hostname: string, port: number, path: string, method: string, headers: {Content-Type: string, Content-Length: *}}}
 */
var example = {
    alias: "Nark List All Services",
    description: "This service lists all of the services stored in Narks db for monitoring",
    hostname: 'localhost',
    port: 3001,
    path: '/api/v1/services',
    method: 'GET',
    payload: 'payload goes here',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length
    },
    expectedStatus: 200,
    expectedLatency: 500,
    expectedPayload: 'this could be expected payload'
}