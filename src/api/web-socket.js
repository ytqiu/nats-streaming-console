import openSocket from 'socket.io-client'
const socket = openSocket('http://localhost:8282')

let currentChannel = undefined

export const unSubscribeFromChannel = (channel) => {
    channel = channel || currentChannel
    if (channel) {
        socket.emit('unsubscribe-from-channel', channel)

        if (channel == currentChannel) {
            currentChannel = undefined
        }
    }
}

export const subscribeToChannel = (channel, opts, cb) => {
    if (channel == currentChannel) {
        return
    }

    if (currentChannel && currentChannel != channel) {
        unSubscribeFromChannel(currentChannel)
    }

    socket.on(channel, (message) => cb(message))
    socket.emit('subscribe-to-channel', { channel, opts })
    currentChannel = channel
}
