/**
 * Clicks the button on a page and waits for navigation. Must be awaited.
 *
 * @example
 * await clickButton(page, '#test')
 *
 * @param page Page object
 * @param selector css-like DOM selector
 */ export const clickButton = async (page, selector)=>{
    await Promise.resolve([
        page.click(selector),
        await page.waitForNavigation({
            waitUntil: 'networkidle0'
        }), 
    ]);
};
