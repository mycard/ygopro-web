
var isIE = /*@cc_on!@*/!1;
var IE10 = isIE && parseInt($.browser.version) >= 10;
var MZONE = 0;
var SZONE = 1;
var FIELD = 2;
var DECK = 3;
var HAND = 4;
var GRAVE = 5;
var EXTRA = 6;
var REMOVED = 7;
var LOCATION_STRING = ['mzone','szone','field','deck','hand','grave','extra','removed'];
var PLAYER_1 = [
{"top": 138, "left": 71}, //mzone
{"top": 64, "left": 71},  //szone
{"top": 99, "left": 408}, //field
{"top": 20, "left": 8},   //deck
{"top": -13, "left": 71}, //hand
{"top": 99, "left": 8},   //grave
{"top": 20, "left": 408}, //extra
{"top": 178, "left": 8},  //removed
];
var PLAYER_0 = [
{"top": 265, "left": 71}, //mzone
{"top": 339, "left": 71}, //szone
{"top": 302, "left": 8},  //field
{"top": 382, "left": 408},//deck
{"top": 416, "left": 71}, //hand
{"top": 302, "left": 408},//grave
{"top": 382, "left": 8},  //extra
{"top": 222, "left": 408},//removed
];
var COORDINATE = [PLAYER_0,PLAYER_1];

var locale = 'zh';
var cards_url = "http://my-card.in/cards";
var locale_url = "http://my-card.in/cards_" + locale;

var card_img_url = "http://my-card.in/images/cards/ygocore/";
var card_img_thumb_url = "http://my-card.in/images/cards/ygocore/thumbnail/";

var datas = new Object();

function initField(){
	var player, place;
	for(player=0;player<2;player++){
		for(place=0;place<5;place++)
			addField(player,SZONE,place);
		for(place=0;place<5;place++)
			addField(player,MZONE,place);
		addField(player,FIELD,0);
		addField(player,DECK,0);
		addField(player,HAND,0);
		addField(player,GRAVE,0);
		addField(player,EXTRA,0);
		addField(player,REMOVED,0);
	}
	var fields = GetAllFields();
	for(var i=0; i< fields.length;i++){
		var card_list = [];
		$.data(fields[i], 'card_list', card_list);
	}

}
function addField(player, location, place) {//画场地
	var top, left;
	top = COORDINATE[player][location].top;
	left = COORDINATE[player][location].left + 66*place;
	if(location == MZONE || location == SZONE){
		if(player == 0){
			top = COORDINATE[player][location].top;
			left = COORDINATE[player][location].left + 66*place;
		}
		else {
			top = COORDINATE[player][location].top;
			left = COORDINATE[player][location].left + 66*(4-place);
		}
	}
	$('#field-tmpl').tmpl({
		player: player || 0,
		location: "location_" + LOCATION_STRING[location] || 0,
		place: place || 0,
		top: top,
		left: left
	}).appendTo($('#fields'));
}
function addCard(field, card_info){
	var tmplItem = $(field).tmplItem().data;
	var location = tmplItem.location;
	var card_list = $.data(field, 'card_list');
	if(location == "location_szone" || location == "location_field"){ //魔陷区和场地区最多只能有1张卡
		card_list = [];
	}
	card_list.push(card_info);
	$.data(field, 'card_list', card_list);
	updateField(field);
}

function setcardstatus(field,card_id,stat){
	var tmplItem = $(field).tmplItem().data;
	var location = tmplItem.location;
	var card_list = $.data(field, 'card_list');
	for(var i=card_list.length-1; i>=0; i--){
		if(card_list[i].card_id == card_id){
			card_list[i].position=stat;
			break;
		}
	}
	updateField(field);
}
	 
