const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const {
    v4: uuidV4
} = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))


app.get('/', (req, res) => {
    res.render('room', {
        roomId: req.params.room,
        userId: req.params.user

    })
})

app.get('/:room/:user', (req, res) => {
    res.render('room', {
        roomId: req.params.room,
        userId: req.params.user
    })
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).emit('user-connected', userId)

        socket.on('disconnect', () => {
            socket.to(roomId).emit('user-disconnected', userId)
        })
        socket.on('videoSend', result => {
            socket.to(roomId).emit('videoReceive', result)
        })
    })
})


server.listen(3002)