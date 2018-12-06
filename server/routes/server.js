const axios = require('axios')
const natsSS = require('../nats-ss')

exports.getServerOptions = async (req, res) => {
    res.status(200).send(natsSS.options)
}

exports.setServerOptions = async (req, res) => {
    const { host, port, monitoringPort } = req.body
    try {
        const resp = await axios({
            method: 'get',
            baseURL: `http://${host}:${monitoringPort}/`,
            url: '/streaming/serverz',
            headers: { Accept: 'application/json' },
            proxy: false,
        })

        natsSS.updateOptions({
            server: `nats://${host}:${port}`,
            monitor: `http://${host}:${monitoringPort}`,
            cluster: resp.data.cluster_id,
        })

        res.status(200).send({ options: natsSS.options, data: resp.data })
    } catch (err) {
        console.log({ err })
        res.status(500).send({ status: 'error' })
    }
}
