var hod = 0;
var win = true;
var names = ['красные', 'синие'];
var colors = ['p0', 'p1'];

function l(data) {
    console.log(data);
}
function q(selector) {
    return document.querySelector(selector);
}
function qs(selector) {
    return document.querySelectorAll(selector);
}

function showWinner() {
    if (win) {
        setTimeout(function () {
            alert('Победили ' + names[+hod]);
            newGame();
        }, 200);
    }
    else {
        win = true;
    }
}

function getState(i, j) {
    var cell = q('#game [data-i="' + i + '"][data-j="' + j + '"]');
    if (cell == null) {
        return -1;
    }
    if (cell.classList.length <= 1) {
        return 0;
    }
    return cell.classList[1];
}

function checkWinner(i, j) {
    var size = q('#game').rows.length;
    var cellState = getState(i, j);
    var currState;

    for (var dir = 0; dir < 4; dir++) {
        for (var c = Math.max(0, i - size); c < size; c++) {
            switch (dir) {
                case 0: { currState = getState(i, c); break; }
                case 1: { currState = getState(c, j); break; }
                case 2: { currState = getState(c, c); break; }
                case 3: { currState = getState(c, size - 1 - c); break; }
            }
            if (currState == -1) { return false; }
            if (currState != cellState) { win = false; break; }
        }
        showWinner();
    }
}

function newGame() {
    var html = '';
    for (var i = 0; i < 3; i++) {
        html += '<tr class="row" data-i="' + i + '">';
        for (var j = 0; j < 3; j++) {
            html += '<td class="cell" data-i="' + i + '" data-j="' + j + '"></td>';
        }
        q('#game').innerHTML = html;
    }

    qs('.cell').forEach(function (el, i) {
        el.onclick = function () {
            var cell = event.target;
            if (cell.classList.length > 1) {
                return false;
            }
            cell.classList.add(colors[hod]);
            hod = hod < names.length - 1 ? hod + 1 : 0;
            checkWinner(el.getAttribute('data-i'), el.getAttribute('data-j'));
        }
    });

}

window.onload = function () {
    newGame();
}
