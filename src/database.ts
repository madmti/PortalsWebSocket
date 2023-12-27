import { connect } from 'mongoose';
import { log } from './lib/Actions';
import { URI, ROOT_PASW, ROOT_USER } from '../public.env';

export const connectDB = async () => {
	try{
		await connect(URI, {
			auth: {
				username: ROOT_USER,
				password: ROOT_PASW,
			},
		});
		log(['DB:'.bgGreen, 'CONNECTED'.green], 0);
	} catch {
		log(['DB ERROR:'.bgRed, 'NO CREDENTIAL WAS PROVIDED'.red], 0);
		log(['DB:'.bgYellow, 'Trying to connect without credentials'.yellow], 0);
		try {
			await connect(URI);
			log(['DB:'.bgGreen, 'CONNECTED'.green, '\n'], 0);
		} catch {
			log(['DB:'.bgRed, 'ERROR CONNECTING TO DATABASE'.red, '\n'], 0);
		}
	}
};
