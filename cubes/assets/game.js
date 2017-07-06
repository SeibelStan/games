var boardWidth = 10,
    boardHeight = 12,
    colorCount = 4,
    score = 0,
    collate = 1;

if(location.search) {
    boardWidth = location.search.replace(/.+?w(\d+).*/, '$1');
    boardHeight = location.search.replace(/.+?h(\d+).*/, '$1');
    colorCount = location.search.replace(/.+?c(\d+).*/, '$1');
}

$(function () {

    function drawScore() {
        $('#counter').html(score);
    }

    function addScore() {
        var scoreMod = $('.dead').length;
        score += scoreMod * (scoreMod - 1);
        drawScore();
    }

    function collateCollumns() {
        for(var i = 0; i < boardWidth; i++) {
            var el = $('[data-i="' + i + '"][data-j="' + (boardHeight - 1) + '"]');
            if(el.attr('class') == 'cell') {
                $('[data-i="' + i + '"]').remove();

                for(var ii = i; ii < boardWidth; ii++) {
                    $('[data-i="' + (ii + 1) + '"]').attr('data-i', ii);
                }

                collateCollumns();
            }
        }
    }

    function dropDead() {
        for(var c = 0; c < boardHeight; c++) {
            $('.dead').each(function () {
                var el = $(this);
                var i = parseInt(el.attr('data-i'));
                var j = parseInt(el.attr('data-j'));

                if(j > 0) {
                    var uel = $('[data-i="' + i + '"][data-j="' + (j - 1) + '"]');
                    var buf = uel.attr('class');
                    uel.attr('class', el.attr('class'));
                    el.attr('class', buf);
                }
            });
        }

        addScore();
        $('.dead').removeClass('dead');
        collateCollumns();
    }

    function neightClick(i, j, color) {
        var el = $('[data-i="' + i + '"][data-j="' + j + '"]');
        getClick(el, color);
    }

    function getClick(el, ncolor) {
        if(el.attr('class') == 'cell') {
            return false;
        }

        var i = parseInt(el.attr('data-i'));
        var j = parseInt(el.attr('data-j'));

        if(
            isNaN(i) ||
            isNaN(j) ||
            (i < 0) ||
            (i >= boardWidth) ||
            (j < 0) ||
            (j >= boardHeight)
        ) {
            return false;
        }

        var color = el.attr('class').replace(/cell /, '');
        var neigh = 0;

        neigh += getNeight(i, j - 1, color);
        neigh += getNeight(i, j + 1, color);
        neigh += getNeight(i - 1, j, color);
        neigh += getNeight(i + 1, j, color);

        if((neigh > 0) || ncolor) {
            if(ncolor) {
                if(color != ncolor) {
                    return false;
                }
            }

            el.removeClass(color);
            el.addClass('dead');

            neightClick(i, j - 1, color);
            neightClick(i, j + 1, color);
            neightClick(i - 1, j, color);
            neightClick(i + 1, j, color);
        }

        dropDead();
    }

    function getNeight(i, j, color) {
        var el = $('[data-i="' + i + '"][data-j="' + j + '"]');
        if(el.hasClass(color)) {
            return 1;
        }
        else {
            return 0;
        }
    }

    //генерация случайного числа
    function getRandom(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }

    //создание доски
    for(var i = 0; i < boardHeight; i++) {
        $('#board').append('<tr></tr>');
    }

    var j = 0;
    $('#board tr').each(function () {
        for(var i = 0; i < boardWidth; i++) {
            var color = getRandom(1, colorCount);
            $(this).append('<td data-i="' + i + '" data-j="' + j + '" class="cell cl' + color + '"></td>');
        }
        j++;
    });

    $('.cell').click(function() {
        getClick($(this));
    });

    drawScore();

});
