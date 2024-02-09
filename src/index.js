const path = require('path')
const http = require('http')
const express  = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const  {generateMessage}= require('../src/utils/messages')
const {generateMsg} = require('../src/utils/messages')
const {addUser  , removeUser, getUser, getUserInRoom} =  require('../src/utils/users')
const app = express()
const server = http.createServer(app)
const io = socketio(server)




const port = process.env.PORT || 5000
const publicDir = path.join(__dirname , '../public')

io.on('connection' ,(socket)=>{
   
 

 console.log('New WebSocket Connection')
 socket.on('join' ,(options , callback)=>{

    const {error , user} = addUser ({id: socket.id , ...options})
    if (error){
        return callback(error)
    }



    socket.join(user.room)

    socket.emit('message' , generateMessage('Admin' ,'Welcome'))
 socket.broadcast.to(user.room).emit('message' , generateMessage('Admin',`${user.username} has Joined`))
io.to(user.room).emit('roomData' , {
    room :user.room,
    users:getUserInRoom(user.room)
})
 callback()
 })
 

 socket.on('sendMessage', (message , callback)=>{
    const user = getUser(socket.id)
    const filter = new Filter()
    if(filter.isProfane(message)){
        return callback('Profanity is not Allowed')
    }
    io.to(user.room).emit('message' , generateMessage(user.username ,message))
    callback( 'delivered')
 })
 socket.on('sendLocation' , (coords, callback)=>{ 
    const user = getUser(socket.id)
io.to(user.room).emit('locationmessage' ,generateMsg( user.username ,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
callback()
 })
 
 socket.on('disconnect' , ()=>{
   const user = removeUser(socket.id)
   if(user){
    io.to(user.room).emit('message' , generateMessage('Admin' ,`${user.username} has left`))
    io.to(user.room).emit('roomData',{
        room:user.room,
        users:getUserInRoom(user.room)
    })
   }
    
 })

 
})

app.use(express.static(publicDir))

server.listen(port , ()=>{
    console.log('Server on 5000')
})