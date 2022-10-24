import { Context, Markup, Telegraf, Telegram } from 'telegraf';
import { Update } from 'typegram';

// bot init
const token: string = process.env.BOT_TOKEN as string;
const bot: Telegraf<Context<Update>> = new Telegraf(token);
const telegram: Telegram = new Telegram(token);
// const chatId: string = process.env.CHAT_ID as string;


// bot handlers
// /start
bot.start((ctx) => {
  ctx.reply('Hello ' + ctx.from.first_name + '!');
});

// /help
bot.help((ctx) => {
  ctx.reply('Send /start to receive a greeting');
  ctx.reply('Send /keyboard to receive a message with a keyboard');
  ctx.reply('Send /quit to stop the bot');
});

// /quit
bot.command('quit', (ctx) => {
  // Explicit usage
  ctx.telegram.leaveChat(ctx.message.chat.id);

  // Context shortcut
  ctx.leaveChat();
});

// doing something on receiving a video note
bot.on('video_note', (ctx) => {
  ctx.reply(`The video message`);
});


// bot starting point
bot.launch();


// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
