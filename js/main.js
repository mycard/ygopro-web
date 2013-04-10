
var isIE = /*@cc_on!@*/!1;
// TODO: detect IE version
var IE10 = true;
var MZONE = 0;
var SZONE = 1;
var FIELD = 2;
var DECK = 3;
var HAND = 4;
var GRAVE = 5;
var EXTRA = 6;
var REMOVED = 7;
var LOCATION_STRING = ['mzone', 'szone', 'field', 'deck', 'hand', 'grave', 'extra', 'removed'];

var locale = 'zh';
var cards_url = "http://my-card.in/cards";
var locale_url = "http://my-card.in/cards_" + locale;

var card_img_url = "http://my-card.in/images/cards/ygocore/";
var card_img_thumb_url = "http://my-card.in/images/cards/ygocore/thumbnail/";

var datas = new Object();

function addCard(field, card_info) {
    var tmplItem = $(field).tmplItem().data;
    var location = tmplItem.location;
    var card_list = $.data(field, 'card_list');
    if (location == "location_szone" || location == "location_field")  //魔陷区和场地区最多只能有1张卡
        card_list = [];
    card_list.push(card_info);
    $.data(field, 'card_list', card_list);
    updateField(field);
}

function setCardStatus(field, card_id, stat) {
    var tmplItem = $(field).tmplItem().data;
    var card_list = $.data(field, 'card_list');

    for (var i = card_list.length; i--;)
        if (card_list[i].card_id == card_id) {
            card_list[i].position = stat;
            break;
        }
    updateField(field);
}

function removeCard(field, card_id) {
    var tmplItem = $(field).tmplItem().data;
    var location = tmplItem.location;
    var card_list = $.data(field, 'card_list');

    for (var i = card_list.length; i--;)
        if (card_list[i].card_id == card_id) {
            card_list.splice(i, 1);
            break;
        }
    $.data(field, 'card_list', card_list);
    updateField(field);
}
function updateField(field) {
    try {
        var tmplItem = $(field).tmplItem().data;
        var location = tmplItem.location;
        var card_list = $.data(field, 'card_list');
        var thumbs = $("thumb", field);

        $(field).empty();
        var width = $(field).width();
        var length = card_list.length;
        var start = width / 2 - 23 * length;

        for (var i in card_list) {
            var card_info = card_list[i];
            card_info.location = tmplItem.location;
            card_info.player = tmplItem.player;
            card_info.place = tmplItem.place;
            card_info.index = i;
            var top, left, right, bottom;
            if (45 < (width / length))
                left = start + 46 * i + 1;
            else
                left = (width - 46) / (length - 1) * i + 1;
            $("#thumb-tmpl").tmpl({
                card_info: card_info,
                //top: top || 3,
                //left: left || 0,
                //right: right || 0,
                //bottom: bottom || 0,
                card_img_thumb_url: card_img_thumb_url
            }).appendTo(field);
        }

        thumbs.mouseover(function () {
            var card_info = $(this).tmplItem().data.card_info;
            var card_id = card_info.card_id;
            showDetail(card_id);
        });

        updateCards(thumbs);
        if (0 != length) {
            var type;
            var text = "";
            if (location == "location_grave" || location == "location_deck" || location == "location_extra" || location == "location_removed") {
                type = "field_group_count";
                text = length;
            }
            else if (location == "location_mzone") {
                type = "monster_ad";
                var card_info = card_list[length - 1];
                var data = datas[card_info.card_id];

                var atk = data.atk;
                var def = data.def;
                if (atk < 0) atk = "?";
                if (def < 0) def = "?";
                text = atk + "/" + def;
            }
            $("#label_field-tmpl").tmpl({
                type: type,
                text: text
            }).appendTo(field);
        }
    }
    catch (e) { }
}
function updateCards(thumbs) {
    thumbs.each(function (i) {
        var thumb = $(this);
        var tmplItem = thumb.tmplItem().data;
        var card_info = tmplItem.card_info;
        var location = card_info.location;
        var card_id = card_info.card_id;

        var thumbImg = $("img", thumb)[0];

        switch (location) {
            case "location_szone":
            case "location_field":  //魔陷区和场地区只分表侧和里侧
                if (card_info.position.substring(0, 12) == "POS_FACEDOWN")
                    card_info.position = "POS_FACEDOWN_ATTACK";
                else
                    card_info.position = "POS_FACEUP_ATTACK";
                break;
            case "location_mzone":
                if (1 < thumbs.length && i < thumbs.length - 1) {  //超量素材
                    card_info.position = "POS_FACEUP_ATTACK";
                    card_info.IsXYZmaterial = true;
                }
                else
                    card_info.IsXYZmaterial = false;
                break;
            case "location_deck":
            case "location_extra":
                card_info.position = "POS_FACEDOWN_ATTACK";
                break;
        }

        switch (card_info.position) {
            case "POS_FACEUP_ATTACK":
                thumb.css("left", tmplItem.left + "px");
                if (isIE && !IE10)
                    thumb.css("top", tmplItem.top + "px");

                thumbImg.src = card_img_thumb + card_id + ".jpg";
                Img.rotate(thumb, 0, true);
                // }
                break;
            case "POS_FACEDOWN_ATTACK":
                thumb.css("left", tmplItem.left + "px");
                if (isIE && !IE10)
                    thumb.css("top", tmplItem.top + "px");

                thumbImg.src = "img/unknow.jpg";
                Img.rotate(thumb, 0, true);
                // }
                break;
            case "POS_FACEUP_DEFENCE":
                if (isIE && !IE10)
                    thumb.css({ "top": "13px", "left": "0px" });
                else
                    thumb.css("left", "10px");

                thumbImg.src = card_img_thumb + card_id + ".jpg";
                Img.rotate(thumb, -90, true);
                break;
            case "POS_FACEDOWN_DEFENCE":
                if (isIE && !IE10)
                    thumb.css({ "top": "13px", "left": "0px" });
                else
                    thumb.css("left", "10px");
                thumbImg.src = "img/unknow.jpg";
                Img.rotate(thumb, -90, true);
                break;
        }
    });
}

