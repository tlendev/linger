import { login } from './modules/login.module.js';
import { mainProcess } from './modules/mainProcess.module.js';
import { init } from './init.js';
const bootstrap = async ()=>{
    let counter = 0;
    setInterval(()=>{
        counter++;
    }, 1000);
    const [browser, page] = await init();
    try {
        await login(page);
        const startingProgress = +await page.$eval('body > div.container > div > div:nth-child(2) > div > div > div > div:nth-child(5) > div.row > div:nth-child(2) > h3', (node)=>{
            return node.textContent;
        });
        let progress = startingProgress;
        if (progress < 5) {
            for(let i = progress; i < 5; i++){
                console.log(`🤞 Round ${progress + 1}... let's hope it won't crash`);
                await mainProcess(page);
                progress++;
            }
        } else {
            console.log('💀 Nothing left to solve for today chief');
        }
        console.log(`🏆 Main process finished in ${counter}s. Exiting...`);
        await browser.close();
        process.exit(0);
    } catch (error) {
        await page.screenshot({
            path: 'err.png'
        });
        console.log('❎ [Crash Report] Check `err.png` for the last frame before the crash');
        console.error(error);
    }
};
bootstrap();
