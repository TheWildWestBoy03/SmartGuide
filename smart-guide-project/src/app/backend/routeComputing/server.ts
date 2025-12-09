import express from 'express'

const app = express()
const port = 4300

app.listen(port, () => console.log("Auth service works!"))