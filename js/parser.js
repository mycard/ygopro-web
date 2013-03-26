
var outputhtml;
var seeAllMsg = false;

(function($){
 
$.getUrlParam = function(name)
{
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r!=null) return unescape(r[2]); return null;
}
})(jQuery);
var tmp;

$(document).ready(function(){
	var dragImage  = document.getElementById('DragImage');
	dragImage.style.display = "none";
	
	
	initField();
	//httpget方式
	
	$.get('out/'+$.getUrlParam('rname'), function(result){
		tmp=result;
		readReplay(result);
	},"text");
	
	$("#source").attr("href", "replay/" + $.getUrlParam('rname')); 
	$("#parserfile").attr("href", "out/" + $.getUrlParam('rname')); 
	
	//本地测试
	/*
	$.get('yunmowu.yrp', function(result){
		tmp=result;
		readReplay(result);
		//ParserComBatLog();
	});
	*/
})

function ParserComBatLog(){
	var list_array= new Array();
	
    list_array = tmp.split('\n');

	$('#textout').html("");
	$('#textout').show(10);
	
	try{
		outputhtml="";
		for (var i=0;i<list_array.length;i++)
		{
			if (i>1){ 
			 if (list_array[i-1]==list_array[i])
			 	{
					continue;
				} 
			}
			
			//按消息行数解析
			if (list_array[i])
			{	
				outputhtml=outputhtml+"<div style='clear:both'>"
				Outprint(list_array[i]);
				outputhtml=outputhtml+"</div>"
			}
			
		}
		$('#textout').html(outputhtml);
	}catch(e){
		alert(e)
	}
}
function sethp(str){
	return "<div style='color:red; float:left'>{"+str+"}</div>";
}
function msgname(str){
	return "<div style='color:#ff6600; float:left'>"+str+"</div>";
}
function setname(str){
	var list_array= new Array();
	list_array = str.split('?');
	return "<div style='color:#006600; float:left'>"+list_array[1].split('$')[0]+"</div>";
}

function setcard(str){
	var list_array= new Array();
	list_array = str.split('?');  
	return "<div style='color:#03f; float:left'>["+list_array[0]+"]</div>";
}
function setpos(str){
	return "<div style='color:#06c; float:left'>"+str+"</div>";
}
function getBiaoshi(str)
{
	switch(parseInt(str)){
		case 1:
		 return "POS_FACEUP_ATTACK";
		 break;
		case 2:
		 return "POS_FACEDOWN_ATTACK";
		 break;
		case 4:
		 return "POS_FACEUP_DEFENCE";
		 break;
		case 8:
		 return "POS_FACEDOWN_DEFENCE";
		 break;
		case 3:
		 return "POS_FACEUP_ATTACK";
		 break;
		case 5:
		 return "POS_FACEUP_ATTACK";
		 break;
		case 10:
		 return "POS_FACEDOWN_ATTACK";
		 break;
		case 12:
		 return "POS_FACEUP_DEFENCE";
		 break;
		default:
			return "POS_FACEUP_ATTACK";
			}
	
	}
