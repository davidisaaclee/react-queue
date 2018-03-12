import React from 'react';
import Queue from '../src/Queue';

import { configure as configureEnzyme, shallow } from 'enzyme';
import ReactEnzymeAdapter from 'enzyme-adapter-react-16';

configureEnzyme({ adapter: new ReactEnzymeAdapter() });

test('Basic queue', () => {
	expect.assertions(9);

	const job = jest.fn();

	let dequeue;
	let enqueue;
	const wrapper = shallow(
		<Queue dequeueRef={ref => dequeue = ref}>
			{enq => enqueue = enq}
		</Queue>
	);
	expect(job).not.toHaveBeenCalled();

	const jobReturnValue1 = 'a';
	job.mockReturnValueOnce(jobReturnValue1);

	const job1 = enqueue(job);
	expect(job1).resolves.toBe(jobReturnValue1);

	expect(job).not.toHaveBeenCalled();

	dequeue();
	expect(job).toHaveBeenCalledTimes(1);
	job.mockClear();

	dequeue();
	expect(job).toHaveBeenCalledTimes(0);
	job.mockClear();

	const jobReturnValues = ['b', 'c', 'd'];
	jobReturnValues.forEach(v => job.mockReturnValueOnce(v));

	expect(enqueue(job)).resolves.toBe(jobReturnValues[0]);
	expect(enqueue(job)).resolves.toBe(jobReturnValues[1]);
	expect(enqueue(job)).resolves.toBe(jobReturnValues[2]);
	dequeue();
	expect(job).toHaveBeenCalledTimes(3);
	job.mockClear();
});

