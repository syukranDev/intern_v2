// const request = require('supertest')
// const app = require('../index.js')

// describe('List of unit testing for API ============' , () => {
//     let response;

//     beforeAll(async() => {
//         response = await request(app).get('/api/inventory')
//         // console.log(response)
//     })

//     //unit testing 1
//     it('should return HTTP code 200 ok status', () => {
//         expect(response.status).toBe(200)
//     })

//     //unit testing 2
//     it('should return JSON in response / content type', () => {
//         expect(response.headers['content-type']).toMatch(/application\/json/)
//     })

//     //unit testing 3
//     it('should return JSON have expected property', () => {
//         const expectedFields = ['time', 'disclaimer', 'chartName', 'bpi']

//         expectedFields.forEach(field => {
//             expect(response.body.data).toHaveProperty(field)
//         });
//     })
// })
