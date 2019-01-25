const Promise = require('bluebird')
const { getNerveInstance } = require('../nats-ss')

exports.Bridge = class Bridge {
  constructor(client) {
    this.client = client
    this.subscriptions = {}
  }

  async subscribeToChannel(data) {
    console.log({ data })
    const { channel, opts } = data
    console.log({ channel, opts })
    try {
      if (this.subscriptions[channel]) {
        return
      }

      const nerve = await getNerveInstance()
      const subscription = nerve.subscribe(channel, opts, (msg) => {
        const message = {
          sequence: msg.getSequence(),
          timestamp: msg.getTimestamp(),
          subject: msg.getSubject(),
          data: msg.getData(),
        }
        // console.log({ channel, message })
        this.client.emit(channel, message)
      })
      this.subscriptions[channel] = { nerve, subscription }
      console.log({ subscriptions: this.subscriptions })
    } catch (err) {
      console.log('MEMEMEMEMEMEMEMEMEMEMEMEMEMEMEMEMEMEMEMEMEMEMEMEMEMEMEME')
      console.log(err)
      console.log('MEMEMEMEMEMEMEMEMEMEMEMEMEMEMEMEMEMEMEMEMEMEMEMEMEMEMEME')
    }
  }

  async unsubscribeFromChannel(channel) {
    console.log('UNSUBSCRIBE ===============================================>')
    console.log({ channel })
    const { subscription } = this.subscriptions[channel]
    if (subscription == null) {
      return
    }

    delete this.subscriptions[channel]
    return new Promise((resolve, reject) => {
      subscription.unsubscribe()
      subscription.on('unsubscribed', () => {
        resolve()
      })
    })
  }

  async unsubscribeAll() {
    const promises = Object.keys(this.subscriptions).map((channel) => {
      this.unsubscribeFromChannel(channel)
    })
    return Promise.all(promises)
  }
}
