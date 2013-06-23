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

function addCard(field, id) {
    var card_list = field.data("card_list");
    card_list.push(id)
    field.data("card_list", card_list);
    field.attr("src", "http://my-card.in/images/cards/ygocore/" + card_list[card_list.length - 1] + ".jpg");
}

function removeCard(field, id) {
    var card_list = field.data("card_list");
    card_list.splice(card_list.lastIndexOf(id), 1);
    field.data("card_list", card_list);
    if (card_list.length > 0)
        field.attr("src", "http://my-card.in/images/cards/ygocore/" + card_list[card_list.length - 1] + ".jpg");
    else {
        field.attr("src", "img/transparent.png");
        field.removeClass("defense");
    }
}

function setCardStatus(field, stat) {
    if (stat.indexOf("FACEUP") != -1) {
        var card_list = field.data("card_list");
        field.attr("src", "http://my-card.in/images/cards/ygocore/" + card_list[card_list.length - 1] + ".jpg");
    }
    else
        field.attr("src", "img/unknow.jpg");
    if (stat.indexOf("DEFENCE") != -1)
        field.addClass("defense");
    else
        field.removeClass("defense");
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


var resizeTimeout;
function resizeStage() {
    if (innerWidth / innerHeight >= 830 / 645) {
        var height = $(".container").height();
        $(".stage").height(height).width(height).css("margin", "0px " + ($(".container").width() - height) / 2 + "px");
    }
    else {
        var width = $(".container").width();
        $(".stage").height(width).width(width).css("margin", ($(".container").height() - width) / 7 + "px 0px");
    }

    $(".hand .card").css("margin-left", function () {
        return 0 - $(this).height() * 177 / 254 / 2 + "px";
    });
}
$(window).resize(function () {
    if (!resizeTimeout) {
        resizeTimeout = setTimeout(function () {
            resizeTimeout = null;
            resizeStage();
        }, 33);
    }
});
resizeStage();

function addHandCard(player, card_id) {
    $("#" + player + "_hand").append($("#handCard-tmpl").tmpl({ "id": card_id }));
    resizeStage();
}
function removeHandCard(player, card_id) {
    $("#" + player + "_hand .cell:has(.card[data-id=" + card_id + "])").remove();
    resizeStage();
}
