# react-queue
A simple job queue with a React component interface.

```javascript
class MyBufferedComponent extends React.Component {
	dequeue = null

	componentDidMount() {
		// Every 1000 ms, dequeue all queued tasks.
		setInterval(
			() => this.dequeue && this.dequeue(),
			1000);
	}

	render() {
		return (
			<Queue dequeueRef={dequeue => this.dequeue = dequeue}>
				{enqueue => (
					<button onClick={() => enqueue(doWork)} />
				)}
			</Queue>
		);
	}
}

```

## Installation

```bash
yarn add @davidisaaclee/react-queue
```

### Development

```bash
# Clone repository.
git clone https://github.com/davidisaaclee/react-queue
cd react-queue

# Build for ES modules, CommonJS, and UMD.
yarn build

# Run tests.
yarn test
```