function showDetail(card_id) {
    $("detail_image").attr("src", card_img_url + card_id + ".jpg");

    /*
        if (!datas[card_id])
        {
            var cards = [];
            cards.push(card_id);
            loadCards(cards);
        }*/

    var card = datas[card_id];

    // Simon: Where is #detail_textarea ?
    // Tested with Chrome 24
    var textarea = document.getElementById("detail_textarea");
    var text = card.name + "[" + card._id + "]" + "\r\n";
    text += "[" + card.type + "]   "
    if (card.race) {
        text += card.race + " / " + card.attribute + "\r\n";
        text += "[" + card.star + "]" + card.level + "\r\n";
        text += "ATK/" + (card.atk < 0 ? "?" : card.atk) + "  DEF/" + (card.def < 0 ? "?" : card.def) + "\r\n";
    }
    else {
        text += "\r\n";
    }
    text += card.desc;
    textarea.innerHTML = text;
}

function checkNums() {
    var key = window.event.keyCode;
    if (key >= 48 && key <= 57 || key == 8) { }
    else
        return false;
}
function checkLetter() {
    var key = window.event.keyCode;
    if (key >= 65 && key <= 97) { }
    else
        return false;
}

function getViewSize() {
    return {
        w: window['innerWidth'] || document.documentElement.clientWidth,
        h: window['innerHeight'] || document.documentElement.clientHeight
    }
}
function getFullSize() {
    return { w: window.screen.width, h: window.screen.height }
}

// Simon: delete all same elements in the array?
// Or there won't be two same elements?
function delElement(array, v) {
    var result = [];
    for (var i in array) {
        if (array[i] != v)
            result.push(array[i]);
    }
    return result;
}

var speed = 1;
var Img = function () {
    var rotate = function (jQthumb, degree, immediatily) {
        if (immediatily || (isIE && !IE10)) {
            run(degree);
            return false;
        }

        var i = 0, timer = null;

        var thumb = jQthumb[0];
        var deg_begin = $.data(thumb, "degree");

        clearInterval(timer);

        timer = setInterval(function () {
            if (deg_begin < degree) {
                i += 1;
                run(deg_begin + i);
                if (deg_begin + i >= degree) {
                    i = 0;
                    clearInterval(timer);
                }
            }
            else if (deg_begin > degree) {
                i -= 1;
                run(deg_begin + i);
                if (deg_begin + i <= degree) {
                    i = 0;
                    clearInterval(timer);
                }
            }
        }, speed);
        function run(angle) {
            if (isIE && !IE10) { // IE
                var Matrix;
                for (p in thumb.filters)
                    if (p == "DXImageTransform.Microsoft.Matrix")
                        Matrix = thumb.filters["DXImageTransform.Microsoft.Matrix"];
                if (!Matrix)
                    thumb.style.filter += "progid:DXImageTransform.Microsoft.Matrix(enabled=true,SizingMethod=clip to original,FilterType=nearest neighbor)";
                Matrix = thumb.filters["DXImageTransform.Microsoft.Matrix"];
                Matrix.SizingMethod = "auto expand";  //Notice this code,it's very important
                thumb.Matrix = Matrix;
                var t = Math.PI * angle / 180;
                var c = Math.cos(t);
                var s = Math.sin(t);
                with (thumb.Matrix) { Dx = 0; M11 = c; M12 = -1 * s; M21 = s; M22 = c; }
            }
            else
                jQthumb.css("transform", "rotate(" + angle + "deg)");
            $.data(thumb, "degree", angle);
        }
    }

    return { rotate: rotate }
}();

function summon(card_id) {
    // Simon: Where is #center_image ?
    // Tested with Chrome 24.
    $("center_image")
        .attr("src", card_img_url + card_id + ".jpg")
        .css({
            "width": "177px",
            "height": "20px",
            "top": "340px",
            "left": "150px"
        });

    anim("center_image", {
        top: '100px',
        left: '150px',
        width: '177px',
        height: '254px',
    }, 200, 'Tween.Sine.easeInOut', {
        start: function (image) { image.style.display = 'block'; },
        complete: function (image) { setTimeout("hideImage()", 300); }
    });
}
function spsummon(card_id) {
    // Simon: Where is #center_image ?
    // Tested with Chrome 24
    $("center_image").attr("src", card_img_url + card_id + ".jpg")
        .css({
            "width": "88px",
            "height": "128px",
            "top": "160px",
            "left": "195px"
        });

    anim("center_image", {
        top: '100px',
        left: '150px',
        width: '177px',
        height: '254px',
    }, 200, 'Tween.Sine.easeInOut', {
        start: function (image) { image.style.display = 'block'; },
        complete: function (image) { setTimeout("hideImage()", 300); }
    }
	);
}
function hideImage() {
    // Simon: Where is #center_image ?
    // Tested with Chrome 24
    $("center_image").hide(0);
}