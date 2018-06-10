var
	engine = '../../engine.php',
	gid = 'demo',
	gtype = 'faraon',
	unitSize = 75
	dragging = false,
	board = {},
	gstate = {};

if (location.href.match(/gid=/)) {
	gid = location.href.replace(/.+?gid=(.+)/, '$1');
}

function sphinxClick(el, ev) {
	if (ev.ctrlKey) {
		trace(el);
	}
}

function build(data) {
	data = JSON.parse(data);
	gstate = data.units;
	board.html('');

	for (var i in data.units) {
		var unit = data.units[i];
		board.append(
			'<div\
				id="' + unit.id + '"\
				class="unit ' + unit.type + ' ' + unit.color + '"\
				data-x="' + unit.x + '"\
				data-y="' + unit.y + '"\
				data-r="' + unit.r + '"\
			></div>'
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

				var id = $(this).attr('id');
				var x = $(this).css('left').replace(/(\d+).+/, '$1') / unitSize;
				var y = $(this).css('top').replace(/(\d+).+/, '$1') / unitSize;
				$(this).data('x', x);
				$(this).data('y', y);

				action(
					"move",
					{
						"id": id,
						"x": x,
						"y": y,
						"r": $(this).data('r')
					}
				);
			}
		})
		.click(function (ev) {
			if (ev.ctrlKey) {
				return false;
			}

			var rotation = $(this).data('r');

			if ($(this).hasClass('sphinx')) {
				if ($(this).hasClass('red')) {
					rotation = (rotation == 0) ? 3 : 0
				}
				else {
					rotation = (rotation == 2) ? 1 : 2
				}
			}
			if ($(this).hasClass('anubis')) {
				rotation = (rotation < 3) ? parseInt(rotation) + 1 : 0
			}
			if ($(this).hasClass('scarab')) {
				rotation = (rotation < 1) ? parseInt(rotation) + 1 : 0
			}
			if ($(this).hasClass('pyramid')) {
				rotation = (rotation < 3) ? parseInt(rotation) + 1 : 0
			}

			$(this).data('r', rotation);

			action(
				"move",
				{
					"id": $(this).attr('id'),
					"x": $(this).data('x'),
					"y": $(this).data('y'),
					"r": $(this).data('r')
				}
			);
		});

	$('.sphinx').click(function (ev) {
		$(this).draggable({ "revert": true });
		sphinxClick($(this), ev);
	});

	if (data.lastmove) {
		$('.lastmove').removeClass('lastmove');
		$('#' + data.lastmove).addClass('lastmove');
	}

	arrange();
}

function arrange() {
	$('.unit').each(function () {
		var x = $(this).data('x');
		var y = $(this).data('y');
		var r = $(this).data('r');

		$(this).css({
			'left': x * unitSize + 'px',
			'top': y * unitSize + 'px',
			'transform': 'rotate(' + r * 90 + 'deg)'
		});
	});
}

function update(data) {
	data = JSON.parse(data);
	for (var i in data.units) {
		var unit = data.units[i];
		$('#' + unit.id)
			.data('x', unit.x)
			.data('y', unit.y)
			.data('r', unit.r);
	}

	arrange();

	if (data.lastmove) {
		$('.lastmove').removeClass('lastmove');
		$('#' + data.lastmove).addClass('lastmove');
	}
}