function removeCard(field, card_id){
	var tmplItem = $(field).tmplItem().data;
	var location = tmplItem.location;
	var card_list = $.data(field, 'card_list');
	for(var i=card_list.length-1; i>=0; i--){
		if(card_list[i].card_id == card_id){
			card_list = del(card_list, i);
			break;
		}
	}
	$.data(field, 'card_list', card_list);
	updateField(field);
}
function updateField(field){
	try
	{
		var tmplItem = $(field).tmplItem().data;
		var location = tmplItem.location;
		var card_list = $.data(field, 'card_list');
		var thumbs = getElementsByClassName("thumb",field);
		$(field).empty();
		var width = $(field).width();
		var length = card_list.length;
		var start = width/2 - 23*length;
		
		for(var i in card_list){
			var card_info = card_list[i];
			card_info.location = tmplItem.location;
			card_info.player = tmplItem.player;
			card_info.place = tmplItem.place;
			card_info.index = i;
			var top, left, right, bottom;
			if(45 < (width / length)) 
				left = start + 46*i + 1;
			else 
				left = (width-46)/(length-1)*i + 1;
			$("#thumb-tmpl").tmpl({
				card_info: card_info,
				//top: top || 3,
				//left: left || 0,
				//right: right || 0,
				//bottom: bottom || 0,
				card_img_thumb_url: card_img_thumb_url
			}).appendTo(field);
		}
		var thumbs = getElementsByClassName("thumb",field);
		for (var i=0; i<thumbs.length; i++){
			thumbs[i].onmouseover = function(){
				var card_info = $(this).tmplItem().data.card_info;
				var card_id = card_info.card_id;
				showDetail(card_id);
			}
		}
		updateCards(thumbs);
		if(0 != length){
			var type;
			var text = "";
			if(location == "location_grave" || location == "location_deck" || location == "location_extra" || location == "location_removed"){
				type = "field_group_count";
				text = length;
			}
			else if(location == "location_mzone"){
				type = "monster_ad";
				var card_info = card_list[length-1];
				var data = datas[card_info.card_id];
				var atk = data.atk;
				var def = data.def;
				if(atk < 0){atk = "?";}
				if(def < 0){def = "?";}
				text = atk + "/" + def;
			}
			$("#label_field-tmpl").tmpl({
				type: type,
				text: text
			}).appendTo(field);
		}
	}
	catch (e)
	{
		
	}
}
function updateCards(thumbs){	
	for (var i=0; i<thumbs.length; i++){
		var thumb = thumbs[i];
		var tmplItem = $(thumb).tmplItem().data;
		var card_info = tmplItem.card_info;
		var location = card_info.location;
		var card_id = card_info.card_id;
		var thumbImg = thumb.getElementsByTagName("img")[0];
		if(location == "location_szone" || location == "location_field"){ //魔陷区和场地区只分表侧和里侧
			if(card_info.position == "POS_FACEDOWN_ATTACK" || card_info.position == "POS_FACEDOWN_DEFENCE")
				card_info.position = "POS_FACEDOWN_ATTACK";
			else
				card_info.position = "POS_FACEUP_ATTACK";
		}
		else if(location == "location_mzone"){
			if(1 < thumbs.length && i < thumbs.length-1){//超量素材
				card_info.position = "POS_FACEUP_ATTACK";
				card_info.IsXYZmaterial = true;
			}
			else {
				card_info.IsXYZmaterial = false;
			}
		}
		else if(location == "location_deck" || location == "location_extra"){
			card_info.position = "POS_FACEDOWN_ATTACK";
		}
		if(card_info.position == "POS_FACEUP_ATTACK"){
			if(isIE && !IE10){
				thumb.style.top = tmplItem.top + "px";
				thumb.style.left = tmplItem.left + "px";
			}
			else {
				thumb.style.left = tmplItem.left + "px";
			}
			thumbImg.src = card_img_thumb + card_id + ".jpg";
			Img.rotate(thumb, 0, true);
		}
		else if(card_info.position == "POS_FACEUP_DEFENCE"){
			if(isIE && !IE10){
				thumb.style.top = 13 + "px";
				thumb.style.left = 0 + "px";
			}
			else {
				thumb.style.left = 10 + "px";
			}
			thumbImg.src = card_img_thumb + card_id + ".jpg";
			Img.rotate(thumb, -90, true);
		}
		else if(card_info.position == "POS_FACEDOWN_DEFENCE"){
			if(isIE && !IE10){
				thumb.style.top = 13 + "px";
				thumb.style.left = 0 + "px";
			}
			else {
				thumb.style.left = 10 + "px";
			}
			thumbImg.src = "img/unknow.jpg";
			Img.rotate(thumb, -90, true);
		}
		else if(card_info.position == "POS_FACEDOWN_ATTACK"){
			if(isIE && !IE10){
				thumb.style.top = tmplItem.top + "px";
				thumb.style.left = tmplItem.left + "px";
			}
			else {
				thumb.style.left = tmplItem.left + "px";
			}
			thumbImg.src = "img/unknow.jpg";
			Img.rotate(thumb, 0, true);
		}
	}
}
function GetAllFields(){
	var fields = [];
	addToFields(fields, "location_szone");
	addToFields(fields, "location_mzone");
	addToFields(fields, "location_field");
	addToFields(fields, "location_hand");
	addToFields(fields, "location_deck");
	addToFields(fields, "location_grave");
	addToFields(fields, "location_removed");
	addToFields(fields, "location_extra");
	return fields;
}

function getElementsByClassName(className, element) {
    var children = (element || document).getElementsByTagName('*');
    var elements = new Array();
 
    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        var classNames = child.className.split(' ');
        for (var j = 0; j < classNames.length; j++) {
            if (classNames[j] == className) {
                elements.push(child);
                break;
            }
        }
    }
 
    return elements;
}



function addToFields(fields, classname){
	var temp = getElementsByClassName(classname,document);
	for(var i =0; i < temp.length; i++){
		fields.push(temp[i]);
	}
}

