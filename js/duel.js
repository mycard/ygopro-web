/// <reference path="jquery-2.0.3.min.js" />
/// <reference path="battlefield.js" />

(function (scope) {
    "use strict";
    var $ = scope.$;

    window.Debug

    function Card(id) {

    }

    var playerOptions = {
        /// <field name="battleField" type="BattleField" />
        "battleField": null,
        "playerId": 0,
        "startLP": 8000,
        "startHand": 5,
        "drawCount": 1,
        "name": "",
        "avatar": "",
        "tag": null,
        "deck": [],
        "deckTag": [],
        "extra": [],
        "extraTag": []
    };
    function Player(options) {
        options = $.extend(playerOptions, options);

        this.id = options.playerId;
        this.name = options.name;
        this.tag = options.tag;
        this.avatar = options.avatar;

        this.startLP = options.startLP;

        var deck = options.deck;
        this.deckTag = options.deckTag;
        var extra = options.extra;
        this.extraTag = options.extraTag;

        var hasBattleField = false;
        if (options.battleField) {
            hasBattleField = true;
            var battleField = options.battleField;

            var info = battleField.playerInfos[this.id];
            info.name = this.name;
            info.avatar = this.avatar;
            info.maxLP = this.startLP;
            this.info = info;

            this.blocks = battleField.blocks[this.id];
            this.blocks[BattleField.LOCATION_DECK].addCards(deck);
            this.blocks[BattleField.LOCATION_EXTRA].addCards(extra);

            var handBlock = this.blocks[BattleField.LOCATION_HAND];

            var lp = 0;
            Object.defineProperty(this, "lp", {
                get: function () { return lp; },
                set: function (value) {
                    if (lp != value) {
                        lp = value;
                        info.lp = value;
                    }
                }
            });
        } else {
            var lp = 0;
            Object.defineProperty(this, "lp", {
                get: function () { return lp; },
                set: function (value) {
                    if (lp != value)
                        lp = value;
                }
            });
        }
        this.lp = this.startLP;

        this.startHand = options.startHand;
        this.drawCount = options.drawCount;

        var handCards = [];
        if (hasBattleField) {
            this.addHandCard = function (id) {
                handCards.push(id);
                handBlock.addCard(id);
            };
            this.removeHandCard = function (id) {
                var index = handCards.indexOf(id);
                if (index != -1) {
                    handCards.splice(index, 1);
                    handBlock.removeCardAt(index);
                }
            };
        } else {
            this.addHandCard = function (id) {
                handCards.push(id);
            };
            this.removeHandCard = function (id) {
                var index = handCards.indexOf(id);
                if (index != -1)
                    handCards.splice(index, 1);
            };
        }
        Object.defineProperty(this, "handCards", {
            get: function () { return new Array(handCards); }
        });
        this.getHandCards = function () {
            return this.handCards;
        };
        this.getHandCardAt = function (index) {
            if (index >= handCards.length)
                throw RangeError("Invalid card index.");
            return handCards[index];
        };

        if (hasBattleField) {
            this.addDeckCard = function (id) {
                deck.push(id);
                this.blocks[BattleField.LOCATION_DECK].addCard(id);
            };
            this.shiftDeck = function () {
                deck.shift();
                return this.blocks[BattleField.LOCATION_DECK].shiftCard();
            };
        } else {
            this.addDeckCard = function (id) {
                deck.push(id);
            };
            this.shiftDeck = function () {
                return deck.shift();
            };
        }

        function isAffectedBy(code) {
            return false;
        };
        Object.defineProperty(this, "canDraw", {
            get: function () { return !isAffectedBy(Duel.EFFECT_CANNOT_DRAW); }
        });
        Object.defineProperty(this, "isOverDraw", {
            get: function () { return deck.length == 0; }
        });

        Object.freeze(this);
    }
    scope.Player = Player;

    var duelOptions = {
        /// <field name="battleField" type="BattleField" />
        "battleField": null,
        "startLP": 8000,
        "startHand": 5,
        "drawCount": 1,
        "host": {},
        "client": {},
        "isTag": false
    }
    function Duel(options) {
        options = $.extend(duelOptions, options);
        options.host = $.extend({}, playerOptions, options.host);
        options.client = $.extend({}, playerOptions, options.client);

        this.cards = [].concat(options.host.deck, options.host.extra,
            options.client.deck, options.client.extra);

        this.startLP = options.startLP;
        this.startHand = options.startHand;
        this.drawCount = options.drawCount;

        var hasBattleField = false;
        if (options.battleField) {
            hasBattleField = true;
            var battleField = options.battleField;
            this.battleField = battleField;
        }

        var host = new Player($.extend(options.host,
            {
                "battleField": options.battleField,
                "playerId": 0,
                "startLP": this.startLP,
                "startHand": this.startHand,
                "drawCount": this.drawCount
            }));
        var client = new Player($.extend(options.client,
            {
                "battleField": options.battleField,
                "playerId": 1,
                "startLP": this.startLP,
                "startHand": this.startHand,
                "drawCount": this.drawCount
            }));
        this.host = host;
        this.client = client;

        this.isTag = options.isTag;

        var turn = 0;
        if (hasBattleField)
            Object.defineProperty(this, "turn", {
                get: function () { return turn; },
                set: function (value) {
                    if (turn != value) {
                        turn = value;
                        battleField.turn = value;
                    }
                }
            });
        else
            Object.defineProperty(this, "turn", {
                get: function () { return turn; },
                set: function (value) {
                    if (turn != value)
                        turn = value;
                }
            });

        this.start = function () {
            if (this.startHand > 0) {
                this.draw(null, Duel.REASON_RULE, Duel.PLAYER_NONE, Duel.PLAYER_HOST, this.startHand);
                this.draw(null, Duel.REASON_RULE, Duel.PLAYER_NONE, Duel.PLAYER_CLIENT, this.startHand);
            }
            this.turn++;
            this.processTurn(0, 0);
        };

        function getPlayer(id) {
            return id ? host : client;
        }

        this.draw = function (reasonEffect, reason, reasonPlayer, player, count) {
            player = getPlayer(player);
            if (!(reason & Duel.REASON_RULE) && !player.canDraw)
                return;
            var i = count - 1;
            (function drawAnimation() {
                setTimeout(function () {
                    if (player.isOverDraw)
                        return;
                    player.addHandCard(player.shiftDeck());
                    if (i--)
                        drawAnimation();
                }, 500);
            })();
            /*
            for (var i = count; i--;) {
                if (player.isOverDraw)
                    break;
                player.addHandCard(player.shiftDeck());
            }
            */
        };
        this.processTurn = function (step, player) {
            switch (step) {
                case 0:
                    // Pre-Draw
                    break;
                case 1:
                    break;
                case 2:
                    break;
                case 3:
                    break;
                case 4:
                    break;
                case 5:
                    break;
                case 6:
                    break;
                case 7:
                    break;
                case 8:
                    break;
                case 9:
                    break;
                case 10:
                    break;
                case 11:
                    break;
                case 12:
                    break;
                case 13:
                    break;
                case 14:
                    break;
                case 15:
                    break;
                case 16:
                    break;
                case 17:
                    break;
                case 18:
                    break;
                case 19:
                    break;
            }
        };

        Object.freeze(this);
    }

    Duel.TAG_MODE = 0x20;

    Duel.PLAYER_HOST = 0;
    Duel.PLAYER_CLIENT = 1;
    Duel.PLAYER_NONE = 2;
    Duel.PLAYER_ALL = 3;

    Duel.PHASE_DRAW = 0x01;
    Duel.PHASE_STANDBY = 0x02;
    Duel.PHASE_MAIN1 = 0x04;
    Duel.PHASE_BATTLE = 0x08;
    Duel.PHASE_DAMAGE = 0x10;
    Duel.PHASE_DAMAGE_CAL = 0x20;
    Duel.PHASE_MAIN2 = 0x40;
    Duel.PHASE_END = 0x80;

    Duel.EFFECT_CANNOT_DRAW = 25;

    Duel.REASON_RULE = 0x400;

    scope.Duel = Duel;
})(window);