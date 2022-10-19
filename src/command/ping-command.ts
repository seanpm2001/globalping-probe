import Joi from 'joi';
import isIpPrivate from 'private-ip';
import type { Socket } from 'socket.io-client';
import { execa, ExecaChildProcess } from 'execa';
import type { CommandInterface } from '../types.js';
import { isExecaError } from '../helper/execa-error-check.js';
import { InvalidOptionsException } from './exception/invalid-options-exception.js';

export type PingOptions = {
	type: 'ping';
	target: string;
	packets: number;
};

const pingOptionsSchema = Joi.object<PingOptions>({
	type: Joi.string().valid('ping'),
	target: Joi.string(),
	packets: Joi.number().min(1).max(16).default(3),
});

type PingStats = {
	min?: number;
	max?: number;
	avg?: number;
	loss?: number;
};

type PingTimings = {
	ttl: number;
	rtt: number;
};

type PingParseOutput = {
	rawOutput: string;
	resolvedHostname?: string;
	resolvedAddress?: string;
	timings?: PingTimings[];
	stats?: PingStats;
};

/* eslint-disable @typescript-eslint/ban-types */
type PingParseOutputJson = {
	rawOutput: string;
	resolvedHostname: string | null;
	resolvedAddress: string | null;
	timings: Array<{
		ttl: number;
		rtt: number;
	}>;
	stats: {
		min: number | null;
		max: number | null;
		avg: number | null;
		loss: number | null;
	};
};
/* eslint-enable @typescript-eslint/ban-types */

export const argBuilder = (options: PingOptions): string[] => {
	const args = [
		// '-4',
		['-c', options.packets.toString()],
		['-i', '0.2'],
		// ['-w', '15'],
		options.target,
	].flat();

	return args;
};

export const pingCmd = (options: PingOptions): ExecaChildProcess => {
	const args = argBuilder(options);
	return execa('unbuffer', ['ping', ...args]);
};

export class PingCommand implements CommandInterface<PingOptions> {
	constructor(private readonly cmd: typeof pingCmd) { }

	async run(socket: Socket, measurementId: string, testId: string, options: unknown): Promise<void> {
		// const {value: cmdOptions, error} = pingOptionsSchema.validate(options);

		// if (error) {
		// 	throw new InvalidOptionsException('ping', error);
		// }

		// const pStdout: string[] = [];
		// let isResultPrivate = false;

		// const cmd = this.cmd(cmdOptions);
		// cmd.stdout?.on('data', (data: Buffer) => {
		// 	pStdout.push(data.toString());
		// 	const isValid = this.validatePartialResult(pStdout.join(''), cmd);

		// 	if (!isValid) {
		// 		isResultPrivate = !isValid;
		// 		return;
		// 	}

		setTimeout(() => {
			socket.emit('probe:measurement:progress', {
				testId,
				measurementId,
				result: {
					rawOutput: `PING google.com (142.250.75.14): 56 data bytes
				`},
			});
		}, 1000);

		setTimeout(() => {
			socket.emit('probe:measurement:progress', {
				testId,
				measurementId,
				result: {
					rawOutput: `64 bytes from 142.250.75.14: icmp_seq=0 ttl=117 time=16.807 ms
				64 bytes from 142.250.75.14: icmp_seq=1 ttl=117 time=16.450 ms
				64 bytes from 142.250.75.14: icmp_seq=2 ttl=117 time=16.647 ms
				64 bytes from 142.250.75.14: icmp_seq=3 ttl=117 time=16.149 ms
				64 bytes from 142.250.75.14: icmp_seq=4 ttl=117 time=20.132 ms
				64 bytes from 142.250.75.14: icmp_seq=5 ttl=117 time=17.220 ms
				64 bytes from 142.250.75.14: icmp_seq=6 ttl=117 time=16.413 ms
				64 bytes from 142.250.75.14: icmp_seq=7 ttl=117 time=17.925 ms
				64 bytes from 142.250.75.14: icmp_seq=8 ttl=117 time=15.885 ms
				64 bytes from 142.250.75.14: icmp_seq=9 ttl=117 time=19.105 ms
				64 bytes from 142.250.75.14: icmp_seq=10 ttl=117 time=19.169 ms
				64 bytes from 142.250.75.14: icmp_seq=11 ttl=117 time=16.734 ms
				64 bytes from 142.250.75.14: icmp_seq=12 ttl=117 time=16.031 ms
				64 bytes from 142.250.75.14: icmp_seq=13 ttl=117 time=16.824 ms
				64 bytes from 142.250.75.14: icmp_seq=14 ttl=117 time=16.649 ms
				64 bytes from 142.250.75.14: icmp_seq=15 ttl=117 time=17.173 ms
				
				--- google.com ping statistics ---
				16 packets transmitted, 16 packets received, 0.0% packet loss
				round-trip min/avg/max/stddev = 15.885/17.207/20.132/1.202 ms
				`},
			});
		}, 2000);

		// });

		// let result = {
		// 	rawOutput: '',
		// };

		// try {
		// 	const cmdResult = await cmd;
		// 	const parseResult = this.parse(cmdResult.stdout);
		// 	result = parseResult;

		// 	if (isIpPrivate(parseResult.resolvedAddress ?? '')) {
		// 		isResultPrivate = true;
		// 	}
		// } catch (error: unknown) {
		// 	const output = isExecaError(error) ? error.stdout.toString() : '';
		// 	result = {
		// 		rawOutput: output,
		// 	};
		// }

		// if (isResultPrivate) {
		// 	result = {
		// 		rawOutput: 'Private IP ranges are not allowed',
		// 	};
		// }

		setTimeout(() => {
			socket.emit('probe:measurement:result', {
				testId,
				measurementId,
				result: {
					"rawOutput": "PING google.com (142.250.75.14): 56 data bytes\n64 bytes from 142.250.75.14: icmp_seq=0 ttl=117 time=16.807 ms\n64 bytes from 142.250.75.14: icmp_seq=1 ttl=117 time=16.450 ms\n64 bytes from 142.250.75.14: icmp_seq=2 ttl=117 time=16.647 ms\n64 bytes from 142.250.75.14: icmp_seq=3 ttl=117 time=16.149 ms\n64 bytes from 142.250.75.14: icmp_seq=4 ttl=117 time=20.132 ms\n64 bytes from 142.250.75.14: icmp_seq=5 ttl=117 time=17.220 ms\n64 bytes from 142.250.75.14: icmp_seq=6 ttl=117 time=16.413 ms\n64 bytes from 142.250.75.14: icmp_seq=7 ttl=117 time=17.925 ms\n64 bytes from 142.250.75.14: icmp_seq=8 ttl=117 time=15.885 ms\n64 bytes from 142.250.75.14: icmp_seq=9 ttl=117 time=19.105 ms\n64 bytes from 142.250.75.14: icmp_seq=10 ttl=117 time=19.169 ms\n64 bytes from 142.250.75.14: icmp_seq=11 ttl=117 time=16.734 ms\n64 bytes from 142.250.75.14: icmp_seq=12 ttl=117 time=16.031 ms\n64 bytes from 142.250.75.14: icmp_seq=13 ttl=117 time=16.824 ms\n64 bytes from 142.250.75.14: icmp_seq=14 ttl=117 time=16.649 ms\n64 bytes from 142.250.75.14: icmp_seq=15 ttl=117 time=17.173 ms\n\n--- google.com ping statistics ---\n16 packets transmitted, 16 packets received, 0.0% packet loss\nround-trip min/avg/max/stddev = 15.885/17.207/20.132/1.202 ms",
					"resolvedAddress": "142.250.75.14",
					"resolvedHostname": "142.250.75.14:",
					"timings": [],
					"stats": {
						"min": 15.885,
						"max": 20.132,
						"avg": 17.207,
						"loss": 0
					}
				},
			});
		}, 3000);
	}

