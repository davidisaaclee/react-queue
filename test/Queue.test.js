import React from 'react';
import Queue from '../src/Queue';

import { configure as configureEnzyme, shallow } from 'enzyme';
import ReactEnzymeAdapter from 'enzyme-adapter-react-16';

configureEnzyme({ adapter: new ReactEnzymeAdapter() });

test('Dequeue in render', () => {
	expect.assertions(9);

	const job = jest.fn();

	let dequeue;
	let enqueue;
	const wrapper = shallow(
		<Queue>
			{(enq, deq) => {
				enqueue = enq;
				dequeue = deq;
			}}
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

test('Custom dequeue strategy', () => {
	expect.assertions(2);

	let dequeue;
	let enqueue;

	const wrapper = shallow(
		<Queue>
			{(enq, deq) => {
				enqueue = enq;
				dequeue = deq;
			}}
		</Queue>
	);

	// Job payloads don't need to be functions.
	const job1Promise = enqueue({
		type: 'add',
		leftAddend: 3,
		rightAddend: 4
	});
	expect(job1Promise).resolves.toEqual(7);

	const job2Promise = enqueue({
		type: 'multiply',
		leftMultiplicand: 3,
		rightMultiplicand: 10
	});
	expect(job2Promise).resolves.toEqual(30);

	dequeue(jobs => {
		function processJob({ payload, resolve }) {
			const { type, ...args } = payload;

			if (type === 'add') {
				resolve(args.leftAddend + args.rightAddend);
			} else if (type === 'multiply') {
				resolve(args.leftMultiplicand * args.rightMultiplicand);
			}
		}

		jobs.forEach(processJob);
		return [];
	});
});