function showDetail(card_id){
	var img = document.getElementById("detail_image");
	img.src = card_img_url + card_id + ".jpg";

/*
	if (!datas[card_id])
	{
		var cards = [];
		cards.push(card_id);
		loadCards(cards);
	}*/
		
	var card = datas[card_id];
	
	var textarea = document.getElementById("detail_textarea");
	var text = card.name + "["+ card._id + "]" + "\r\n";
	text += "[" + card.type + "]   "
	if(card.race){
		text += card.race + " / " + card.attribute + "\r\n" ;
		text += "[" + card.star + "]" + card.level + "\r\n";
		text += "ATK/" + (card.atk<0?"?":card.atk) + "  DEF/" + (card.def<0?"?":card.def) + "\r\n";
	}
	else {
		text += "\r\n";
	}
	text +=  card.desc;
	textarea.innerHTML = text;
}

function checkNums() {
	var key = window.event.keyCode;
	if (key >= 48 && key <= 57 || key == 8) {
	}
	else {
		return false;
	}
}
function checkLetter() {
	var key = window.event.keyCode;
	if (key >= 65 && key <= 97) {
	}
	else {
		return false;
	}
}

function getViewSize(){
	return {w: window['innerWidth'] || document.documentElement.clientWidth,
	h: window['innerHeight'] || document.documentElement.clientHeight}
}
function getFullSize(){
	return {w: window.screen.width, h: window.screen.height}
}
function del(array,n){
	var result = [];
	for(var i in array){
		if(i != n)
			result.push(array[i]);
	}
	return result;
}
function delElement(array,v){
	var result = [];
	for(var i in array){
		if(array[i] != v)
			result.push(array[i]);
	}
	return result;
}

var speed = 1;
var Img = function() {
	var rotate = function(thumb, degree, immediatily) {
		if(immediatily){
			run(degree);
			return false;
		}
		if(isIE && !IE10){
			run(degree);
			return false;
		}
		var i = 0, timer = null ;
		var deg_begin = $.data(thumb, "degree");
		clearInterval(timer);

		timer = setInterval(function() {
			if(deg_begin < degree){
				i += 1;
				run(deg_begin + i);
				if (deg_begin + i >= degree) {
					i = 0;
					clearInterval(timer);
				}
			}
			else if(deg_begin > degree){
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
				for(p in thumb.filters) {
					if(p=="DXImageTransform.Microsoft.Matrix")Matrix=thumb.filters["DXImageTransform.Microsoft.Matrix"];
				}
				if(!Matrix) {
					thumb.style.filter+="progid:DXImageTransform.Microsoft.Matrix(enabled=true,SizingMethod=clip to original,FilterType=nearest neighbor)";
				}
				Matrix=thumb.filters["DXImageTransform.Microsoft.Matrix"];
				Matrix.SizingMethod = "auto expand";//Notice this code,it's very important
				thumb.Matrix=Matrix;
				var t=Math.PI*angle/180;
				var c=Math.cos(t);
				var s=Math.sin(t);
				with(thumb.Matrix){Dx=0; M11=c; M12=-1*s; M21=s; M22=c;}
			} else if (thumb.style.MozTransform !== undefined) {  // Mozilla
				thumb.style.MozTransform = 'rotate(' + angle + 'deg)';
			} else if (thumb.style.OTransform !== undefined) {   // Opera
				thumb.style.OTransform = 'rotate(' + angle + 'deg)';
			} else if (thumb.style.webkitTransform !== undefined) { // Chrome Safari
				thumb.style.webkitTransform = 'rotate(' + angle + 'deg)';
			} else {
				thumb.style.transform = "rotate(" + angle + "deg)";
			}
			
			$.data(thumb, "degree", angle);
		}
	}
	
	
	return {rotate: rotate}
}();

function summon(card_id) {	
	var image = document.getElementById("center_image");
	image.src = card_img_url + card_id + ".jpg";
    image.style.width  = "177px"; 
	image.style.height = "20px";
	image.style.top    = "340px";
	image.style.left   = "150px"; 
    anim("center_image", {
        top:'100px',
        left:'150px',
        width: '177px',
        height: '254px',
		}, 200, 'Tween.Sine.easeInOut', {
			start: function (image) { image.style.display = 'block'; },  
			complete: function (image) { setTimeout("hideImage()", 300); }
		}
	);
}
function spsummon(card_id) {	
	var image = document.getElementById("center_image");
	image.src = card_img_url + card_id + ".jpg";
	image.style.width="88px"; 
	image.style.height="128px";
	image.style.top="160px";
	image.style.left="195px"; 
	anim("center_image", {
		top:'100px',
		left:'150px',
		width: '177px',
		height: '254px',
		}, 200, 'Tween.Sine.easeInOut', {
			start: function (image) { image.style.display = 'block'; },  
			complete: function (image) { setTimeout("hideImage()", 300); }
		}
	);
}
function hideImage(){
	var image = document.getElementById("center_image");
	image.style.display = 'none';
}