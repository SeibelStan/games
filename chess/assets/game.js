if (location.href.match(/gid=/)) {
	var gameid = location.href.replace(/.+?gid=(.+)/, '$1');
}
else {
	gameid = 'demo';
}

$(function () {

	var board = $('#board');
	var dragging = false;

	function build(data) {
		data = JSON.parse(data);

		$('#board, .container')
			.css('width', data.width)
			.css('height', data.height);

		board.html('');
		for (var i in data.units) {
			var unit = data.units[i];
			board.append(
				'<div id="' + unit.id + '" class="unit" title="' + unit.title + '" style="left: ' + unit.x + '; top: ' + unit.y + ';">' + unit.glif + '</div>'
			);
		}

		$('.unit')
			.draggable({
				grid: [50, 50],
				start: function () {
					dragging = true;
				},
				stop: function () {
					dragging = false;
					action(
						"move",
						{"id": $(this).attr('id'), "x": $(this).css('left'), "y": $(this).css('top')}
					);
				}
			});

		$('.lastmove').removeClass('lastmove');
		$('#' + data.lastmove).addClass('lastmove');
	}

	function update(data) {
		data = JSON.parse(data);
		for (var i in data.units) {
			var unit = data.units[i];
			$('#' + unit.id)
				.css('left', unit.x)
				.css('top', unit.y);
		}
		$('.lastmove').removeClass('lastmove');
		$('#' + data.lastmove).addClass('lastmove');
	}

	function updateState(data) {
		if (!dragging) {
			if (typeof data == "undefined") {
				$.post(
					'engine.php',
					{
						"gid": gameid,
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
	}

	function getState() {
		$.post(
			'engine.php',
			{
				"gid": gameid,
				"action": "getstate"
			},
			function (data) {
				build(data);
			}
		);
	}

	function action(a, p) {
		$.post(
			'engine.php',
			{
				"gid": gameid,
				"action": a,
				"params": p
			},
			function (data) {
				updateState(data);
			}
		);
	}

	getState();

	setInterval(updateState, 2000);

});
