#常量，应该不需要修改就minify了，要改的话复制出来格式化一下。
constants = {"NETWORK":{"29736":"SERVER_ID","57078":"CLIENT_ID"},"NETPLAYER":{"0":"TYPE_PLAYER1","1":"TYPE_PLAYER2","2":"TYPE_PLAYER3","3":"TYPE_PLAYER4","4":"TYPE_PLAYER5","5":"TYPE_PLAYER6","7":"TYPE_OBSERVER"},"CTOS":{"1":"RESPONSE","2":"UPDATE_DECK","3":"HAND_RESULT","4":"TP_RESULT","16":"PLAYER_INFO","17":"CREATE_GAME","18":"JOIN_GAME","19":"LEAVE_GAME","20":"SURRENDER","21":"TIME_CONFIRM","22":"CHAT","32":"HS_TODUELIST","33":"HS_TOOBSERVER","34":"HS_READY","35":"HS_NOTREADY","36":"HS_KICK","37":"HS_START"},"STOC":{"1":"GAME_MSG","2":"ERROR_MSG","3":"SELECT_HAND","4":"SELECT_TP","5":"HAND_RESULT","6":"TP_RESULT","7":"CHANGE_SIDE","8":"WAITING_SIDE","17":"CREATE_GAME","18":"JOIN_GAME","19":"TYPE_CHANGE","20":"LEAVE_GAME","21":"DUEL_START","22":"DUEL_END","23":"REPLAY","24":"TIME_LIMIT","25":"CHAT","32":"HS_PLAYER_ENTER","33":"HS_PLAYER_CHANGE","34":"HS_WATCH_CHANGE"},"PLAYERCHANGE":{"8":"OBSERVE","9":"READY","10":"NOTREADY","11":"LEAVE"},"ERRMSG":{"1":"JOINERROR","2":"DECKERROR","3":"SIDEERROR","4":"VERERROR"},"MODE":{"0":"SINGLE","1":"MATCH","2":"TAG"},"MSG":{"1":"RETRY","2":"HINT","3":"WAITING","4":"START","5":"WIN","6":"UPDATE_DATA","7":"UPDATE_CARD","8":"REQUEST_DECK","10":"SELECT_BATTLECMD","11":"SELECT_IDLECMD","12":"SELECT_EFFECTYN","13":"SELECT_YESNO","14":"SELECT_OPTION","15":"SELECT_CARD","16":"SELECT_CHAIN","18":"SELECT_PLACE","19":"SELECT_POSITION","20":"SELECT_TRIBUTE","21":"SORT_CHAIN","22":"SELECT_COUNTER","23":"SELECT_SUM","24":"SELECT_DISFIELD","25":"SORT_CARD","30":"CONFIRM_DECKTOP","31":"CONFIRM_CARDS","32":"SHUFFLE_DECK","33":"SHUFFLE_HAND","34":"REFRESH_DECK","35":"SWAP_GRAVE_DECK","36":"SHUFFLE_SET_CARD","37":"REVERSE_DECK","38":"DECK_TOP","40":"NEW_TURN","41":"NEW_PHASE","50":"MOVE","53":"POS_CHANGE","54":"SET","55":"SWAP","56":"FIELD_DISABLED","60":"SUMMONING","61":"SUMMONED","62":"SPSUMMONING","63":"SPSUMMONED","64":"FLIPSUMMONING","65":"FLIPSUMMONED","70":"CHAINING","71":"CHAINED","72":"CHAIN_SOLVING","73":"CHAIN_SOLVED","74":"CHAIN_END","75":"CHAIN_NEGATED","76":"CHAIN_DISABLED","80":"CARD_SELECTED","81":"RANDOM_SELECTED","83":"BECOME_TARGET","90":"DRAW","91":"DAMAGE","92":"RECOVER","93":"EQUIP","94":"LPUPDATE","95":"UNEQUIP","96":"CARD_TARGET","97":"CANCEL_TARGET","100":"PAY_LPCOST","101":"ADD_COUNTER","102":"REMOVE_COUNTER","110":"ATTACK","111":"BATTLE","112":"ATTACK_DISABLED","113":"DAMAGE_STEP_START","114":"DAMAGE_STEP_END","120":"MISSED_EFFECT","121":"BE_CHAIN_TARGET","122":"CREATE_RELATION","123":"RELEASE_RELATION","130":"TOSS_COIN","131":"TOSS_DICE","140":"ANNOUNCE_RACE","141":"ANNOUNCE_ATTRIB","142":"ANNOUNCE_CARD","143":"ANNOUNCE_NUMBER","160":"CARD_HINT","161":"TAG_SWAP","162":"RELOAD_FIELD","163":"AI_NAME","164":"SHOW_HINT","170":"MATCH_KILL","180":"CUSTOM_MSG"},"TIMING":{"1":"DRAW_PHASE","2":"STANDBY_PHASE","4":"MAIN_END","8":"BATTLE_START","16":"BATTLE_END","32":"END_PHASE","64":"SUMMON","128":"SPSUMMON","256":"FLIPSUMMON","512":"MSET","1024":"SSET","2048":"POS_CHANGE","4096":"ATTACK","8192":"DAMAGE_STEP","16384":"DAMAGE_CAL","32768":"CHAIN_END","65536":"DRAW","131072":"DAMAGE","262144":"RECOVER","524288":"DESTROY","1048576":"REMOVE","2097152":"TOHAND","4194304":"TODECK","8388608":"TOGRAVE","16777216":"BATTLE_PHASE","33554432":"EQUIP"}}

