import React from 'react';
import PropTypes from 'prop-types';

// defaultDequeueStrategy :: [Queue.Job] -> [Queue.Job]
// where Queue.Job.payload ::= () -> any
// Performs the function payload of each job in the queue,
// then clears the queue.
function defaultDequeueStrategy(queue) {
	queue.forEach(({ payload, resolve }) => resolve(payload()));
	return [];
}

/*
 * <Queue>
 *   {(enqueue, processAll) => (
 *     <button onClick={() => enqueue(doWork)}>
 *       Enqueue work
 *     </button>
 *     <button onClick={() => processAll()}>
 *       Process all
 *     </button>
 *   )}
 * </Queue>
 */
class Queue extends React.Component {
	// Job ::= { payload: any, resolve: () -> () }

	constructor(props) {
		super(props);

		this.queue = [];

		this.request =
			this.request.bind(this);
		this.dequeue =
			this.dequeue.bind(this);
	}

	// request :: any -> Promise<*>
	request(payload) {
		return new Promise(resolve => {
			this.queue.push({ payload, resolve });
		});
	}

	// dequeue :: ([Job] -> [Job]) -> ()
	// Performs the specified dequeue strategy on a non-empty queue,
	// updating the queue to match the returned queue of `dequeueStrategy`.
	// The dequeue strategy will usually have some side-effects from the
	// removed jobs. (See `defaultDequeueStrategy` above for an example.)
	// The dequeue strategy should also resolve the promises associated with
	// each job.
	dequeue(dequeueStrategy = defaultDequeueStrategy) {
		if (this.queue.length === 0) {
			return;
		}

		dequeueStrategy(this.queue);
		this.queue = [];
	}

	render() {
		return this.props.children(this.request, this.dequeue);
	}
}

export default Queue;

