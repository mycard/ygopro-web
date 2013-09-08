/// <reference path="vendor/jquery-1.9.1.min.js" />
/// <reference path="vendor/jquery.tmpl.min.js" />

var messages = [];
var index = 0;

function readReplay(str) {
    messages = str.split('\n');
    readMessage();
}

function getID(str) {
    return parseInt(str.split('?')[1]);
}
function getName(str) {
    return str.split('?')[1].split('$')[0];
}
function getPlayer(str) {
    return parseInt(str.substr(9, 1));
}
function getLocation(str) {
    switch (parseInt(str)) {
        case 1:
            return "deck";
            break;
        case 2:
            return "hand";
            break;
        case 4:
            return "mzone";
            break;
        case 8:
            return "szone";
            break;
        case 16:
            return "grave";
            break;
        case 32:
            return "removed";
            break;
        case 64:
            return "extra";
            break;
    }
}

var paused = false;

function stepPlay() {
    paused = false;
    readMessage();
    paused = true;
}
function pause() {
    paused = true;
}

function play() {
    paused = false;
    readMessage();
}

function readMessage() {
    replay.set_action_id(index);
    if (paused)
        return;

    if (index >= messages.length)
        return;

    // 过滤连续相同的消息
    if (index > 1 && messages[index] == messages[index - 1])
        index++;

    var message = messages[index++];

    var list_array = new Array();
    list_array = message.split('|');

    //输出文字解析
    try {
        outprint(message);
        $("#textout").append(outputhtml).scrollTop($("#textout").prop("scrollHeight"));

        outputhtml = "";
    } catch (e) {
        alert(e)
    }


    //输出图形解析
    switch (parseInt(list_array[1])) {
        case 0: //deck
            var cards_id = [];
            var deck = $("#0_deck_0"), player = 0;

            duel.set_player_name(getName(list_array[2]));
            for (var i = 3; i < list_array.length; i++) {
                if (list_array[i] == "ALLDECK")
                    continue;
                if (list_array[i] == "ALLEXTRA") {
                    deck = $("#" + player + "_extra_0");
                    continue;
                }
                if (list_array[i] == "END") {
                    if (player == 0) {
                        player = 1;
                        duel.set_opponent_name(getName(list_array[i + 1]));
                        deck = $("#1_deck_0");
                        continue;
                    }
                    else
                        break;
                }

                var id = getID(list_array[i]);
                cards_id.push(id);
                addCard(deck, id);
            }
            Card.fetch(cards_id);
            break;
        case 40:
            duel.set_turn(list_array[3])
            break;
        case 41:
            //MSG|41|新阶段|抽卡阶段
            //$('#pdiv').html(list_array[3]);
            var phases = { "抽卡阶段": 'DP', "STANDBY": 'SP', "主要阶段1": 'M1', "战斗阶段": 'BP', "主要阶段2": 'M1', "结束阶段": 'EP' }
            duel.set_phase(phases[list_array[3].split("\r")[0]])
            break;
        case 50://move
            var player, id, loc, sequence;
            for (var i = 0; i < list_array.length; i++) {
                if (list_array[i] == "REMOVECARD") {
                    player = getPlayer(list_array[i + 1]);
                    id = getID(list_array[i + 7]);
                    loc = getLocation(list_array[i + 3]);
                    //只有中间两个区域有编号
                    if (loc == "hand")
                        removeHandCard(player, id);
                    else {
                        if ((loc != "mzone") && (loc != "szone"))
                            sequence = 0;
                        else
                            sequence = list_array[i + 5];
                        if (loc == "szone" && sequence == 5) {
                            loc = "field";
                            sequence = 0;
                        }
                        removeCard($("#" + player + "_" + loc + "_" + sequence), id);
                    }
                }

                if (list_array[i] == "ADDCARD") {
                    player = getPlayer(list_array[i + 1]);
                    id = getID(list_array[i + 7]);
                    loc = getLocation(list_array[i + 3]);
                    if (loc == "hand")
                        addHandCard(player, id);
                    else {
                        if (loc != "mzone" && loc != "szone")
                            sequence = 0;
                        else
                            sequence = list_array[i + 5];
                        if (loc == "szone" && sequence == 5) {
                            loc = "field";
                            sequence = 0;
                        }
                        addCard($("#" + player + "_" + loc + "_" + sequence), id);
                    }
                }
            }
            break;
        case 54://放置卡片
            //MSG|54|放置卡片|活死人的呼声?97077563|Playerpos1?邪之混沌|位置|8|次序|2|表示|10
            var player = getPlayer(list_array[4]);
            var id = getID(list_array[3]);
            var loc = getLocation(list_array[6]);
            var sequence = list_array[8];
            if (loc == "szone" && sequence == 5) {
                loc = "field";
                sequence = 0;
            }
            setCardStatus($("#" + player + "_" + loc + "_" + sequence), getBiaoshi(list_array[10]));
            break;
        case 60:
            //MSG|60|发动召唤|Playerpos0?anyouxi|位置|4|次序|2|表示|1|云魔物-乱气流?16197610
            var id = getID(list_array[10]);
            // TODO: (Simon) Summon card.
            //summon(id);
            break;
        case 62://特殊召唤
            //MSG|62|特殊召唤阶段开始|Playerpos0?anyouxi|位置|4|次序|1|表示|4|云魔物-小烟球?8082555

            var player = getPlayer(list_array[3]);
            var id = getID(list_array[10]);
            var loc = getLocation(list_array[5]);
            var sequence = list_array[7];
            setCardStatus($("#" + player + "_" + loc + "_" + sequence), getBiaoshi(list_array[9]));
            // TODO: (Simon) Special summon card.
            //spsummon(id);
            break;

        case 64://反转召唤
            var player = getPlayer(list_array[3]);
            var id = getID(list_array[11]);
            var loc = getLocation(list_array[5]);
            var sequence = list_array[7];
            setCardStatus($("#" + player + "_" + loc + "_" + sequence), getBiaoshi(list_array[9]));
            break;

        case 90://draw
            var player = getPlayer(list_array[2]);
            for (var i = 0; i < list_array.length; i++) {
                if (list_array[i] == "ADDCARD") {
                    var id = getID(list_array[i + 7]);
                    removeCard($("#" + player + "_deck_0"), id);
                    addHandCard(player, id);
                }
            }

            break;
        case 91://伤害
            duel.set_lp(getPlayer(list_array[5]) ? 'opponent' : 'player', list_array[6])
            break;
        case 92:
            duel.set_lp(getPlayer(list_array[2]) ? 'opponent' : 'player', '+=' + list_array[3])
            break;
        case 100://cost
            duel.set_lp(getPlayer(list_array[3]) ? 'opponent' : 'player', list_array[7])
            break;
        default:
            readMessage();
            return;
    }
    setTimeout(readMessage, replay.get_action_inteval());
}