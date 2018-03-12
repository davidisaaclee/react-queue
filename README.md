# react-queue
A simple job queue with a React component interface.

```javascript
const BufferedWork = ({ doWork }) => (
  <Queue>
    {(enqueue, processAll) => (
      <button onClick={() => enqueue(doWork)}>
        Enqueue work
      </button>
      <button onClick={() => processAll()}>
        Process all
      </button>
    )}
  </Queue>
);
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

