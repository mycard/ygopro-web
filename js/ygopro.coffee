$('.side_tabs').tabs()
$('#setting_enable_3d').change ->
  if @checked
    $('.field').transition scale: 2, translate: [116, 40], rotateX: 45
  else
    $('.field').transition scale: 2, translate: [116, 40], rotateX: 0
#class Duel extends Spine.Model
#  @configure 'Duel', 'player_name', 'opponent_name', 'player_lp', 'opponent_lp', 'turn', 'phase'

class Duel extends Spine.Controller
  @avatar_url: 'http://my-card.in/users/:name.png'
  set_player_name: (name)->
    @set_name('player', name)
  set_opponent_name: (name)->
    @set_name('opponent', name)
  set_player_lp: (lp)->
    @set_lp('player',lp)
  set_opponent_lp: (lp)->
    @set_lp('opponent',lp)
  set_phase: (phase)->
    $(".phase[data-phase!=#{phase}]").removeClass 'active'
    $(".phase[data-phase=#{phase}]").addClass 'active'
  set_turn: (turn)->
    $('#turn').html turn

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


@duel = new Duel()

$(document).ready ->
  $('#setting_enable_3d').change()