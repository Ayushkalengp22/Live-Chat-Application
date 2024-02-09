const socket = io()
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $SendlocationButton = document.querySelector('#send-location')
const $messageFormButton = $messageForm.querySelector('button')
const $messages =document.querySelector('#messages')

//templete
const messageTemplete= document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//option
const { username , room} = Qs.parse(location.search , {ignoreQueryPrefix:true })

const autoscroll = ()=>{
    const $newMessage =$messages.lastElementChild

    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargine = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight  = $newMessage.offsetHeight + newMessageMargine

     const visibleHeight = $messages.offsetHeight

     const containerHeight = $messages.scrollHeight

     const scrollOffset = $messages.scrollTop + visibleHeight

     if(containerHeight - newMessageHeight<= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
     }
}

socket.on('message', (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplete ,{
        username:message.username,
        message:message.text ,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})
socket.on('locationmessage' ,(message)=>{
    console.log(message)
    const html = Mustache.render(locationMessageTemplate , {
        username:message.username,
        url:message.url,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData' , ({room , users})=>{
    const html = Mustache.render(sidebarTemplate , {
        room,
        users

    })
    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')
    //   const message = document.querySelector('input').value
    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, (error) => {

        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
            return console.log(error);
        }
        console.log('The message was delivered');
    })
})


$SendlocationButton.addEventListener('click', () => {



    if (!navigator.geolocation) {
        return alert('Geolocation is not supported to your browser')
    }
    $SendlocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((GeolocationPosition) => {
        socket.emit('sendLocation', {
            latitude: GeolocationPosition.coords.latitude,
            longitude: GeolocationPosition.coords.longitude
        }, () => {
            console.log('Location Shared');
            $SendlocationButton.removeAttribute('disabled')

              
        })
    })

})

socket.emit('join' , {username , room} , (error) =>{
    if(error){
        alert(error)
        location.href = '/'
    }
}) 
//  socket.on('countUpdated' , (count)=>{
//     console.log('the count has been updated' , count)
//  })

//  document.querySelector('#increment').addEventListener('click',()=>{
//     console.log('clicked')

//     socket.emit('increment')
//  })
