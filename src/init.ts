import { Browser, Page } from 'puppeteer';
import puppeteer from 'puppeteer';
import 'dotenv/config';

/**
 * Inits a browser instance and a page instance. Also sets cookies and handles switching on and off graphic mode. Must be awaited.
 *
 * @returns [Browser, Page]
 */
export const init = async (): Promise<[Browser, Page]> => {
	// cookie check
	if (!process.env.AUTO_LOGIN_COOKIE) {
		throw new Error(
			'❎ Failed to detect an autologin cookie, you must provide one in an `.env` file'
		);
	}

	// browser object init
	const browser = await puppeteer.launch({
		headless: process.argv[2] === 'HEAD' ? false : true,
		defaultViewport: { height: 1080, width: 1920, isMobile: false },
	});

	// page object init
	const page = await browser.newPage();
	await page.goto('https://lingos.pl/', { waitUntil: 'networkidle0' });
	await page.setCookie({
		name: 'autologin',
		value: process.env.AUTO_LOGIN_COOKIE!,
	});

	return [browser, page];
};
