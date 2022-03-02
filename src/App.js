import React, { useState, useEffect } from 'react'
import web3 from './web3'
import lottery from './lottery'
// class App extends React.Component {
// 	constructor(props) {
// 		super(props)

// 		this.state = {
// 			manager: '',
// 		}
// 	}

// 	async componentDidMount() {
// 		const manager = await lottery.methods.manager().call()
// 		this.setState({ manager })
// 	}
// 	render() {
// 		return (
// 			<div>
// 				<h2>Lottery Contract</h2>
// 				<p>This contract is managed by {this.state.manager}</p>
// 			</div>
// 		)
// 	}
// }

const App = () => {
	console.log('Rendering APP')
	const [manager, setManager] = useState('')
	const [players, setPlayers] = useState([])
	const [balance, setBalance] = useState('')
	const [value, setValue] = useState('')
	const [message, setMessage] = useState('')

	useEffect(() => {
		console.log('inside the useEffect hook')
		async function settingState() {
			const manager = await lottery.methods.manager().call()
			const players = await lottery.methods.getPlayers().call()
			const balance = await lottery.methods.getBalance().call()

			setManager((prevManage) => manager)
			setPlayers((prePlayer) => players)

			setBalance((prevBalance) => balance)
		}
		settingState()
	}, [])

	const onSubmit = async (event) => {
		event.preventDefault()
		const accounts = await web3.eth.getAccounts()

		setMessage((preMessage) => 'Waiting on transaction success...')

		await lottery.methods.enter().send({
			from: accounts[0],
			value: web3.utils.toWei(value, 'ether'),
		})

		setMessage((preMessage) => 'You have entered!')
	}

	const onClick = async () => {
		const accounts = await web3.eth.getAccounts()

		setMessage((preMessage) => 'Waiting on transaction success...')

		await lottery.methods.pickWinner().send({
			from: accounts[0],
		})

		setMessage((preMessage) => 'A winner has been picked')
	}
	return (
		<div>
			<p> {console.log('rendering Return')}</p>
			<h1>Lottery Contract</h1>
			<p>
				This Contract is managed by {manager}. There are currently {players}
				people competing to win .{web3.utils.fromWei(balance)} ether!
			</p>
			<hr />

			<form onSubmit={onSubmit}>
				<h4>Want to Try your Luck</h4>
				<div>
					<label htmlFor=''>Amount of ether to enter</label>

					<input
						value={value}
						onChange={(event) => {
							setValue((preVal) => event.target.value)
						}}
					/>
				</div>
				<button>Enter</button>
			</form>
			<hr />

			<h4>Ready to Pick a winner</h4>
			<button onClick={onClick}>Pick a winner!</button>
			<hr />
			<h1>{message}</h1>
		</div>
	)
}

export default App
