export const log = (msg: string | Array<string>, indent: number) => {
	const spacing = '   '.repeat(indent);
	if (typeof msg === 'string') {
		console.log(spacing + msg);
		return;
	}
	console.log(spacing + msg.join(' '));
};