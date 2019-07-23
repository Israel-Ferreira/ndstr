const http = require('http')
const app = require('./src/App')

const PORT = process.env.PORT || 3000

app.set('port',PORT)

const server = http.createServer(app)

server.listen(PORT,() => {
    console.log(`Server is Started on Port ${PORT}`)
});

server.on('error',(err) => {
    console.log(`server is stopped for ${err.code}`)
    process.exit(1)
})