/// <reference path="jquery-2.0.3.min.js" />

(function (scope) {
    "use strict";
    var $ = scope.$;

    var EXPORT_SYMBOLS = [
        "PlayerInfo",
        "FieldBlock",
        "HandBlock",
        "HandCard",
        "BattleField"
    ];

    var Templates = {
        "block_wrapper": $("<div>", { "class": "wrap" }),
        "block_zone": $("<div>", { "class": "zone" }),
        "block_card": $("<img>", { "class": "card", "src": "img/transparent.png" }),
        "block_number": $("<span>", { "class": "number" }),
        "field_container": $("<div>", { "class": "background" }).append($("<div>", { "class": "field" })),
        "field_sideColumn": $("<div>", { "class": "column side" }),
        "field_centerColumn": $("<div>", { "class": "column center" }),
        "field_columnSpacer": $("<div>", { "class": "spacer" }),
        "field_hand": $("<div>", { "class": "hand" }),
        "hand_cell": $("<div>", { "class": "cell" }),
        "hand_wrap": $("<div>", { "class": "wrap" }),
        "hand_card": $("<img>", { "class": "card" }),
        "phase_wrapper": $("<div>", { "class": "phases" }),
        "phase_button": $("<button>", { "class": "phase" }),
        "info_wrapper": $("<div>", { "class": "info" }),
        "lp_wrapper": $("<div>", { "class": "lp" }),
        "lp_bar": $("<div>", { "class": "bar" }),
        "lp_number": $("<div>", { "class": "number" }),
        "info_avatar": $("<img>", { "class": "avatar" }),
        "info_name": $("<span>", { "class": "name" }),
        "turn_wrapper": $("<div>", { "class": "turn" }),
        "turn_number": $("<span>", { "class": "number" })
    }

    var CARD_IMAGE_URL = "http://my-card.in/images/cards/ygocore/";
    var CARD_IMAGE_SUFFIX = ".jpg";
    var CARD_THUMB_URL = "http://my-card.in/images/cards/ygocore/thumbnail/";
    var CARD_THUMB_SUFFIX = ".jpg";
    var CARD_UNKNOW_URL = "img/unknown.jpg";

    function PlayerInfo(player) {
        var container = Templates.info_wrapper.clone();
        if (player == BattleField.PLAYER_HOST)
            container.addClass("opp");
        this.element = container;

        var lpWrapper = Templates.lp_wrapper.clone();
        container.append(lpWrapper);
        var lpBar = Templates.lp_bar.clone();
        lpWrapper.append(lpBar);
        var lpNumber = Templates.lp_number.clone();
        lpWrapper.append(lpNumber);

        var avatar = Templates.info_avatar.clone();
        avatar.hide();
        container.append(avatar);

        var name = Templates.info_name.clone();
        container.append(name);

        var lp = 0;
        var maxLP = 0;

        Object.defineProperty(this, "name", {
            get: function () { return name.text(); },
            set: function (value) { name.text(value); }
        });
        Object.defineProperty(this, "avatar", {
            get: function () { return avatar.attr("src"); },
            set: function (value) {
                avatar.attr("src", value);
                if (value)
                    avatar.show();
                else
                    avatar.hide();
            }
        });
        Object.defineProperty(this, "maxLP", {
            get: function () { return maxLP; },
            set: function (value) {
                if (maxLP != value) {
                    maxLP = value;
                    lpBar.css("width", Math.min(lp / maxLP * 100, 100) + "%");
                }
            }
        });
        Object.defineProperty(this, "lp", {
            get: function () { return lp; },
            set: function (value) {
                if (lp != value) {
                    lp = value;
                    lpBar.css("width", Math.min(lp / maxLP * 100, 100) + "%");
                    lpNumber.text(lp);
                }
            }
        });

        Object.freeze(this);
    }

    function FieldBlock(player) {
        var block = Templates.block_zone.clone();
        this.element = block;
        if (player == BattleField.PLAYER_HOST)
            block.addClass("opp");

        var cardMore = [];
        for (var i = 3; i--;)
            cardMore.push(Templates.block_card.clone().addClass("more"));
        block.append(cardMore);
        cardMore = $(cardMore.reverse());

        var card = Templates.block_card.clone();
        // TODO: Show tooltip for card.
        card.on("mouseenter", function (e) {

        }).on("mouseleave", function (e) {

        })
        block.append(card);

        var count = Templates.block_number.clone();
        block.append(count);

        var cards = [];
        this.addCard = function (id) {
            cards.push(id);
            this.repaint();
        };
        this.addCards = function (list) {
            cards = cards.concat(list);
            this.repaint();
        }
        this.removeCard = function (id) {
            this.removeCardAt(cards.indexOf(id));
        };
        this.removeCardAt = function (index) {
            if (index < 0 || index >= cards.length)
                throw RangeError("Invalid card index.");
            var result = cards.splice(index, 1)[0];
            this.repaint();
            return result;
        };
        this.shiftCard = function () {
            if (cards.length < 1)
                throw RangeError("No more card!");
            var result = cards.shift();
            this.repaint();
            return result;
        };
        this.getCards = function () {
            return new Array(cards);
        };
        this.getCardAt = function (index) {
            if (index < 0 || index >= cards.length)
                throw RangeError("Invalid card index.");
            return cards[index];
        };

        var position = FieldBlock.POS_FACEUP_ATTACK;
        Object.defineProperty(this, "position", {
            get: function () { return position; },
            set: function (value) {
                if (value != FieldBlock.POS_FACEUP_ATTACK &&
                    value != FieldBlock.POS_FACEDOWN_ATTACK &&
                    value != FieldBlock.POS_FACEUP_DEFENCE &&
                    value != FieldBlock.POS_FACEDOWN_DEFENCE)
                    throw RangeError("Invalid position value.");
                if (position != value) {
                    position = value;
                    this.repaint();
                }
            }
        });

        this.repaint = function () {
            if (cards.length > 0) {
                var temp = cards.reverse();

                var image = "";
                switch (position) {
                    case FieldBlock.POS_FACEUP_ATTACK:
                        image = CARD_THUMB_URL + temp[0] + CARD_THUMB_SUFFIX;
                        card.removeClass("defense");
                        break;
                    case FieldBlock.POS_FACEDOWN_ATTACK:
                        image = CARD_UNKNOW_URL;
                        card.removeClass("defense");
                        break;
                    case FieldBlock.POS_FACEUP_DEFENCE:
                        image = CARD_THUMB_URL + temp[0] + CARD_THUMB_SUFFIX;
                        card.addClass("defense");
                        break;
                    case FieldBlock.POS_FACEDOWN_DEFENCE:
                        image = CARD_UNKNOW_URL;
                        card.addClass("defense");
                }
                card.attr("src", image);

                cardMore.attr("src", "img/transparent.png");
                if (temp.length > 1) {
                    cardMore.eq(0).attr("src", CARD_THUMB_URL + temp[1] + CARD_THUMB_SUFFIX);
                    if (temp.length > 2) {
                        cardMore.eq(1).attr("src", CARD_THUMB_URL + temp[2] + CARD_THUMB_SUFFIX);
                        if (temp.length > 3)
                            cardMore.eq(2).attr("src", CARD_THUMB_URL + temp[3] + CARD_THUMB_SUFFIX);
                    }
                }
            }
            else
                card.attr("src", "img/transparent.png");
        }

        Object.freeze(this);
    }
    FieldBlock.POS_FACEUP_ATTACK = 0x1;
    FieldBlock.POS_FACEDOWN_ATTACK = 0x2;
    FieldBlock.POS_FACEUP_DEFENCE = 0x4;
    FieldBlock.POS_FACEDOWN_DEFENCE = 0x8;
    FieldBlock.POS_FACEUP = 0x5;
    FieldBlock.POS_FACEDOWN = 0xa;
    FieldBlock.POS_ATTACK = 0x3;
    FieldBlock.POS_DEFENCE = 0xc;
    FieldBlock.NO_FLIP_EFFECT = 0x10000;

    function HandBlock(player) {
        var cards = [];

        var block = Templates.field_hand.clone();
        if (player == BattleField.PLAYER_HOST)
            block.addClass("opp");
        this.element = block;

        this.addCard = function (id) {
            var card = new HandCard(id);
            cards.push(card);
            block.append(card.element);
            card.resize(block.height());
        };
        this.removeCard = function (id) {
            this.removeCardAt(this.getCards().indexOf(id));
        };
        this.removeCardAt = function (index) {
            if (index < 0 || index > cards.length)
                throw RangeError("Invalid card index.");
            cards[index].remove();
            cards.splice(index, 1);
        };
        this.getCards = function () {
            return cards.map(function (card) {
                return card.id;
            });
        };
        this.getCardAt = function (index) {
            if (index < 0 || index > cards.length)
                throw RangeError("Invalid card index.");
            return cards[index].id;
        }

        this.resize = function (height) {
            cards.forEach(function (card) {
                card.resize(height);
            });
        };

        Object.freeze(this);
    }
    function HandCard(id) {
        this.id = id;
        this.element = Templates.hand_cell.clone();

        var wrap = Templates.hand_wrap.clone();
        var card = Templates.hand_card.clone().attr("src", CARD_IMAGE_URL + id + CARD_IMAGE_SUFFIX);
        wrap.append(card);
        this.element.append(wrap);

        this.resize = function (height) {
            card.css("margin-left", 0 - height * 177 / 254 / 2);
        };

        this.remove = function () {
            this.element.remove();
        };

        Object.freeze(this);
    }

    function BattleField(target) {
        var container = target;
        if (container instanceof HTMLElement)
            container = $(container);
        container.addClass("battlefield");

        var playerInfos = {};
        this.playerInfos = playerInfos;

        var playerInfo = new PlayerInfo(BattleField.PLAYER_HOST);
        playerInfos[BattleField.PLAYER_HOST] = playerInfo;
        playerInfo.element.insertBefore(container);

        var playerInfo = new PlayerInfo(BattleField.PLAYER_CLIENT);
        playerInfos[BattleField.PLAYER_CLIENT] = playerInfo;
        playerInfo.element.insertAfter(container);

        var turnNumber = 0;
        var turnInfo = Templates.turn_wrapper.clone();
        var turnText = Templates.turn_number.clone();
        turnInfo.append(turnText);
        Object.defineProperty(this, "turn", {
            get: function () { return turnNumber; },
            set: function (value) {
                if (turnNumber != value &&
                    (typeof value == "number" || typeof parseInt(value) == "number")) {
                    turnNumber = value;
                    turnText.text(value);
                }
            }
        });

        var enable3d = false;
        Object.defineProperty(this, "enable3d", {
            get: function () { return enable3d; },
            set: function (value) {
                if (enable3d != value) {
                    enable3d = !!value;
                    if (value) {
                        container.addClass("three-d");
                        playerInfos[0].element.addClass("three-d");
                        playerInfos[1].element.addClass("three-d");
                    }
                    else {
                        container.removeClass("three-d");
                        playerInfos[0].element.removeClass("three-d");
                        playerInfos[1].element.removeClass("three-d");
                    }
                    resizeStage();
                }
            }
        });

        var blocks = {};
        blocks[BattleField.PLAYER_HOST] = {};
        blocks[BattleField.PLAYER_CLIENT] = {};
        this.blocks = blocks;

        var field = Templates.field_container.clone();
        container.append(field);
        field = field.children();

        function buildSideColumn(column, isLeft) {
            var order = [
                BattleField.LOCATION_EXTRA, BattleField.LOCATION_FIELD,
                -1, BattleField.LOCATION_REMOVED,
                BattleField.LOCATION_GRAVE, BattleField.LOCATION_DECK
            ];
            if (isLeft)
                order.reverse();
            var block = null, wrapper = null,
                owner = BattleField.PLAYER_HOST;
            order.forEach(function (location) {
                if (location == -1) {
                    column.append(Templates.field_columnSpacer.clone());
                    owner = BattleField.PLAYER_CLIENT;
                }
                else {
                    block = new FieldBlock(owner);
                    wrapper = Templates.block_wrapper.clone().append(block.element);
                    column.append(wrapper);
                    blocks[owner][location] = block;
                }
            });
        }

        var column = Templates.field_sideColumn.clone();
        buildSideColumn(column, true);
        blocks[BattleField.PLAYER_HOST][BattleField.LOCATION_DECK].position = FieldBlock.POS_FACEDOWN_ATTACK;
        blocks[BattleField.PLAYER_CLIENT][BattleField.LOCATION_EXTRA].position = FieldBlock.POS_FACEDOWN_ATTACK;
        field.append(column);

        function buildCenterColumn(column) {
            var zones = null, wrapper = null,
                owner = BattleField.PLAYER_HOST;
            [
                BattleField.LOCATION_SZONE, BattleField.LOCATION_MZONE,
                -1, BattleField.LOCATION_MZONE, BattleField.LOCATION_SZONE
            ].forEach(function (location) {
                if (location == -1) {
                    column.append(Templates.field_columnSpacer.clone());
                    owner = BattleField.PLAYER_CLIENT;
                }
                else {
                    zones = [];
                    for (var i = 5; i--;)
                        zones.push(new FieldBlock(owner));
                    blocks[owner][location] = zones;
                    wrapper = Templates.block_wrapper.clone()
                        .append(zones.map(function (block) {
                            return block.element;
                        }));
                    column.append(wrapper);
                }
            });
            blocks[BattleField.PLAYER_HOST][BattleField.LOCATION_SZONE]
                .push(blocks[BattleField.PLAYER_HOST][BattleField.LOCATION_FIELD]);
            blocks[BattleField.PLAYER_CLIENT][BattleField.LOCATION_SZONE]
                .push(blocks[BattleField.PLAYER_CLIENT][BattleField.LOCATION_FIELD]);
        }

        column = Templates.field_centerColumn.clone();
        column.append(Templates.field_columnSpacer.clone());
        buildCenterColumn(column);
        column.append(Templates.field_columnSpacer.clone());
        field.append(column);

        column = Templates.field_sideColumn.clone();
        buildSideColumn(column, false);
        blocks[BattleField.PLAYER_CLIENT][BattleField.LOCATION_DECK].position = FieldBlock.POS_FACEDOWN_ATTACK;
        blocks[BattleField.PLAYER_HOST][BattleField.LOCATION_EXTRA].position = FieldBlock.POS_FACEDOWN_ATTACK;
        field.append(column);

        var hostHand = new HandBlock(BattleField.PLAYER_HOST);
        blocks[BattleField.PLAYER_HOST][BattleField.LOCATION_HAND] = hostHand;
        container.append(hostHand.element);
        var clientHand = new HandBlock(BattleField.PLAYER_CLIENT);
        blocks[BattleField.PLAYER_CLIENT][BattleField.LOCATION_HAND] = clientHand;
        container.append(clientHand.element);

        this.addCard = function (owner, location, id) {
            blocks[owner][location].addCard(id);
        };
        this.removeCard = function (owner, location, id) {
            blocks[owner][location].removeCard(id);
        };
        this.getCards = function (owner, location) {
            return blocks[owner][location].getCards();
        };
        this.getCardAt = function (owner, location, index) {
            return blocks[owner][location].getCardAt(index);
        }

        var phaseWrapper = Templates.phase_wrapper.clone();
        var phases = {};
        var activePhase = null;
        var phaseTexts = ["DP", "SP", "M1", "BP", "M2", "EP"];
        var button = null;
        [
            BattleField.PHASE_DRAW,
            BattleField.PHASE_STANDBY,
            BattleField.PHASE_MAIN1,
            BattleField.PHASE_BATTLE,
            BattleField.PHASE_MAIN2,
            BattleField.PHASE_END
        ].forEach(function (phase, index) {
            button = Templates.phase_button.clone();
            button.text(phaseTexts[index]);
            phases[phase] = button;
            phaseWrapper.append(button);
        });
        Object.defineProperty(this, "phase", {
            get: function () { return activePhase; },
            set: function (value) {
                if (activePhase != value) {
                    if (phases[activePhase])
                        phases[activePhase].removeClass("active");
                    activePhase = value;
                    if (phases[value])
                        phases[value].addClass("active");
                }
            }
        });
        container.append(phaseWrapper);

        var archor = container.parent();
        var resizeTimeout;
        function resizeStage() {
            var width = 0;
            if (innerWidth / innerHeight >= 1) {
                width = archor.height();
                container.height(width).width(width);
            }
            else {
                width = archor.width();
                container.height(width).width(width);
            }
            if (!enable3d) {
                hostHand.resize(width * 0.15);
                clientHand.resize(width * 0.15);
            }
            else {
                hostHand.resize(width * 0.15);
                clientHand.resize(width * 0.2);
            }
        }
        $(window).resize(function () {
            if (!resizeTimeout)
                clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function () {
                resizeTimeout = null;
                resizeStage();
            }, 33);
        });
        resizeStage();

        Object.freeze(this);
    }

    BattleField.PLAYER_HOST = 0;
    BattleField.PLAYER_CLIENT = 1;
    BattleField.PLAYER_NONE = 2;
    BattleField.PLAYER_ALL = 3;

    BattleField.LOCATION_DECK = 0x01;
    BattleField.LOCATION_HAND = 0x02;
    BattleField.LOCATION_MZONE = 0x04;
    BattleField.LOCATION_SZONE = 0x08;
    BattleField.LOCATION_GRAVE = 0x10;
    BattleField.LOCATION_REMOVED = 0x20;
    BattleField.LOCATION_EXTRA = 0x40;
    BattleField.LOCATION_OVERLAY = 0x80;
    BattleField.LOCATION_ONFIELD = 0x0c;
    BattleField.LOCATION_FIELD = 0x100;

    BattleField.PHASE_DRAW = 0x01;
    BattleField.PHASE_STANDBY = 0x02;
    BattleField.PHASE_MAIN1 = 0x04;
    BattleField.PHASE_BATTLE = 0x08;
    BattleField.PHASE_DAMAGE = 0x10;
    BattleField.PHASE_DAMAGE_CAL = 0x20;
    BattleField.PHASE_MAIN2 = 0x40;
    BattleField.PHASE_END = 0x80;

    EXPORT_SYMBOLS.forEach(function (name) {
        var object = eval(name);
        if (object) {
            Object.freeze(object);
            scope[name] = object;
        }
    });
})(window);