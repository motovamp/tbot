// const API_KEY_BOT = '6935952878:AAHpzLytZyWzJS4ExygBL8scpAK33Dz1MQ8'
const API_KEY_BOT = '6935952878:AAHpzLytZyWzJS4ExygBL8scpAK33Dz1MQ8'

const TelegramBot = require('node-telegram-bot-api')

const bot = new TelegramBot(API_KEY_BOT, {polling: true}) //{ interval: 300, autoStart: true }

const newMembers = []

bot.on('polling_error', err => console.log(err))

bot.on('message', msg => {
	if(newMembers.includes(msg.from.id)) {
		// bot.deleteMessage(msg.chat.id, msg.message_id)
		console.log('message from ' + msg.from.username + ' has been deleted')
	}
})

bot.on('pre_checkout_query', channel => {
	console.log('pre_checkout_query', channel)
}) 

bot.on('shipping_query', channel => {
	console.log('shipping_query', channel)
}) 

bot.on('new_chat_members', async mem => {
	const {new_chat_members} = mem
	console.log('new chat members', new_chat_members)
	if(new_chat_members  && new_chat_members.length) new_chat_members.forEach(async member => {
		if(member.is_bot) bot.banChatMember(member.id)
		if(!newMembers.includes(member.id)) newMembers.push(member.id)

		bot.restrictChatMember(mem.chat.id, member.id, {
			can_send_messages : false,
			can_send_media_messages : false,
			can_send_polls : false,
			can_send_other_messages : false,
			until_date: Math.round(((new Date()).getTime() + 180000) / 1000),
		})

		console.log(newMembers)
		try {

		
			const mess = await bot.sendMessage(mem.chat.id, `Оставь надежду, всяк сюда входящий! ${member.first_name}, тебе можно будет писать сообщения в группе через 3 минуты`, { 
				reply_markup: ['test']
			})

			console.log('Отправленное', mess)
			setTimeout(() => {
				const index = newMembers.indexOf(member.id)
				if(index !== -1) newMembers.splice(index)
				bot.sendMessage(mem.chat.id, `Теперь ${member.first_name} может писать сообщения в группе`)
			}, 180000)
		} catch(e) {
			console.error(e)
		}
	})	

	

	
})

// bot.onText('/^test$/', async message => {
// 	bot.deleteMessage(message.chat.id, message.message_id)
// 	const mess = await bot.sendMessage(message.chat.id, 'a', { 
// 		reply_markup: {remove_keyboard: true}
// 	})

// 	bot.deleteMessage(mess.chat.id, mess.message_id)
// })

bot.on('inline_query', query => {
	console.log('inline_query', query)
})

bot.on('callback_query', query => {
	console.log('callback_query', query)

	const commands = ['Menu_test']

	const {data, message: {message_id, chat: {id}}} = query

	if(!(data && message_id && id)) return

	if(commands.includes(data)) {
		bot.deleteMessage(id, message_id)
	}
})

bot.on('text', async msg => {

    console.log('message', msg)

	if(msg.from.username == 'bokiro') {
		bot.sendMessage(msg.chat.id, '@' + msg.from.username + ' сам дурак!')
	}

	if(msg.text.trim().toLocaleLowerCase().includes('хомяк')) {
		bot.sendMessage(msg.chat.id, 'Хуяк!', {
			reply_to_message_id: msg.message_id
		})

		bot.restrictChatMember(msg.chat.id, msg.from.id, {
			can_send_messages : false,
			can_send_media_messages : false,
			can_send_polls : false,
			can_send_other_messages : false,
			until_date: Math.round(((new Date()).getTime() + 180000) / 1000),
		})

		bot.sendMessage(msg.chat.id, `Участник ${msg.from.first_name} забанен на три минуты)`)
	}

	if(msg.from.username == 'KlimVamp' && msg.chat.type != 'private') {
		// bot.sendMessage(msg.chat.id, '@' + msg.from.username + ' а вот ты молодец)')
		// const mess = await bot.sendMessage(msg.chat.id, `Мессага с менюшкой для ${msg.from.first_name}`, 
		// 	{ 
		// 		reply_markup: {
		// 			inline_keyboard: [[{
		// 				text: 'Bot test', 
		// 				url: 'https://t.me/FloodTermitarorBot',
		// 				// url: `tg://user?id=6935952878`, 
		// 				// switch_inline_query_chosen_chat: {
		// 				// 	allow_bot_chats: true
		// 				// },
		// 				callback_data: 'Menu_test'
		// 			}]],
		// 			resize_keyboard: true,
		// 		}
		// 	}
		// )

		// bot.unbanChatMember(msg.chat.id, 470091142)

		// const mess = await bot.sendPhoto(msg.chat.id, './scale_1200.jpeg' ,
		// 	{ 
		// 		caption: `Мессага с менюшкой для ${msg.from.first_name}`,

		// 		reply_markup: {
		// 			inline_keyboard: [[{
		// 				text: 'Bot test',
		// 				url: 'https://t.me/FloodTermitarorBot',
		// 				// url: `tg://user?id=6935952878`, 
		// 				// switch_inline_query_chosen_chat: {
		// 				// 	allow_bot_chats: true
		// 				// },
		// 				callback_data: 'Menu_test'
		// 			}]],
		// 			resize_keyboard: true,
		// 		}
		// 	},
		// 	{
		// 		contentType: 'image/jpeg'
		// 	}
		// )

		// console.log('Отправленное', mess.message_id)
	}

})



