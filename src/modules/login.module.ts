import { Page } from 'puppeteer';

const login = async (page: Page) => {
	await page.goto('https://lingos.pl/home/login', {
		waitUntil: 'networkidle0',
	});
	console.log('✅ Logged in!');
};

export { login };
