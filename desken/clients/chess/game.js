var
	engine = '../../engine.php',
	gid = 'demo',
	gtype = 'chess',
	unitSize = 50,
	dragging = false,
	board;

if (location.href.match(/gid=/)) {
	var gameid = location.href.replace(/.+?gid=(.+)/, '$1');
}

if (location.href.match(/gtype=/)) {
	gtype = location.href.replace(/.+?gtype=(.+)/, '$1');
}
function build(data) {
	data = JSON.parse(data);

	$('#board, .container')
		.css('width', data.width * unitSize)
		.css('height', data.height * unitSize);

	board.html('');
	for (var i in data.units) {
		var unit = data.units[i];
		board.append(
			'<div\
				id="' + unit.id + '"\
				class="unit"\
				title="' + unit.title + '"\
			>' + unit.glif + '</div>'
		);
	}

	$('.unit')
		.draggable({
			grid: [unitSize, unitSize],
			start: function () {
				dragging = true;
			},
			stop: function () {
				dragging = false;

				var id = $(this).css('id');
				var x = $(this).css('left').replace(/(\d+).+/, '$1') / unitSize;
				var y = $(this).css('top').replace(/(\d+).+/, '$1') / unitSize;

				action(
					"move",
					{
						"id": id,
						"x": x,
						"y": y
					}
				);
			}
		});

	if (data.lastmove) {
		$('.lastmove').removeClass('lastmove');
		$('#' + data.lastmove).addClass('lastmove');
	}

	update(data);
}

function update(data) {
	if (typeof data == 'string') {
		data = JSON.parse(data);
	}

	for (var i in data.units) {
		var unit = data.units[i];

		$('#' + unit.id)
			.data('x', unit.x)
			.data('y', unit.y)
			.css('left', unit.x * unitSize)
			.css('top', unit.y * unitSize);
	}

	if (data.lastmove) {
		$('.lastmove').removeClass('lastmove');
		$('#' + data.lastmove).addClass('lastmove');
	}
}

function updateState(data) {
	if (dragging) {
		return false;
	}

	if (typeof data == "undefined") {
		$.post(
			engine,
			{
				"gid": gameid,
				"gtype": gtype,
				"action": "getstate"
			},
			function (data) {
				update(data);
			}
		);
	}
	else {
		update(data);
	}
}

function getState() {
	$.post(
		engine,
		{
			"gid": gameid,
			"gtype": gtype,
			"action": "getstate"
		},
		function (data) {
			build(data);
		}
	);
}

function action(a, p) {
	$.post(
		engine,
		{
			"gid": gameid,
			"gtype": gtype,
			"action": a,
			"params": p
		},
		function (data) {
			updateState(data);
		}
	);
}

$(function () {

	board = $('#board');

	getState();

	setInterval(updateState, 2000);

});
