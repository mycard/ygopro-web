class Card extends Spine.Model
  @fetch: (cards_id) ->
    mycard.fetch_cards cards_id, (cards)->
      Card.refresh(cards)

class Duel extends Spine.Controller
  events:
    "mouseover .game_card": "show"
  @avatar_url: 'http://my-card.in/users/:name.png'
  show: (event)->
    id = $(event.target).tmplItem().data.card_info.card_id
    $('.card_image').replaceWith $('#card_image_template').tmpl {id: id}
    $('#card').html $('#card_template').tmpl Card.find(id)
  set_player_name: (name)->
    @set_name('player', name)
  set_opponent_name: (name)->
    @set_name('opponent', name)
  set_player_lp: (lp)->
    @set_lp('player',lp)
  set_opponent_lp: (lp)->
    @set_lp('opponent',lp)
  set_phase: (phase)->
    phases = {DP: '抽卡阶段', SP: '准备阶段', M1: '主要阶段1', BP: '战斗阶段', M2: '主要阶段2', EP: '结束阶段'}
    humane.remove()
    humane.log phases[phase], timeout: 800;
    $(".phase[data-phase!=#{phase}]").removeClass 'active'
    $(".phase[data-phase=#{phase}]").addClass 'active'
  set_turn: (turn)->
    $('#turn').html turn
    if turn % 2 #player's turn
      $('.phase').addClass 'btn-info'
      $('.phase').removeClass 'btn-danger'
    else
      $('.phase').removeClass 'btn-info'
      $('.phase').addClass 'btn-danger'

  set_name: (player, name)->
    $("##{player}_name").html name
    $("##{player}_avatar").attr 'src', Duel.avatar_url.replace(':name', name)
  set_lp: (player, lp)->
    if typeof lp == "string"
      if lp[0...2] == '+='
        lp = parseInt($("##{player}_lp").html()) + parseInt(lp.slice(2))
      else if lp[0...2] == '-='
        lp = parseInt($("##{player}_lp").html()) - parseInt(lp.slice(2))
      else
        lp = parseInt lp
    $("##{player}_lp").html lp
    $("##{player}_lp_bar").animate 'width': "#{(if lp <= 0 then 0 else if lp >= 8000 then 1 else lp/8000)*100}%"

class Replay
  speed: $('#setting_action_inteval').val()
  duel_id: null
  action_id: 0
  comments: []
  constructor: (duel_id)->
    @duel_id = duel_id
    $('.new_comment')[0].duel_id.value = @duel_id
    $('.new_comment').ajaxForm
      url: "https://my-card.in/duels/#{@duel_id}/comments"
      type: "POST"
      beforeSubmit: (data, form, options)->
        form = form[0]
        form.body.disabled = true
        form.submit.disabled = true
      success: (data)=>
        form = $('.new_comment')[0]
        @show_comment({body: form.body.value, class: form.class.value+' comment_new', style: form.style.value})
        form.body.value = ''
        form.body.disabled = false
        form.submit.disabled = false

    mycard.load_duel_comments duel_id, 0, 0, (comments)=>
      @comments = comments
      @show_comment(comment) for comment in @comments when comment.action_id == @action_id
  get_action_inteval: ->
    Math.pow(10, 4 - $('#setting_action_inteval').val() * 0.2)
  set_action_id: (action_id)->
    @action_id = action_id
    $('.new_comment')[0].action_id.value = @action_id
    @show_comment(comment) for comment in @comments when comment.action_id == action_id
  show_comment: (comment)->
    el = $('#comment_template').tmpl(comment)

    #算法: 取尚未从右侧完全滚动出来的评论数量最小的行
    lines_waiting_count = {}
    $('.comment').each (index, e)->
      position = $(e).position()
      if position.left + $(e).width() > $('#comments').width()
        if lines_waiting_count[position.top]   # define line number instead of reading css attribute directly?
          lines_waiting_count[position.top]++
        else
          lines_waiting_count[position.top] = 1

    min_line = 0
    min_waiting_count = Number.MAX_VALUE

    for line in [0...$('#comments').height()] by 24 #line height here
      waiting_count = lines_waiting_count[line] || 0
      if waiting_count < min_waiting_count
        min_line = line
        min_waiting_count = waiting_count
      if min_waiting_count == 0
        break

    el.css('top', min_line)
    el.appendTo('#comments')
    el.transition {x: -$('#comments').width()-el.width()}, 8000, 'linear', ->  #comments scrolling speed here
      el.remove()
    console.log comment
@duel = new Duel(el: $('.stage'))
@replay = new Replay(parseInt($.url().param('rname')))  #临时用着现有url，以后会改成 http://my-card.in/duels/id 这样的
@Card = Card

$('.side_tabs').tabs()

$('#setting_action_inteval_slider').slider
  min: 1,
  max: 10,
  value: $( "#setting_action_inteval" ).val(),
  slide: (event, ui )->
    $( "#setting_action_inteval" ).val ui.value

$('#setting_enable_3d').change ->
  if @checked
    $('.field').transition scale: 2, translate: [116, 40], rotateX: 45
  else
    $('.field').transition scale: 2, translate: [116, 40], rotateX: 0

$.i18n.properties
  name:'card'
  path:'locales/'
  mode: 'both'

$(document).ready ->
  $('#setting_enable_3d').change()


#test
$('.zone').each (index, element)->
  $(element).data('card_list', [])