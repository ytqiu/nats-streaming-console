const fs = require('fs')
const { getInstance: getNerveInstance } = require('nats-nerve')

let configPath = `${__dirname}/nats-ss.config`

const defaults = {
    server: process.env.STAN_URL || 'nats://localhost:4222',
    monitor: process.env.STAN_MONITOR_URL || 'http://localhost:8882',
    cluster: process.env.STAN_CLUSTER || 'test-cluster',
    appName: 'nats-streaming-console-ks',
}

exports.options = Object.assign({}, defaults, JSON.parse(fs.readFileSync(configPath)))
console.log({ options: exports.options })

exports.getNerveInstance = async () => {
    const { server, cluster, appName } = exports.options
    return getNerveInstance(server, cluster, appName)
}

exports.updateOptions = (options) => {
    exports.options = Object.assign({}, exports.options, options)
    // save file
    fs.writeFile(configPath, JSON.stringify(exports.options), (error) => {
        console.log(`save nats-ss.config error: ${error}`)
    })
}