	private validatePartialResult(rawOutput: string, cmd: ExecaChildProcess): boolean {
		const parseResult = this.parse(rawOutput);

		if (isIpPrivate(parseResult.resolvedAddress ?? '')) {
			cmd.kill('SIGKILL');
			return false;
		}

		return true;
	}

	private toJsonOutput(input: PingParseOutput): PingParseOutputJson {
		return {
			rawOutput: input.rawOutput,
			resolvedAddress: input.resolvedAddress ? input.resolvedAddress : null,
			resolvedHostname: input.resolvedHostname ? input.resolvedHostname : null,
			timings: input.timings ?? [],
			stats: {
				min: input.stats?.min ?? null,
				max: input.stats?.max ?? null,
				avg: input.stats?.avg ?? null,
				loss: input.stats?.loss ?? null,
			},
		};
	}

	private parse(rawOutput: string): PingParseOutput {
		const lines = rawOutput.split('\n');

		if (lines.length === 0) {
			return { rawOutput };
		}

		const header = /^PING\s(?<host>.*?)\s\((?<addr>.+?)\)/.exec(lines[0] ?? '');
		if (!header) {
			return { rawOutput };
		}

		const resolvedAddress = String(header?.groups?.['addr']);
		const timeLines = lines.slice(1).map(l => this.parseStatsLine(l)).filter(Boolean) as PingTimings[];

		const resolvedHostname = (/(?<=from\s).*?(?=\s)/.exec((lines[1] ?? '')))?.[0];
		const summaryHeaderIndex = lines.findIndex(l => /^---\s(.*)\sstatistics ---/.test(l));
		const summary = this.parseSummary(lines.slice(summaryHeaderIndex + 1));

		return {
			resolvedAddress,
			resolvedHostname: resolvedHostname ?? '',
			timings: timeLines,
			stats: summary,
			rawOutput,
		};
	}

	private parseStatsLine(line: string): PingTimings | undefined {
		const parsed = /^\d+ bytes from (?<host>.*) .*: (?:icmp_)?seq=\d+ ttl=(?<ttl>\d+) time=(?<time>\d*(?:\.\d+)?) ms/.exec(line);

		if (!parsed || !parsed.groups) {
			return;
		}

		return {
			ttl: Number.parseInt(parsed.groups['ttl'] ?? '-1', 10),
			rtt: Number.parseFloat(parsed.groups['time'] ?? '-1'),
		};
	}

	private parseSummary(lines: string[]): PingStats {
		const [packets, rtt] = lines;
		const stats: Record<string, any> = {};

		if (rtt) {
			const rttMatch = /^(?:round-trip|rtt)\s.*\s=\s(?<min>\d*(?:\.\d+)?)\/(?<avg>\d*(?:\.\d+)?)\/(?<max>\d*(?:\.\d+)?)?/.exec(rtt);

			stats['min'] = Number.parseFloat(rttMatch?.groups?.['min'] ?? '');
			stats['avg'] = Number.parseFloat(rttMatch?.groups?.['avg'] ?? '');
			stats['max'] = Number.parseFloat(rttMatch?.groups?.['max'] ?? '');
		}

		if (packets) {
			const packetsMatch = /(?<loss>\d*(?:\.\d+)?)%\spacket\sloss/.exec(packets);
			stats['loss'] = Number.parseFloat(packetsMatch?.groups?.['loss'] ?? '-1');
		}

		return stats;
	}
}
