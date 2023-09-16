
const TelegramApi = require('node-telegram-bot-api');
const {keyboard, again_keyboard} = require('./option')
const token = '6475398974:AAFUWkpwnWayuIJi8QBWgTLqyz-eoDziSsg';
const bot = new TelegramApi(token, {polling:true});

const chats = {};




const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/schedule', description: 'Расписание'},
        {command: '/game', description: 'Игра угадай цифру'}
    ])

    const startGame = async (chatId) => {
      await bot.sendMessage(chatId, 'Сейчас я загадую цифру от 0 до 9, а ты должен ее угадать!😎')
      const randomNumber = Math.floor(Math.random() * 10)
      chats[chatId] = randomNumber;
      return bot.sendMessage(chatId, 'Отгадывай', {reply_markup: {inline_keyboard: keyboard}})
        
    }
    
    bot.on('message', async msg => {
    
        const text = msg.text;
        const chatId = msg.chat.id;
        
        if(text == '/start'){
           await bot.sendMessage(chatId, "Мой скромный бот пока еще не доведен до ума. Но скоро ты им сможешь воспользоваться. Целую, обнимаю😘🤗🤭");
           return bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/76b/77d/76b77dbb-5b99-39f3-904f-ca92ba9af20b/2.webp')
        }
        if(text === '/game'){
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, msg.chat.first_name + " я ничего не поняла🫠")
        
    
        console.log(msg)
    })
    bot.on('callback_query', async msg => {
      const data = msg.data;
      const chatId = msg.message.chat.id;
      
      if(data == 'again') {
        return startGame(chatId);
      }
      if(data == chats[chatId]){
        return bot.sendMessage(chatId, 'Поздравляю 🎉🎉🎉, ты отгадал цифру ' + chats[chatId], {reply_markup: {inline_keyboard: again_keyboard}})
      }else if (data !== chats[chatId]){
        return bot.sendMessage(chatId, "К сожалению ты не угадал, бот загадал цифру: " + chats[chatId], {reply_markup: {inline_keyboard: again_keyboard}})
      }

    })
}

start()