
var messages = new Array();;
var message_id = 0;
var exetimeout = 1000;

function readReplay(tmp){
	
	messages=tmp.split('\n');
	readMessage();

	
}

function getID(str){
	return parseInt(str.split('?')[1]);
}
function getName(str){
	return str.split('?')[1].split('$')[0];
}

function getPlayer(str){
	var playerpos = str.split('?')[0];
	if(playerpos == "Playerpos0")
		player = 0;
	else if(playerpos == "Playerpos1")
		player = 1;
	else if(playerpos == "Playerpos2")
		player = 2;
	else if(playerpos == "Playerpos3")
		player = 3;
	return player;
}
function getLocation(str){
	switch(parseInt(str)){
		case 1:
		 return "location_deck";
		 break;
		case 2:
		 return "location_hand";
		 break;
		case 4:
		 return "location_mzone";
		 break;
		case 8:
		 return "location_szone";
		 break;
		case 16:
		 return "location_grave";
		 break;
		case 32:
		 return "location_removed";
		 break;
		case 64:
		 return "location_extra";
		 break;
	}
}
var palyer_name_0;
var palyer_name_1;
var palyer_name_2;
var palyer_name_3;
	var is_main = false;
	var is_extra = false;
	var deck_main_0 = [];
	var deck_extra_0 = [];
	var deck_main_1 = [];
	var deck_extra_1 = [];
	var cards_id = [];
	var paused=false;
function stepPlay(){
	paused=false;
	readMessage();
	paused=true;
	}
function pause(){
	paused=true;
	}
function playctrl(ctl){
	if (ctl=="up")
	{
		if (exetimeout>1000)
		{
			exetimeout=1000;
		}
		exetimeout=exetimeout-100;
	}
	if (ctl=="down")
	{
		if (exetimeout<1000)
		{
			exetimeout=1000;
		}
		exetimeout=exetimeout+500;
	}
}
function play(ctl){
	
	paused=false;
	readMessage();

	}

