'use strict';

// const bitbank = require('node-bitbankcc');
import * as bitbank from 'node-bitbankcc';

const bitbankApiConf: bitbank.ApiConfig = {
    endPoint: 'https://public.bitbank.cc',
    keepAlive: true,
    timeout: 3000,
};

const CHAT_ID = 698998391;

const bitbankApi = new bitbank.PublicApi(bitbankApiConf);

import TelegramBot = require('node-telegram-bot-api');
const telegramBotToken = process.env.TELEGRAM_CRYPTO_PRICE_BOT_TOKEN;
if (!telegramBotToken) throw new Error('Bot token must be provided.');
const bot = new TelegramBot(telegramBotToken, { polling: true });

async function getMonaCoinLatestPrice(api: bitbank.PublicApi): Promise<number> {
    const monaTicker = await api.getTicker(
        {
            pair: 'mona_jpy',
        }
    );
    const monaLastPrice = monaTicker.data.last;
    if (!monaLastPrice) { throw Error() }
    return +monaLastPrice;
}

import { schedule } from 'node-cron';
;
const main = async () => {
    console.info('=== App started ===');
    schedule('0 0 9-23 ? * * *', async () => {
    // schedule('*/5 * * * * *', async () => {
        console.info('価格取得開始');
        const monaPrice = await getMonaCoinLatestPrice(bitbankApi);
        console.info('Got MONAJPY:', monaPrice);

        const message = "現在のモナンコインの価格は " + monaPrice + " です";
        bot.sendMessage(CHAT_ID, message);
        console.log('Telegram に通知しました');
    }, {
        timezone: 'Asia/Tokyo',
    });
};

main();
