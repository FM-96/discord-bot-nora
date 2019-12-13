$(function () {
	// TODO
	// load all pacts
	// attach add and delete handlers to buttons and stuff
	// copy {U}'s interface?

	getAllPacts();
});

function appendPact(pactData) {
	// TODO
}

function getAllPacts() {
	$.ajax({
		dataType: 'json',
		error: getAllPactsError,
		method: 'get',
		success: getAllPactsSuccess,
		url: '/showpact/api/list',
	});
}

function getAllPactsError(jqHXR, textStatus, errorThrown) {
	// TODO
}

function getAllPactsSuccess(data, textStatus, jqXHR) {
	// delete all current rows from table
	$('#pacts').children().remove();

	// add rows with triggers to table
	for (const pactData of data) {
		const $newPact = $([
			'<div class="pact" data-id="' + pactData._id + '">',
			'	<span class="channelId">' + pactData.discordChannelId + '</span>',
			'	<span class="channelName">' + pactData.discordChannelName + '</span>',
			'	<span class="serverName">' + pactData.discordServerName + '</span>',
			'	<div class="column trigger">',
			'		<div class="title">Trigger</div>',
			'			<span class="triggerUserId">' + pactData.trigger.discordUserId + '</span>',
			'			<span class="triggerUserName">' + pactData.trigger.discordUserName + '</span>',
			'			<span class="triggerStatusUrl">' + pactData.trigger.statusUrl + '</span>',
			'			<span class="triggerShowName">' + pactData.trigger.showName + '</span>',
			'		</div>',
			'	</div>',
			'	<div class="column triggered">',
			'		<div class="title">Triggered</div>',
			'			<span class="triggeredUserId">' + pactData.triggered.discordUserId + '</span>',
			'			<span class="triggeredUserName">' + pactData.triggered.discordUserName + '</span>',
			'			<span class="triggeredStatusUrl">' + pactData.triggered.statusUrl + '</span>',
			'			<span class="triggeredShowName">' + pactData.triggered.showName + '</span>',
			'		</div>',
			'	</div>',
			'</div>',
		].join('\n'));

		$('#pacts').append($newPact);
	}

	// add last row to create new triggers to table
	const $addTriggerRow = $([
		'<tr class="center aligned">',
		'	<td><div class="ui input"><input type="text" name="guildId"></div></td>',
		'	<td><div class="ui input"><input type="text" name="channelId"></div></td>',
		'	<td><div class="ui input"><input type="text" name="userId"></div></td>',
		'	<td>',
		'		<div class="ui selection dropdown">',
		'			<input type="hidden" name="method">',
		'			<i class="dropdown icon"></i>',
		'			<div class="default text">Method</div>',
		'			<div class="menu">',
		'				<div class="item" data-value="exactly">Is Exactly</div>',
		'				<div class="item" data-value="contains">Contains</div>',
		'				<div class="item" data-value="regex">Matches Regex</div>',
		'			</div>',
		'		</div>',
		'	</td>',
		'	<td><div class="ui input"><input type="text" name="text"></div></td>',
		'	<td><button class="ui fluid blue button">Add</button></td>',
		'</tr>',
	].join('\n'));

	$('tbody').append($addTriggerRow);

	$('.ui.dropdown').dropdown();
}
