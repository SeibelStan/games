var rules = [
    {"text": "Используются набор фигур и поле от обычных шахмат"},
    {"text": "Фигуры расставляются на усмотрение игроков. На пример, по очереди в пределах первых трёх линий"},
    {"text": "При атаке исход можно решить броском <a href=\"#rolldice\">пары кубиков</a>: если первый больше второго, то считается, что атакованная фигура снята"},
    {"text": "При атаке с переходом (как &laquo;съедание&raquo; в классических шахматах) броски выполняются так: при неуспешной атаке выполняется бросок за атакованного (&laquo;отдача&raquo;), и так до тех пор, пока не будет снята одна из фигур"},
    {"text": "Если играть без кубиков (казуально) то просто снимать атакованных (влечёт заметный дисбаланс)"}
]

var units = [
    {
        "id": "soldier",
        "title": "Солдат",
        "glif": "\u2659",
        "cost": 1,
        "moves": "на одну клетку по прямым<noretreat title=\"Ни шагу назад\"></noretreat>",
        "attack": "один раз по диагонали перед собой без перехода на атакованную клетку; на одну клетку вперёд с переходом<zombirush title=\"Зомби-раш\"></zombirush>"
    },
    {
        "id": "paladin",
        "title": "Паладин",
        "glif": "\u2656",
        "cost": 3,
        "moves": "на одну клетку по прямым<noretreat title=\"Ни шагу назад\"></noretreat>",
        "attack": "один раз по диагонали перед собой без перехода на атакованную клетку; на одну клетку вперёд с переходом",
        "abils": "не может быть атакован спереди (кроме перехода драконом)"
    },
    {
        "id": "champion",
        "title": "Чемпион",
        "glif": "\u2658",
        "cost": 3,
        "moves": "до трёх клеток по прямым<noretreat title=\"Ни шагу назад\"></noretreat>",
        "attack": "фигуру в конце пути с переходом на её клетку<chevalier title=\"Рыцари и чернь\"></chevalier>"
    },
    {
        "id": "shoter",
        "title": "Стрелок",
        "glif": "\u2657",
        "cost": 3,
        "moves": "на одну клетку по прямым<noretreat title=\"Ни шагу назад\"></noretreat>",
        "attack": "до трёх клеток по прямым без перехода на атакованную клетку"
    },
    {
        "id": "dragon",
        "title": "Дракон",
        "glif": "\u2655",
        "cost": 6,
        "moves": "на одну клетку по прямым<noretreat title=\"Ни шагу назад\"></noretreat>",
        "attack": "сразу три клетки ближней линии перед собой (включая дружественные); начинает бой при шаге на клетку противника (даже паладина)",
        "abils": "имеет <dragonmaster>две жизни</dragonmaster>"
    },
    {
        "id": "archmage",
        "title": "Архимаг",
        "glif": "\u2654",
        "cost": 5,
        "moves": "на одну клетку в любую сторону",
        "attack": "до двух клеток по диагоналям и вперёд без перехода на атакованную клетку",
        "abils": "<laststand>при его потере засчитывается поражение</laststand><necromancy title=\"Некромантия\"></necromancy><ragnarock title=\"Рагнарёк\"></ragnarock><dragonmaster-a title=\"Драконмейстер\"></dragonmaster-a>"
    }
]

