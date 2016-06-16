import 'jquery'
import 'ms-signalr-client'

export default class EchoHub {
	private connection: SignalR.Hub.Connection
  private proxy: SignalR.Hub.Proxy

	constructor(url: string, options: SignalR.Hub.Options) {
		this.connection = $.hubConnection(url, options)
    this.proxy = this.connection.createHubProxy('EchoHub')
		this.connection.logging = true
		this.connection.received((data) => {
			window.console.info("SignalR: received " + this.connection.json.stringify(data))
		})
		this.connection.start()
	}

	onEcho(callback: (response: string) => string) {
		this.proxy.on('onEcho', callback)
  }
}
