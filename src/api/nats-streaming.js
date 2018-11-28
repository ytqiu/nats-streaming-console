import axios from 'axios'

const processError = (err) => {
    console.log({ name: err.name, message: err.message, fileName: err.fileName })
    setTimeout(() => {
        if (!window.location.href.endsWith('/server') && err.response.status == 504) {
            window.location.href = '/server'
        }
    }, 0)
    throw err
}

export function getServers() {
    // return Promise.resolve(SERVERS)
    return axios({
        method: 'get',
        url: '/streaming/serverz',
        headers: { 'Content-Type': 'application/json' },
    })
        .then((resp) => resp.data)
        .catch(processError)
}

export function getStores() {
    // return Promise.resolve(STORES)
    return axios({
        method: 'get',
        url: '/streaming/storez',
        headers: { 'Content-Type': 'application/json' },
    })
        .then((resp) => resp.data)
        .catch(processError)
}

export function getClients() {
    // return Promise.resolve(CLIENTS)
    return axios({
        method: 'get',
        url: '/streaming/clientsz',
        params: {
            subs: 1,
        },
        headers: { 'Content-Type': 'application/json' },
    })
        .then((resp) => resp.data)
        .catch(processError)
}

export function getChannels() {
    // return Promise.resolve(CHANNELS)
    return axios({
        method: 'get',
        url: '/streaming/channelsz',
        params: {
            subs: 1,
        },
        headers: { 'Content-Type': 'application/json' },
    })
        .then((resp) => resp.data)
        .catch(processError)
}

export function getMessages(channel) {
    return axios({
        method: 'get',
        url: `/api/channel/${channel}/message`,
        headers: { 'Content-Type': 'application/json' },
    })
        .then((resp) => resp.data)
        .catch(processError)
}
