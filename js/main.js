var battleField = new BattleField($("#battlefield"));

var url = $.url()
if(url.param('replay')){
    Replay.parse(url.param('replay'), battleField).then(function (replay) {
        window.replay = replay;
        replay.duel.start();
    });
}else if(url.param('watch')){
    Watch.connect(url.param('watch'), battleField);
}else{
    location.href = '?replay=' + encodeURIComponent('rep/1.yrp')
}