var mods = [
    {
        "id": "noretreat",
        "title": "Ни шагу назад",
        "glif": "\u21a5",
        "trigger": "\
            $('noretreat').html(' (но не назад)');\
            $('#archmage').find('.costval').html(parseInt($('#archmage').find('.costval').html()) + 1);\
        "
    },
    {
        "id": "zombirush",
        "title": "Зомби-раш",
        "glif": "\u2659",
        "trigger": "\
            $('zombirush').html('. Вместо снятия фигуры (кроме другого зомби) заменяет её фигурой зомби своего цвета');\
            $('.units').html($('.units').html().replace(/солдата/gi, 'зомби'));\
            $('.units').html($('.units').html().replace(/Солдат/gi, 'Зомби'));\
            $('#soldier').find('.costval').html(parseInt($('#soldier').find('.costval').html()) + 1);\
        "
    },
    {
        "id": "ragnarock",
        "title": "Рагнарёк",
        "glif": "\u21af",
        "trigger": "\
            if($('#necromancy').prop('checked')) {\
                $('ragnarock').html('. Так же, может снять с доски любые фигуры дальше первой линии и восстановить на первой линии ранее снятую фигуру соответствующей цены');\
            }\
            else {\
                $('ragnarock').html('. Находясь на первой линии может снять с доски любые фигуры дальше первой линии и восстановить на первой линии ранее снятую фигуру соответствующей цены');\
            }\
            $('#archmage').find('.costval').html(parseInt($('#archmage').find('.costval').html()) + 1);\
        "
    },
    {
        "id": "dragonmaster",
        "title": "Драконмейстер",
        "glif": "\u2655",
        "trigger": "\
            $('dragonmaster').html('четыре жизни. <laststand>При его потере засчитывается поражение</laststand>');\
            $('dragonmaster-a').html('. Может лечить дракона на одну жизнь за ход');\
            $('#dragon').find('.costval').html(parseInt($('#dragon').find('.costval').html()) + 6);\
            $('dragonmaster').attr('title', 'До последнего');\
        "
    },
    {
        "id": "necromancy",
        "title": "Некромантия",
        "glif": "\u21bb",
        "trigger": "\
            $('necromancy').html('. Находясь на первой линии может ставить обратно, на первую линию, ранее снятых солдат');\
            $('.units').html($('.units').html().replace(/Архимаг/gi, 'Некромант'));\
            $('#archmage').find('.costval').html(parseInt($('#archmage').find('.costval').html()) + 6);\
        "
    },
    {
        "id": "chevalier",
        "title": "Рыцари и чернь",
        "glif": "\u2658",
        "trigger": "\
            $('chevalier').html('. В любом случае снимает солдата');\
            $('#champion').find('.costval').html(parseInt($('#champion').find('.costval').html()) + 2);\
        "
    },
    {
        "id": "canonfodder",
        "title": "Своих &mdash; не жалеть",
        "glif": "\u2020",
        "trigger": "\
            $('.rules').append('<li title=&quot;Своих &mdash; не жалеть&quot;>Разрешается снимать свои фигуры.');\
        "
    },
    {
        "id": "reserve",
        "title": "Резерв",
        "glif": "\u262f",
        "trigger": "\
            $('.rules').append('<li title=&quot;Резерв&quot;>На старте игрокам даётся N (рекомендуется от 40) очков. В начале игры фигуры можно выставлять так же в пределах первых трёх линий, списывая из резерва стоимость выставленных фигур. После начала &mdash; только на первую.');\
        "
    },
    {
        "id": "laststand",
        "title": "До последнего",
        "glif": "\u2605",
        "trigger": "\
            $('laststand').html('потеря не влияет на исход игры');\
            $('laststand').attr('title', 'До последнего');\
        "
    }
]

function rulesRender() {
    $('.rules').html('');
    for(var i in rules) {
        $('.rules').append('<li>' + rules[i].text + '.');
    }

    $('.units').html('');
    for(var i in units) {
        $('.units').append(
            '<li id="' + units[i].id + '"><h3>' + units[i].glif + ' ' + units[i].title + '</h3>'
            + '<p class="moves">Передвигается ' + units[i].moves + '.'
            + '<p class="attack">Атакует ' + units[i].attack + '.'
            + '<p class="abils">' + ((units[i].abils) ? ('Особен тем, что ' + units[i].abils + '.') : '')
            + '<p class="cost">Стоимость: <span class="costval">' + units[i].cost + '</cost>'
        );

    }

    $('.mod').each(function () {

        if($(this).prop('checked')) {
            eval($(this).data('trigger'));
        }
    });
}

function modsRender() {
    $('.mods').html('');
    for(var i in mods) {
        $('.mods').append(
            '<li><label><input id="' + mods[i].id + '" type="checkbox" class="mod" data-trigger="' + mods[i].trigger + '"> ' + mods[i].glif + ' ' + mods[i].title + '</label>'
        );
    }

    $('.mod').click(function () {
        rulesRender();
    });

    $('#rolldice').click(function () {
        function getDice(min, max) {
            var dices = ['1', '2', '3', '4', '5', '6'];
            return dices[Math.round(Math.random() * (max - min) + min) - 1];
        }
        var dice1 = getDice(1, 6);
        var dice2 = getDice(1, 6);
        $('#rolldice').html('\
            <span class="dice">' + dice1 + '</span> и <span class="dice">' + dice2 + '</span>'
        );
        $('#rolldice')
            .removeClass('roll-true')
            .removeClass('roll-false')
            .addClass((dice1 > dice2) ? 'roll-true' : 'roll-false');
    });
}

$(function () {
    $('body').keyup(function (e) {
        if(e.keyCode == 13) {
            $('#rolldice').click();
        }
    });
    rulesRender();
    modsRender();
});
