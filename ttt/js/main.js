var hod = 0;
var win = true;
var names = ['крестики', 'нолики'];
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
    if(win) {
        //alert('Победили ' + names[+hod]);
        l('Победили ' + names[+hod]);
    }
    else {
        win = true;
    }
}
function getState(i, j) {
    var cell = q('#game [data-i="' + i + '"][data-j="' + j + '"]');
    if(cell == null) {
        return -1;
    }
    if(cell.classList.length <= 1) {
        return 0;
    }
    return cell.classList[1];
}

window.onload = function() {

    var html = '';
    for(var i = 0; i < 3; i++) {
        html += '<tr class="row" data-i="' + i + '">';
        for(var j = 0; j < 3; j++) {
            html += '<td class="cell" data-i="' + i + '" data-j="' + j + '"></td>';
        }
        q('#game').innerHTML = html;
    }

    qs('.cell').forEach(function(el, i) {
        el.onclick = function () {
            var cell = event.target;
            if(cell.classList.length > 1) {
                return false;
            }
            cell.classList.add(colors[hod]);
            hod = hod < names.length - 1 ? hod + 1 : 0;
            checkWinner(el.getAttribute('data-i'), el.getAttribute('data-j'));
        }
    });

    function checkWinner(i, j) {
        var size = Math.min(
            q('#game').rows.length,
            qs('#game .row:nth-child(1) .cell').length
        );

        var cellState = getState(i, j);

        // w-e
        for(var c = Math.max(0, i - size); c < size; c++) {
            var currState = getState(i, c);
            if(currState == -1) { return false; }
            if(currState != cellState) { win = false; break; }
        }
        showWinner();

        // n-s
        for(var c = Math.max(0, j - size); c < size; c++) {
            var currState = getState(c, j);
            if(currState == -1) { return false; }
            if(currState != cellState) { win = false; break; }
        }
        showWinner();

        // nw-se
        for(var c = Math.max(0, i - size); c < size; c++) {
            var currState = getState(c, c);
            if(currState == -1) { return false; }
            if(currState != cellState) { win = false; break; }
        }
        showWinner();

        // ne-sw
        for(var c = Math.max(0, j - size); c < size; c++) {
            var currState = getState(c, size - 1 - c);
            if(currState == -1) { return false; }
            if(currState != cellState) { win = false; break; }
        }
        showWinner();
    }
}