#结构体定义
structs = {
  "HostInfo":[{"name":"lflist","type":"unsigned int"},{"name":"rule","type":"unsigned char"},{"name":"mode","type":"unsigned char"},{"name":"enable_priority","type":"bool"},{"name":"no_check_deck","type":"bool"},{"name":"no_shuffle_deck","type":"bool"},{"name":"start_lp","type":"unsigned int"},{"name":"start_hand","type":"unsigned char"},{"name":"draw_count","type":"unsigned char"},{"name":"time_limit","type":"unsigned short"}],
  "HostPacket":[{"name":"identifier","type":"unsigned short"},{"name":"version","type":"unsigned short"},{"name":"port","type":"unsigned short"},{"name":"ipaddr","type":"unsigned int"},{"name":"name","type":"unsigned short","length":20,"encoding":"UTF-16LE"},{"name":"host","type":"HostInfo"}],
  "HostRequest":[{"name":"identifier","type":"unsigned short"}],
  "CTOS_HandResult":[{"name":"res","type":"unsigned char"}],
  "CTOS_TPResult":[{"name":"res","type":"unsigned char"}],
  "CTOS_PlayerInfo":[{"name":"name","type":"unsigned short","length":20,"encoding":"UTF-16LE"}],
  "CTOS_CreateGame":[{"name":"info","type":"HostInfo"},{"name":"name","type":"unsigned short","length":20,"encoding":"UTF-16LE"},{"name":"pass","type":"unsigned short","length":20,"encoding":"UTF-16LE"}],
  "CTOS_JoinGame":[{"name":"version","type":"unsigned short"},{"name":"gameid","type":"unsigned int"},{"name":"some_unknown_mysterious_fucking_thing","type":"unsigned short"},{"name":"pass","type":"unsigned short","length":20,"encoding":"UTF-16LE"}],
  "CTOS_Kick":[{"name":"pos","type":"unsigned char"}],
  "STOC_ErrorMsg":[{"name":"msg","type":"unsigned char"},{"name":"code","type":"unsigned int"}],
  "STOC_HandResult":[{"name":"res1","type":"unsigned char"},{"name":"res2","type":"unsigned char"}],
  "STOC_CreateGame":[{"name":"gameid","type":"unsigned int"}],
  "STOC_JoinGame":[{"name":"info","type":"HostInfo"}],
  "STOC_TypeChange":[{"name":"type","type":"unsigned char"}],
  "STOC_ExitGame":[{"name":"pos","type":"unsigned char"}],
  "STOC_TimeLimit":[{"name":"player","type":"unsigned char"},{"name":"left_time","type":"unsigned short"}],
  "STOC_Chat":[{"name":"player","type":"unsigned short"},{"name":"msg","type":"unsigned short","length":255,"encoding":"UTF-16LE"}],
  "STOC_HS_PlayerEnter":[{"name":"name","type":"unsigned short","length":20,"encoding":"UTF-16LE"},{"name":"pos","type":"unsigned char"}],
  "STOC_HS_PlayerChange":[{"name":"status","type":"unsigned char"}],
  "STOC_HS_WatchChange":[{"name":"watch_count","type":"unsigned short"}],"deck":[{"name":"mainc","type":"unsigned int"},{"name":"sidec","type":"unsigned int"},{"name":"deckbuf","type":"unsigned int","length":75}],"chat":[{"name":"msg","type":"unsigned short","length":"255","encoding":"UTF-16LE"}],
  "MSG_START": [
    {name:'playertype', type: 'char'},
    {name:'player_lp', type: 'int'},
    {name:'opponent_lp', type: 'int'},
    {name:'player_deckc', type: 'short'},
    {name:'player_extrac', type: 'short'},
    {name:'opponent_deckc', type: 'short'},
    {name:'opponent_extrac', type: 'short'}
  ],
  "MSG_DRAW": [
    {name:'player', type: 'char'},
    {name:'count', type: 'char'},
    {name: 'pcard', type: 'unsigned int', length: 'count'}
  ]
}

lengths = {"char": 1,"unsigned char":1,"bool":2,"short":2,"unsigned short":2,"int":4,"unsigned int":4}

