"use strict";

var TelegramApi = require('node-telegram-bot-api');

var _require = require('./option'),
    keyboard = _require.keyboard,
    again_keyboard = _require.again_keyboard;

require('dotenv').config();

var bot = new TelegramApi(process.env.BOT_TOKEN, {
  polling: true
});
var chats = {};

var start = function start() {
  bot.setMyCommands([{
    command: '/start',
    description: 'Начальное приветствие'
  }, {
    command: '/schedule',
    description: 'Расписание'
  }, {
    command: '/game',
    description: 'Игра угадай цифру'
  }]);

  var startGame = function startGame(chatId) {
    var randomNumber;
    return regeneratorRuntime.async(function startGame$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(bot.sendMessage(chatId, 'Сейчас я загадую цифру от 0 до 9, а ты должен ее угадать!😎'));

          case 2:
            randomNumber = Math.floor(Math.random() * 10);
            chats[chatId] = randomNumber;
            return _context.abrupt("return", bot.sendMessage(chatId, 'Отгадывай', {
              reply_markup: {
                inline_keyboard: keyboard
              }
            }));

          case 5:
          case "end":
            return _context.stop();
        }
      }
    });
  };

  bot.on('message', function _callee(msg) {
    var text, chatId;
    return regeneratorRuntime.async(function _callee$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            text = msg.text;
            chatId = msg.chat.id;

            if (!(text == '/start')) {
              _context2.next = 6;
              break;
            }

            _context2.next = 5;
            return regeneratorRuntime.awrap(bot.sendMessage(chatId, "Мой скромный бот пока еще не доведен до ума. Но скоро ты им сможешь воспользоваться. Целую, обнимаю😘🤗🤭"));

          case 5:
            return _context2.abrupt("return", bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/76b/77d/76b77dbb-5b99-39f3-904f-ca92ba9af20b/2.webp'));

          case 6:
            if (!(text === '/game')) {
              _context2.next = 8;
              break;
            }

            return _context2.abrupt("return", startGame(chatId));

          case 8:
            return _context2.abrupt("return", bot.sendMessage(chatId, msg.chat.first_name + " я ничего не поняла🫠"));

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    });
  });
  bot.on('callback_query', function _callee2(msg) {
    var data, chatId;
    return regeneratorRuntime.async(function _callee2$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            data = msg.data;
            chatId = msg.message.chat.id;

            if (!(data == 'again')) {
              _context3.next = 4;
              break;
            }

            return _context3.abrupt("return", startGame(chatId));

          case 4:
            if (!(data == chats[chatId])) {
              _context3.next = 8;
              break;
            }

            return _context3.abrupt("return", bot.sendMessage(chatId, 'Поздравляю 🎉🎉🎉, ты отгадал цифру ' + chats[chatId], {
              reply_markup: {
                inline_keyboard: again_keyboard
              }
            }));

          case 8:
            if (!(data !== chats[chatId])) {
              _context3.next = 10;
              break;
            }

            return _context3.abrupt("return", bot.sendMessage(chatId, "К сожалению ты не угадал, бот загадал цифру: " + chats[chatId], {
              reply_markup: {
                inline_keyboard: again_keyboard
              }
            }));

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    });
  });
};

start();