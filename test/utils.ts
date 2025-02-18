import { EventEmitter } from 'node:events';
import * as path from 'node:path';
import { readFileSync } from 'node:fs';
import * as sinon from 'sinon';

export const getCmdMock = (name: string): string => readFileSync(path.resolve(`./test/mocks/${name}.txt`)).toString();
export const getCmdMockResult = (name: string) => JSON.parse(readFileSync(path.resolve(`./test/mocks/${name}.json`)).toString()) as Record<string, unknown>;

export class MockSocket extends EventEmitter {
	override emit (event: string, data?: any, callback?: () => void) {
		super.emit(event, data);

		if (callback) {
			callback();
		}

		return true;
	}

	connect () {
		// Empty connect method, that will be overridden with stub in tests
	}

	disconnect () {
		// Empty disconnect method, that will be overridden with stub in tests
	}
}

type ExecaMock = Promise<any> & {
	resolve: (data: any) => void;
	reject: (error: any) => void;
	kill: sinon.SinonStub;
	stdout: EventEmitter;
};

export const getExecaMock = () => {
	let res;
	let rej;
	const execaMock = new Promise((resolve, reject) => {
		res = resolve;
		rej = reject;
	}) as ExecaMock;
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	execaMock.resolve = res;
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	execaMock.reject = rej;
	execaMock.kill = sinon.stub();

	execaMock.stdout = new EventEmitter();
	return execaMock;
};