function updateState(data) {
	if (!dragging) {
		if (typeof data == "undefined") {
			$.post(
				engine,
				{
					"gid": gid,
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
}

function getState() {
	$.post(
		engine,
		{
			"gid": gid,
			"gtype": gtype,
			"action": "getstate"
		},
		function (data) {
			build(data);
		}
	);
}

function action(a, p) {
	$('.ray').remove();
	$.post(
		engine,
		{
			"gid": gid,
			"gtype": gtype,
			"action": a,
			"params": p
		},
		function (data) {
			updateState(data);
			gstate = JSON.parse(data).units;
		}
	);
}

function trace(sphinx) {
	$('.ray').remove();

	var tboard = [];
	for (var j = 0; j < 8; j++) {
		for (var i = 0; i < 10; i++) {
			var type = false;
			var r = 0;

			for (var u in gstate) {
				if (
					(gstate[u].x == i) &&
					(gstate[u].y == j)
				) {
					type = gstate[u].type;
					r = gstate[u].r;
				}
			}

			tboard.push({
				"x": i,
				"y": j,
				"r": r,
				"type": type
			});
		}
	}

	rayX = parseInt(sphinx.data('x'));
	rayY = parseInt(sphinx.data('y'));
	rayR = parseInt(sphinx.data('r'));
	rayEnd = false;

	function rayOut() {
		var out = false;
		if (
			rayX < 0 ||
			rayX > 9 ||
			rayY < 0 ||
			rayY > 7
		) {
			out = true;
		}
		return out;
	}

	function getRayUnit() {
		return tboard[rayY * 10 + rayX];
	}

	while (!rayEnd) {
		switch (rayR) {
			case 0: {
				rayY++; break;
			}
			case 1: {
				rayX--; break;
			}
			case 2: {
				rayY--; break;
			}
			case 3: {
				rayX++; break;
			}
		}

		if (rayEnd = rayOut()) {
			break;
		}

		var cell = getRayUnit();
		var type = cell.type;
		var r = parseInt(cell.r);

		board.append('<div class="ray" style="top: ' + rayY * unitSize + 'px; left: ' + rayX * unitSize + 'px">');

		switch (type) {
			case 'pyramid': {
				switch (r) {
					case 0: {
						switch (rayR) {
							case 0: { rayR = 9; break; }
							case 1: { rayR = 9; break; }
							case 2: { rayR = 1; break; }
							case 3: { rayR = 0; break; }
						}
						break;
					}
					case 1: {
						switch (rayR) {
							case 0: { rayR = 1; break; }
							case 1: { rayR = 9; break; }
							case 2: { rayR = 9; break; }
							case 3: { rayR = 2; break; }
						}
						break;
					}
					case 2: {
						switch (rayR) {
							case 0: { rayR = 3; break; }
							case 1: { rayR = 2; break; }
							case 2: { rayR = 9; break; }
							case 3: { rayR = 9; break; }
						}
						break;
					}
					case 3: {
						switch (rayR) {
							case 0: { rayR = 9; break; }
							case 1: { rayR = 0; break; }
							case 2: { rayR = 3; break; }
							case 3: { rayR = 9; break; }
						}
						break;
					}
				}
				break;
			}
			case 'scarab': {
				switch (r) {
					case 0: {
						switch (rayR) {
							case 0: { rayR = 3; break; }
							case 1: { rayR = 2; break; }
							case 2: { rayR = 1; break; }
							case 3: { rayR = 0; break; }
						}
						break;
					}
					case 1: {
						switch (rayR) {
							case 0: { rayR = 1; break; }
							case 1: { rayR = 0; break; }
							case 2: { rayR = 3; break; }
							case 3: { rayR = 2; break; }
						}
						break;
					}
				}
				break;
			}
			case 'anubis': {
				switch (r) {
					case 0: {
						switch (rayR) {
							case 0: { rayR = 9; break; }
							case 1: { rayR = 9; break; }
							case 2: { rayR = 8; break; }
							case 3: { rayR = 9; break; }
						}
						break;
					}
					case 1: {
						switch (rayR) {
							case 0: { rayR = 9; break; }
							case 1: { rayR = 9; break; }
							case 2: { rayR = 9; break; }
							case 3: { rayR = 8; break; }
						}
						break;
					}
					case 2: {
						switch (rayR) {
							case 0: { rayR = 8; break; }
							case 1: { rayR = 9; break; }
							case 2: { rayR = 9; break; }
							case 3: { rayR = 9; break; }
						}
						break;
					}
					case 3: {
						switch (rayR) {
							case 0: { rayR = 9; break; }
							case 1: { rayR = 8; break; }
							case 2: { rayR = 9; break; }
							case 3: { rayR = 9; break; }
						}
						break;
					}
				}
				break;
			}
			case 'faraon': {
				rayR = 9;
				break;
			}
		}

		if (rayR > 3) {
			rayEnd = true;
		}
	}
}

$(function () {

	board = $('#board');
	getState();
	setInterval(updateState, 2000);

});