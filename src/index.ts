import puppeteer from 'puppeteer';
import { login } from './modules/login.module.js';
import 'dotenv/config';
import { mainProcess } from './modules/mainProcess.module.js';

const bootstrap = async () => {
	// Check if autologin cookie exists
	if (!process.env.AUTO_LOGIN_COOKIE) {
		throw new Error(
			'❎ Failed to detect an autologin cookie, you must provide one in an `.env` file'
		);
	}

	// Counter
	let counter = 0;
	setInterval(() => {
		counter++;
	}, 1000);

	const browser = await puppeteer.launch({
		headless: true,
		defaultViewport: { height: 1080, width: 1920, isMobile: false },
	});

	const page = await browser.newPage();
	await page.goto('https://lingos.pl/', { waitUntil: 'networkidle0' });
	await page.setCookie({
		name: 'autologin',
		value: process.env.AUTO_LOGIN_COOKIE!,
	});

	// Code goes here
	await login(page);

	const startingProgress: number = +(await page.$eval(
		'body > div.container > div > div:nth-child(2) > div > div > div > div:nth-child(5) > div.row > div:nth-child(2) > h3',
		(node) => {
			return node.innerText;
		}
	));
	let progress = startingProgress;

	try {
		if (progress < 5) {
			for (let i = progress; i < 5; i++) {
				console.log(
					`🤞 Round ${progress + 1}... let's hope it won't crash`
				);
				await mainProcess(page);
				progress++;
			}
		} else {
			console.log('💀 Nothing left to solve for today chief');
		}
	} catch (error) {
		page.screenshot({ path: 'err.png' });
		console.log(
			'❎ [Crash Report] Check `err.png` for the last frame before the crash'
		);
		console.error(error);
	}

	console.log(`🏆 Main process finished in ${counter}s. Exiting...`);
	await browser.close();
	process.exit(0);
};
bootstrap();
