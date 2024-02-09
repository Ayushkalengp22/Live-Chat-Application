const users = []

const addUser = ({ id , username , room}) =>{
    //clean the code
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate the user
    if(!username || !room){
        return {
            error:'username and password are required'
        }
    }

    //check for existing user
    const existingUser = users.find((user)=>{
        return user.room === room && user.username === username
    })

    //validate username
    if(existingUser){
        return{
            error:'username is in use!'
        }
    }

    //store User
    const user = {id ,username ,room}
    users.push(user)
    return {user}
}

const removeUser = (id) =>{
    const index = users.findIndex((user)=>{
        return user.id === id
    })
    if(index !== -1){
        return users.splice(index , 1)[0]
    }
}

const getUser=(id)=>{
     return users.find((user) =>{
        return user.id === id
     })
}
const getUserInRoom = (room)=>{
    return users.filter((user)=>{
        return user.room === room  
    })
}
module.exports={
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}