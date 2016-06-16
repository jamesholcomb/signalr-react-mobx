import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import EchoHub from '../src/hub'
import DevTools from 'mobx-react-devtools'

class EchoStore {
	url = "http://localhost:8080/"
	private options: SignalR.Hub.Options
	private hub: EchoHub

	@observable responses: string[] = []

	constructor() {
		this.hub = new EchoHub(this.url, this.options)
		this.hub.onEcho((response: string) :any => { this.responses.push(response) })
	}

	send(message :string) {
		window.fetch(this.url + "api/echo?message=" + message)
	}
}

@observer
class EchoView extends React.Component<{ echoStore: EchoStore }, {}> {
	@observable message: string

	render() {
		return (
			<div>
				<input title="Enter a message" onChange={this.onChange}/>
				<button onClick={this.onClick}>
					Send
				</button>
				<ul>
					{this.props.echoStore.responses.map((item) => {
						return <li>{item}</li>
					})}
				</ul>
				<DevTools />
			</div>
		)
	}

	@action onChange = (e) => {
		this.message = e.target.value
	}

	onClick = () => {
		this.props.echoStore.send(this.message)
	}
}

const store = new EchoStore
ReactDOM.render(<EchoView echoStore={store} />, document.getElementById('root'))