#网络包-数据类型, 是不是干脆统一个命名规则直接搞过来比较方便..orz 不知道会不会有多对一情况
proto_structs =
  CTOS:
    null #暂时不需要发送数据
  STOC:
    JOIN_GAME:"STOC_JoinGame"
    HS_WATCH_CHANGE:"STOC_HS_WatchChange"
    TYPE_CHANGE:"STOC_TypeChange"
    HS_PLAYER_CHANGE:"STOC_HS_PlayerChange"
    HS_PLAYER_ENTER:"STOC_HS_PlayerEnter"
    ERROR_MSG: "STOC_ErrorMsg"
    CHAT: "STOC_Chat"
    HAND_RESULT: "STOC_HandResult"


#常量逆向关联
for key, value of constants
  for k, v of value
    value[v] = parseInt(k)
for key, value of proto_structs.STOC
  proto_structs.STOC[constants.STOC[key]] = value

#读结构体的函数
read_srtuct = (dataview, type, offset=0)->
  if struct = structs[type]
    result = {}
    for field in struct
      length = lengths[field.type]
      if field.length? #array
        if typeof field.length is 'number' #直接数字指定的长度
          len = field.length
        else if result[field.length]? #通过另一个字段指定的长度
          len = result[field.length]
        else
          throw 'WTF?'
        result[field.name] = (read_srtuct(dataview, field.type, offset + i * length) for i in [0...len])
        offset += len * length
        if field.encoding?
          switch field.encoding
            when 'UTF-16LE'
              strlen = result[field.name].indexOf(0)
              result[field.name].splice(strlen) if strlen != -1
              result[field.name] = String.fromCharCode.apply this, result[field.name]
            else
              throw 'unsupported encoding'
      else
        result[field.name] = read_srtuct(dataview, field.type, offset)
        offset += length
    result
  else
    switch type
      when 'char'
        dataview.getInt8(offset)
      when 'unsigned char'
        dataview.getUint8(offset)
      when 'bool'
        dataview.getUint16(offset, true) != 0
      when 'short'
        dataview.getInt16(offset, true)
      when 'unsigned short'
        dataview.getUint16(offset, true)
      when 'int'
        dataview.getInt32(offset, true)
      when 'unsigned int'
        dataview.getUint32(offset, true)
      else
        throw "unsupported type #{type}"



#--------------------------本体开始-----------------------

players = [] #players是加入了这个房间的玩家，包括(在开局前加入的)观战者，序号按座位号，仅做录像replay应该不需要用这个变量
duelplayers = [] #duelplayers只包含来决斗的玩家，不包含观战者，序号按决斗顺序

hostinfo = null #主机规则信息

# DuelClient::HandleSTOCPacketLan
handle = (proto, dataview, data)->
  #console.log data if data
  switch proto
    when constants.STOC.JOIN_GAME
      hostinfo = data.info
    when constants.STOC.HS_PLAYER_ENTER
      players[data.pos] = {name: data.name}
    when constants.STOC.HS_PLAYER_CHANGE, constants.TYPE_CHANGE
      null #准备状态变更，做观战貌似不用理
    when constants.STOC.DUEL_START
      console.log '====DUEL_START====', hostinfo, players
    when constants.STOC.GAME_MSG
      curMsg = dataview.getUint8(0)
      dataview = new DataView(dataview.buffer, dataview.byteOffset + 1) if dataview.byteLength - dataview.byteOffset > 1  #dataview.byteOffset += 1
      type = 'MSG_'+ constants.MSG[curMsg]
      #console.log 'MSG', constants.MSG[curMsg]
      if type of structs
        analyze(curMsg, dataview, read_srtuct(dataview, type))
      else
        analyze(curMsg, dataview)

# DuelClient::ClientAnalyze
analyze = (curMsg, dataview, data)->
  #console.log data if data
  switch curMsg
    when constants.MSG.START
      console.log 'nyaa'
    when constants.MSG.DRAW
      null

class @Watch
  @connect: (url)->
    websocket = new WebSocket "ws://122.0.65.69:7922/started"  #服务器，/后面为房间名(主机密码)，特别的，"started" 会连接任意一个已经开始了的房间，测试用。
    websocket.binaryType = "arraybuffer"
    websocket.onopen = (evt)->
      console.log "open"

    websocket.onclose = (evt)->
      console.log "close"

    websocket.onmessage = (evt)->
      dataview = new DataView(evt.data,0)
      proto = dataview.getUint8(0)
      dataview = new DataView(dataview.buffer, dataview.byteOffset + 1) if dataview.byteLength - dataview.byteOffset > 1 #dataview.byteOffset += 1

      console.log 'message', constants.STOC[proto]

      if type = proto_structs.STOC[proto]
        #已知的数据类型
        handle(proto, dataview, read_srtuct(dataview, type))
      else
        #未知的数据类型
        handle(proto, dataview)


    websocket.onerror = (evt)->
      console.log 'error', evt.data
