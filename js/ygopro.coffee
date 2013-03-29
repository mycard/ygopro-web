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
  get_action_inteval: ->
    Math.pow(10, 4 - $('#setting_action_inteval').val() * 0.2)

@duel = new Duel(el: $('.stage'))
@replay = new Replay()
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