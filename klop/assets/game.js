var boardWidth = 20,
    boardHeight = 20,
    players = ['pl1', 'pl2'],
    startCells = 3,
    turnOf = getRandom(0, players.length - 1),
    movesDeal = 0,
    movesLimit = 3,
    armageddon = true,
    armaPower = 1;

//генерация случайного числа
function getRandom(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

//выбор случайной ячейки
function getRandomCell(free) {
    var occupyX = getRandom(0, boardWidth),
        occupyY = getRandom(0, boardHeight),
        cell = $('#board').find('tr').eq(occupyX).find('td').eq(occupyY);

    if (free && !cell.hasClass('free')) {
        return getRandomCell(free);
    }
    return cell;
}

//пересчет счетчика
function recount() {
    players.forEach(function (el) {
        var sum = 0;
        $('.cell').each(function () {
            if ($(this).hasClass(el) && !$(this).hasClass('dead')) {
                sum++;
            }
        });
        $('#c-' + el).html(sum);
    });
}

//следующий ход
function nextTurn() {
    movesDeal = 0;

    $('#board').removeClass(players[turnOf]);
    turnOf++;
    if (turnOf >= players.length) {
        turnOf = 0;
    }
    $('#board').addClass(players[turnOf]);
}

//событие хода
function getTurn(el) {
    if (!el.hasClass(players[turnOf]) && !el.hasClass('dead')) {

        //поставить свой цвет если клетка свободна,
        //уничтожить, если занята другим игроком
        if (el.hasClass('free')) {
            el.addClass(players[turnOf]);
            el.removeClass('free');
        }
        else {
            el.addClass('dead');
        }

        //увеличение счетчика ходов
        movesDeal++;
        if (movesDeal >= movesLimit) {
            nextTurn();

            //вызов "армегеддона", если разрешен
            if (armageddon) {
                for (var i = 0; i < armaPower; i++) {
                    getRandomCell(0)
                        .addClass('dead')
                        .removeClass('free');
                }
            }
        }

        recount();
    }
}

$(function () {

    //установка стартового цвета
    $('#board').addClass(players[turnOf]);

    //создание доски
    for (var i = 0; i < boardHeight; i++) {
        $('#board').append('<tr></tr>');
    }

    $('#board tr').each(function () {
        for (var i = 0; i < boardWidth; i++) {
            $(this).append('<td class="cell free"></td>');
        }
    });

    //инициализация хода
    $('.cell').click(function () {
        getTurn($(this));
    });

    //расстановка стартовых позиций игроков
    players.forEach(function (el) {
        for (var i = 0; i < startCells; i++) {
            getRandomCell(1)
                .addClass(el)
                .removeClass('free');
        }
        //заполнение счетчика
        $('#counter').append('<div class="counter-unit ' + el + '" id="c-' + el + '">' + startCells + '</div>');
    });

    //следующий ход по пробелу
    $(document).keyup(function (key) {
        if (key.which == 32) {
            nextTurn();
        }
    });

});
