/* global io */

const socket = io();

socket.on('message', function (message) {
	const $message = $('<div class="message"><span class="serverchannel"><span class="server"></span><span class="channel"></span></span><span class="author"></span><span class="content"></span></div>');

	$message.find('span.server').text(message.server);
	$message.find('span.channel').text(message.channel);
	$message.find('span.author').text(message.author);
	if (message.authorBot) {
		$message.find('span.author').append('<span class="bot">BOT</span>');
	}
	if (message.authorSelf) {
		$message.addClass('self');
	}
	$message.find('span.content').text(message.content);

	$message.data('messageId', message.id);

	$message.appendTo('#messages');
});

socket.on('messageDelete', function (message) {
	const $message = $('.message').filter(function () {
		return $(this).data('messageId') === message.id;
	});
	$message.addClass('deleted');
});

socket.on('messageUpdate', function (message) {
	const $message = $('.message').filter(function () {
		return $(this).data('messageId') === message.id;
	});
	$message.find('span.content').text(message.content);
	$message.addClass('edited');
});