function readMessage(){
	if (paused)
	{
		return;
	}
	
	if(message_id >= messages.length)
		return ;
		
	if (message_id>1){//过滤连续相同的消息
	if (messages[message_id]==messages[message_id-1])
	{
		message_id++;
		readMessage();
		return;
	}}
	
	var message = messages[message_id];
	 
	var list_array= new Array();
	list_array = message.split('|');
	message_id++;


	//输出文字解析
	try{
		Outprint(message);
		$('#textout').html($('#textout').html()+outputhtml);
		document.getElementById("textout").scrollTop=100000;
		outputhtml="";
	}catch(e){
		alert(e)
	}
	

	//输出图形解析

	
	try
	{
	switch(parseInt(list_array[1])){
		case 0: //deck
			palyer_name_0 = getName(list_array[2]);
			$('#Player'+getPlayer(list_array[2])+'name').html(getName(list_array[2]));
			for (var i=3;i<list_array.length;i++){
				if (list_array[i]=="ALLDECK"){
					is_main = true;
					is_extra = false;
					continue;
				}
				if (list_array[i]=="ALLEXTRA"){
					is_extra = true;
					is_main = false;
					continue;
				}
				if(list_array[i]=="END"){
					break;
				}
				var id = getID(list_array[i]);
				
				cards_id.push(id);
				if(is_main){
					addNewCard(id, 0, "location_deck", 0);
				}
				else if(is_extra){
					addNewCard(id, 0, "location_extra", 0);
				}
			}
			
			player_name_1 = getName(list_array[i+1]);
			$('#Player'+getPlayer(list_array[i+1])+'name').html(getName(list_array[i+1]));
			for (var i=i+2;i<list_array.length;i++){
				if (list_array[i]=="ALLDECK"){
					is_main = true;
					is_extra = false;
					continue;
				}
				if (list_array[i]=="ALLEXTRA"){
					is_extra = true;
					is_main = false;
					continue;
				}
				if(list_array[i]=="END"){
					break;
				}
				var id = getID(list_array[i]);
				cards_id.push(id);
				if(is_main){
					addNewCard(id, 1, "location_deck", 0);
				}
				else if(is_extra){
					addNewCard(id, 1, "location_extra", 0);
				}
			}
			
			loadCards(cards_id);
			break;
		case 41:
			//MSG|41|新阶段|抽卡阶段
			$('#pdiv').html(list_array[3]);
			break;
		case 50://move
			for (var i=0;i<list_array.length;i++){
				if (list_array[i]=="REMOVECARD"){
					var player = getPlayer(list_array[i+1]);
					var id = getID(list_array[i+7]);
					var loc = getLocation(list_array[i+3]);
					//只有中间两个区域有编号
					if ((loc != "location_mzone")&&(loc!="location_szone"))
						var sequence = 0;
					else
						var sequence = list_array[i+5];
					if(loc == "location_szone" && sequence==5){
						loc = "location_field";
						sequence = 0;
					}						
					field_id = player + "_" + loc + "_" + sequence;
					var field = document.getElementById(field_id);
					removeCard(field, id);
				}
				
				if (list_array[i]=="ADDCARD"){
					
					var player = getPlayer(list_array[i+1]);
					var id = getID(list_array[i+7]);
					var loc = getLocation(list_array[i+3]);
					var sequence = list_array[i+5];
					if ((loc != "location_mzone")&&(loc!="location_szone"))
						var sequence = 0;
					else
						var sequence = list_array[i+5];
					if(loc == "location_szone" && sequence==5){
						loc = "location_field";
						sequence = 0;
					}
					field_id = player + "_" + loc + "_" + sequence;
					field = document.getElementById(field_id);
					addCard(field, newCard_Info(id));
					//setcardstatus(field,id);
				}
			}
			
			break;
		case 54://放置卡片
			//MSG|54|放置卡片|活死人的呼声?97077563|Playerpos1?邪之混沌|位置|8|次序|2|表示|10
			var player = getPlayer(list_array[4]);
			var id = getID(list_array[3]);
			var loc = getLocation(list_array[6]);
			var sequence = list_array[8];
			if(loc == "location_szone" && sequence==5){
				loc = "location_field";
				sequence = 0;
			}
			field_id = player + "_" + loc + "_" + sequence;
			field = document.getElementById(field_id);
			setcardstatus(field,id,getBiaoshi(list_array[10]));
			break;
		case 60:
		//MSG|60|发动召唤|Playerpos0?anyouxi|位置|4|次序|2|表示|1|云魔物-乱气流?16197610
			var id = getID(list_array[10]);
			//summon(id);
			break;
		case 62://特殊召唤
			//MSG|62|特殊召唤阶段开始|Playerpos0?anyouxi|位置|4|次序|1|表示|4|云魔物-小烟球?8082555
			
			var player = getPlayer(list_array[3]);
			var id = getID(list_array[10]);
			var loc = getLocation(list_array[5]);
			var sequence = list_array[7];
			field_id = player + "_" + loc + "_" + sequence;
			field = document.getElementById(field_id);
			setcardstatus(field,id,getBiaoshi(list_array[9]));
			//spsummon(id);
			break;

		case 64://反转召唤
			var player = getPlayer(list_array[3]);
			var id = getID(list_array[11]);
			var loc = getLocation(list_array[5]);
			var sequence = list_array[7];
			field_id = player + "_" + loc + "_" + sequence;
			field = document.getElementById(field_id);
			setcardstatus(field,id,getBiaoshi(list_array[9]));
			break;

		case 90://draw
			var player = getPlayer(list_array[2]);
			for (var i=0;i<list_array.length;i++)
			{
				if (list_array[i]=="ADDCARD"){
					var id = getID(list_array[i+7]);
					field_id = player + "_location_deck_0";
					var field = document.getElementById(field_id);
					removeCard(field, id);
					
					field_id = player + "_location_hand_0";
					field = document.getElementById(field_id);
					addCard(field, newCard_Info(id));
				}
			}
			
			break;
		case 91://伤害
			$('#Player'+getPlayer(list_array[5])+'lp').html(list_array[6]);
			break;
		case 92:
			$('#Player'+getPlayer(list_array[2])+'lp').html(parseInt($('#Player'+getPlayer(list_array[2])+'lp').html())+parseInt(list_array[3]));
			break;
		case 100://cost
			$('#Player'+getPlayer(list_array[3])+'lp').html(list_array[7]);
			break;
		default:
			readMessage();
			return;
		}
	}catch(e){
		alert(e);
		alert(message);
	}
	setTimeout("readMessage()",exetimeout);
}



function loadCards(cards_id){
	var url = locale_url + '?q=' + JSON.stringify({_id: {$in: cards_id}});
    $.getJSON(url,function(result){
		$.getJSON(cards_url + "?q=" + (JSON.stringify({_id: {$in: cards_id}})), function(_cards) {
			for(var i in _cards){
				var card = _cards[i];
				var name = '';
				var desc = '';
				for(var j in result){
					if(result[j]._id == card._id){
						name = result[j].name;
						desc = result[j].desc;
						break;
					}
				}
				var star = "";
				for(var i=0; i<card.level; i++){
					star += "★";
				}
				var data = {
					"_id": card._id,
					"name": name,
					"type": getType(card),
					"atk": card.atk,
					"def": card.def,
					"level": card.level,
					"star": star,
					"race": getRace(card),
					"attribute": getAttribute(card),
					"desc": desc
				};
				datas[card._id]=data;
			}
		});
	});
}
function newCard_Info(card_id){
	var card_info = new Object();
	card_info.card_id = card_id;
	card_info.position = "POS_FACEUP_ATTACK";
	return card_info;
}
function addNewCard(card_id, player, loc, sequence){
	var card_info = new Object();
	card_info.card_id = card_id;
	card_info.player = player;
	card_info.loc = loc;
	card_info.sequence = sequence;
	card_info.position = "POS_FACEDOWN_ATTACK";
	var field_id = player + "_" + loc + "_" + sequence;
	var field = document.getElementById(field_id);
	var card_list = $.data(field, 'card_list');
	card_list.push(card_info);
	$.data(field, 'card_list', card_list);
	updateField(field);
}