export const log = (msg: string | Array<string>, indent: number) => {
	const spacing = '   '.repeat(indent);
	if (typeof msg === 'string') {
		console.log(spacing + msg);
		return;
	}
	console.log(spacing + msg.join(' '));
};

export const EasyTryCatch = async (callback: Function) => {
	let res = null;
	try {
		res = await callback();
	} catch (error) {
		console.log(error);
	}
	return res;
};