function getBiaoshiText(str)
{
	switch(parseInt(str)){
		case 1:
		 return "表侧攻击表示";
		 break;
		case 2:
		 return "里侧攻击表示";
		 break;
		case 3:
		 return "攻击表示";
		 break;
		case 4:
		 return "表侧守备表示";
		 break;
		case 5:
		 return "正面";
		 break;
		case 8:
		 return "里侧守备表示";
		 break;
		case 10:
		 return "覆盖";
		 break;
		case 12:
		 return "守备表示";
		 break;
		default:
			return "表示状态"+str;
			}
}
function getQuyuText(str)
{
		switch(parseInt(str)){
		case 1:
		 return "（卡组）";
		 break;
		case 2:
		 return "（手卡）";
		 break;
		case 4:
		 return "（怪兽区）";
		 break;
		case 8:
		 return "（魔陷区）";
		 break;
		case 16:
		 return "（墓地）";
		 break;
		case 32:
		 return "（除外区）";
		 break;
		case 64:
		 return "（额外卡组）";
		 break;
		default:
			return "区域："+str;
			}
}
function Outprint(s){
	//输出消息
	var list_array= new Array();
	list_array = s.split('|');  
	outputhtml="<div style='clear:both'></div>";
	try{
		switch(parseInt(list_array[1]))
		{	
			case 0://读取卡组
				//player1
				/*    太占地方，所以取消解析
				AppendOutputHtml("=================================卡组信息=================================",true);
				AppendOutputHtml(setname(list_array[2]));
				for (var i=3;i<list_array.length;i++)
				{
					if (list_array[i]=="ALLDECK")
					{
						AppendOutputHtml("卡组：",true);
						continue;
					}
					if (list_array[i]=="ALLEXTRA")
					{
						AppendOutputHtml("额外：",true);
						continue;
					}
					if(list_array[i]=="END")
					{
						tmppos=i;
						AppendOutputHtml("",true);
						break;
					}
					AppendOutputHtml(setcard(list_array[i]));
				}
				
				AppendOutputHtml(setname(list_array[i+1]),false);
				for (var i=i+2;i<list_array.length;i++)
				{
					if (list_array[i]=="ALLDECK")
					{
						AppendOutputHtml("卡组：",true);
						continue;
					}
					if (list_array[i]=="ALLEXTRA")
					{
						AppendOutputHtml("额外：",true);
						continue;
					}
					if(list_array[i]=="END")
					{
						tmppos=i;
						AppendOutputHtml("",true);
						break;
					}
					AppendOutputHtml(setcard(list_array[i]));
				}
				AppendOutputHtml("=================================战斗记录=================================");
				break;*/
				break;
			case 2:
				if (
					(list_array[5].indexOf("抽卡阶段中") >= 0)||
					(list_array[5].indexOf("伤害阶段") >= 0)||
					(list_array[5].indexOf("即将计算战斗伤害") >= 0)||
					(list_array[5].indexOf("即将产生战斗伤害") >= 0)||
					(list_array[5].indexOf("准备阶段中") >= 0)||
					(list_array[5].indexOf("战斗阶段开始") >= 0)
					)
				{
					break;
				}
				try
				{
					AppendOutputHtml("提示",false,"#f60");
					AppendOutputHtml(setname(list_array[3])+":\""+list_array[5]+"\"")
				}
				catch(e){}
				break;
			case 5:
				AppendOutputHtml(setname(list_array[3]));
				AppendOutputHtml("胜利");
				//AppendOutputHtml(list_array[5]);
				break;
			case 10:
				//MSG_SELECT_BATTLECMD
				break;
			case 11:
				//MSG_SELECT_IDLECMD
				break;
			case 12:
				if (!seeAllMsg) break;
				AppendOutputHtml(setname(list_array[3])+"选择效果",true,"#006699");
				break;
			case 15:
				/*AppendOutputHtml(setname(list_array[2])+"选择卡片",true,"#006699");
				break;*/
			case 16:
				//进入连锁
				break;
			case 18:
				/*if (!seeAllMsg) break;
				AppendOutputHtml(setname(list_array[2])+"选择放置地点",true,"#cec",12)*/;
				break;
			case 19:
				/*if (!seeAllMsg) break;
				AppendOutputHtml(setname(list_array[2])+"放置完成",true,"#cec",12);*/
				break;
			case 21:
				if (!seeAllMsg) break;
				AppendOutputHtml(setname(list_array[4]),true,"#cec",12);
				break;
			case 23:
				AppendOutputHtml(setname(list_array[2])+'选择了数字'+list_array[4],true,"#339900",12);
				break;
			case 31:
				break;
			case 32:
				AppendOutputHtml(setname(list_array[3])+"切洗卡组",true,"#03c");
				break;
			case 33:
				AppendOutputHtml(setname(list_array[3])+"切洗手卡",true,"#03c");
				break;
			case 40:
				AppendOutputHtml("回合："+list_array[3],true,"red",15);
				break;
			case 41:
				AppendOutputHtml("进入新阶段",false,"#999");
				AppendOutputHtml(list_array[3],false,"#c60");
				break;
			case 50:
				/*for (var i=0;i<list_array.length;i++)
				{
					if (list_array[i]=="REMOVECARD"){
						AppendOutputHtml("移除");
						AppendOutputHtml(setname(list_array[i+1]));
						AppendOutputHtml(setpos(list_array[i+2]));
						AppendOutputHtml(setcard(list_array[i+3]));
					}
					if (list_array[i]=="ADDCARD"){
						AppendOutputHtml("将");
						AppendOutputHtml(setcard(list_array[i+3]));
						AppendOutputHtml("放入");
						AppendOutputHtml(setname(list_array[i+1]));
						AppendOutputHtml(setpos(list_array[i+2]));
						
					}
				}*/
				break;
			case 53:
				break;
			case 54:
				AppendOutputHtml(setname(list_array[4]));
				AppendOutputHtml("在"+getQuyuText(list_array[6]));
				AppendOutputHtml(getBiaoshiText(list_array[10]));
				AppendOutputHtml("放置",false,"#300");
				AppendOutputHtml(setcard(list_array[3]));
				//AppendOutputHtml("次序"+list_array[7]);
				break;
			case 60:
				AppendOutputHtml("普通召唤",false,"#03c");
				AppendOutputHtml(setcard(list_array[10]));
				//AppendOutputHtml("位置"+getQuyuText(list_array[5]));
				//AppendOutputHtml("次序"+list_array[7]);
				AppendOutputHtml(getBiaoshiText(list_array[9]));
				break;		
			case 61:
				AppendOutputHtml("召唤成功",true,"#03c");
				break;	
			case 62:
				AppendOutputHtml("特殊召唤",false,"#03c");
				AppendOutputHtml(setcard(list_array[10]));
				//AppendOutputHtml("位置"+getQuyuText(list_array[5]));
				//AppendOutputHtml("次序"+list_array[7]);
				AppendOutputHtml(getBiaoshiText(list_array[9]));
				break;
				
			case 63:
				AppendOutputHtml("特殊召唤成功",true,"#03c");
				break;	
			case 64://反转召唤
				break;
			case 65://反转召唤
				AppendOutputHtml("反转召唤成功",true,"#03c");
				break;
			case 70:
				AppendOutputHtml(setname(list_array[3]));
				AppendOutputHtml("发动",false,"#006699");
				AppendOutputHtml(setcard(list_array[5]));
				break;
			case 71:
				if (!seeAllMsg) break;
				AppendOutputHtml(setcard(list_array[3])+"成功发动",true,"#006699");
				break;
			case 72:
				if (!seeAllMsg) break;
				AppendOutputHtml("连锁倒推中",true,"#cecece");
				break;
			case 73:
				if (!seeAllMsg) break;
				AppendOutputHtml("连锁倒推完成",true,"#cecece");
				break;
			case 74:
				if (!seeAllMsg) break;
				AppendOutputHtml("连锁完成",true,"#006699");
				break;
			case 83:
				//MSG|83|邪之混沌|位置|4|次序|1|ss?|8|光道猎犬 雷光|成为选择对象|怪兽区
				AppendOutputHtml("选择了",false,"#006699");
				AppendOutputHtml(setname(list_array[2]),false,"#006699");
				AppendOutputHtml(getQuyuText(list_array[4]),false,"#006699");
				AppendOutputHtml("的",false,"#006699");
				AppendOutputHtml(setcard(list_array[9]),false,"#006699");
				break;
			case 90:
				AppendOutputHtml(setname(list_array[2]));
				AppendOutputHtml("抽卡");
				for (var i=0;i<list_array.length;i++)
				{
					if (list_array[i]=="ADDCARD"){
						AppendOutputHtml(setcard(list_array[i+7]));
					}
				}
				break;
			case 91:
				AppendOutputHtml(list_array[3],false,"#ff6600");
				AppendOutputHtml(list_array[4],false,"#ff6600");
				AppendOutputHtml(setname(list_array[5]));
				AppendOutputHtml("的生命值变化为",false,"#ff6600");
				AppendOutputHtml(sethp(list_array[6]));
				break;
			case 92:
				AppendOutputHtml(setname(list_array[2]),false,"#ff6600");
				AppendOutputHtml('积分恢复');
				AppendOutputHtml(list_array[3],false,"#ff6600");
				break;
			case 96:
				//选择目标
				break;
			case 100:
				AppendOutputHtml(setname(list_array[3]));
				AppendOutputHtml("支付",false,"#ff6600");
				AppendOutputHtml(list_array[5],false,"red");
				AppendOutputHtml("生命值变为：",false,"#ff6600");
				AppendOutputHtml(sethp(list_array[7]));
				break;
			case 101:
				AppendOutputHtml(setcard(list_array[3]));
				AppendOutputHtml("增加",false,"blue");
				AppendOutputHtml(list_array[4],false,"red");
				AppendOutputHtml(list_array[5]);
				break;
			case 102:
				AppendOutputHtml(list_array[2],false,"#666",12);
				
				break;
			case 110:

				AppendOutputHtml(setname(list_array[4]));
				//AppendOutputHtml(getQuyuText(list_array[6]));
				AppendOutputHtml(setcard(list_array[16]));
				
				if (list_array[15]=="[%ls]攻击[%ls]"){
					AppendOutputHtml("攻击",false,"red",12);
					AppendOutputHtml(setname(list_array[10]));
				//	AppendOutputHtml(getQuyuText(list_array[12]));
					AppendOutputHtml(setcard(list_array[17]));
				}else
				{
					AppendOutputHtml("直接攻击玩家",false,"red",12);
					AppendOutputHtml(setname(list_array[10]));
				}
				break;
			case 111:
				if (!seeAllMsg) break;
				AppendOutputHtml("进入战斗阶段",false,"red",12);
				break;	
			case 113:
				AppendOutputHtml("进入伤害阶段",false,"red",12);
				break;	
			case 114:
				AppendOutputHtml("伤害阶段结束",false,"red",12);
				break;	
			default:
				AppendOutputHtml(s);
		}
		
	}catch(e){
		AppendOutputHtml("解析错误");
	}
	
}

function AppendOutputHtml(str,br,color ,size)
{
	
	tmpstr="<div style='";
	if (color)
		tmpstr=tmpstr+"color:"+color+"; ";
	else
		tmpstr=tmpstr+"color:#222; "; 
	if (size)	
		tmpstr=tmpstr+"font-size:"+size+"px; ";
	if (br)
		{tmpstr=tmpstr+"clear:both; '" ;}
	else
		{tmpstr=tmpstr+"float:left; '" ;}
		
	tmpstr=tmpstr+">"+str+"</div>";
	
	
	if (outputhtml)
		outputhtml=outputhtml+tmpstr;
	else
		outputhtml=tmpstr;
	//$('#test').html($('#test').html()+str);
}