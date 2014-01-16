/// <reference path="lzma.js" />
/// <reference path="duel.js" />

(function (scope) {
    "use strict";
    var $ = scope.$;

    var EXPORT_SYMBOLS = [
        "ReplayHeader",
        "DataReader",
        "Replay"
    ];

    function ReplayHeader(data) {
        var dataReader = null;
        if (data instanceof DataReader)
            dataReader = data;
        else
            dataReader = new DataReader(data);

        this.id = dataReader.readUint32();
        this.version = dataReader.readUint32();
        this.flag = dataReader.readUint32();
        this.seed = dataReader.readUint32();
        this.datasize = dataReader.readUint32();
        this.hash = dataReader.readUint32();

        Object.freeze(this);
    }
    ReplayHeader.COMPRESSED = 1;
    ReplayHeader.TAG = 2;
    ReplayHeader.DECODED = 4;

    function DataReader(data) {
        this.buffer = null;
        var dataView = null;
        if (data instanceof ArrayBuffer) {
            this.buffer = data;
            dataView = new DataView(this.buffer);
        }
        else if (data instanceof DataView) {
            this.buffer = data.buffer;
            dataView = data;
        }
        else if (data.buffer instanceof ArrayBuffer) {
            this.buffer = data.buffer;
            dataView = new DataView(this.buffer);
        }
        else if (data instanceof DataReader) {
            this.buffer = data.buffer;
            dataView = new dataView(this.buffer);
        }
        else
            throw TypeError("data MUST be typed one of the following:\
                ArrayBuffer, DataView, TypedArray, DataReader");

        var index = 0, bigEndian = true;
        this.readByte = function () {
            return this.readUint8();
        };
        this.readUint8 = function () {
            var result = dataView.getUint8(index);
            index++;
            return result;
        };
        this.readUint16 = function () {
            var result = dataView.getUint16(index, bigEndian);
            index += 2;
            return result;
        };
        this.readUint32 = function () {
            var result = dataView.getUint32(index, bigEndian);
            index += 4;
            return result;
        };
        this.readInt32 = function () {
            var result = dataView.getInt32(index, bigEndian);
            index += 4;
            return result;
        }
        this.readString = function (length) {
            var charCode = null;
            var result = "";
            for (var i = length / 2; i--;)
                if (charCode = this.readUint16())
                    result += String.fromCharCode(charCode);
            return result;
        };
        this.skip = function (count) {
            index += count;
        };
        this.seek = function (postition) {
            index = postition;
        };

        Object.freeze(this);
    }

    function Replay(arrayBuffer, battleField) {
        var dataReader = new DataReader(arrayBuffer);
        this.header = new ReplayHeader(dataReader);

        if (this.header.flag & ReplayHeader.COMPRESSED) {
            var decoder = new scope.LZMA.Decoder();

            var value = dataReader.readByte();
            var lc = value % 9;
            value = ~~(value / 9);
            var lp = value % 5;
            var pb = ~~(value / 5);
            decoder.setLcLpPb(lc, lp, pb);

            var dictionarySize = dataReader.readByte();
            dictionarySize |= dataReader.readByte() << 8;
            dictionarySize |= dataReader.readByte() << 16;
            dictionarySize += dataReader.readByte() * 16777216;
            decoder.setDictionarySize(dictionarySize);

            dataReader.skip(3);

            var outStream = {
                dataView: new Uint8Array(this.header.datasize),
                index: 0,
                writeByte: function (value) {
                    this.dataView[this.index++] = value;
                }
            }
            decoder.decode(dataReader, outStream, this.header.datasize);

            dataReader = new DataReader(outStream.dataView);
        }
        else
            dataReader = new DataReader(arrayBuffer.slice(32));

        var hostname = dataReader.readString(40);
        if (this.header.flag & ReplayHeader.TAG) {
            var hosttag = dataReader.readString(40);
            var clienttag = dataReader.readString(40);
        }
        var clientname = dataReader.readString(40);

        this.startLP = dataReader.readInt32();
        this.startHand = dataReader.readInt32();
        this.drawCount = dataReader.readInt32();
        this.opt = dataReader.readInt32();

        var hostDeck = [], hostExtra = [],
            hostDeckTag = [], hostExtraTag = [],
            clientDeck = [], clientExtra = [],
            clientDeckTag = [], clientExtraTag = [];
        var order = [hostDeck, hostExtra];
        if (this.opt & Duel.TAG_MODE)
            order.push(hostDeckTag, hostExtraTag);
        order.push(clientDeck, clientExtra);
        if (this.opt & Duel.TAG_MODE)
            order.push(clientDeckTag, clientExtraTag);
        order.forEach(function (deck) {
            for (var i = dataReader.readInt32() ; i--;)
                deck.push(dataReader.readInt32());
        });

        this.host = {
            "name": hostname,
            "tag": hosttag,
            "deck": hostDeck,
            "deckTag": hostDeckTag,
            "extra": hostExtra,
            "extraTag": hostExtraTag
        };
        this.client = {
            "name": clientname,
            "tag": clienttag,
            "deck": clientDeck,
            "deckTag": clientDeckTag,
            "extra": clientExtra,
            "extraTag": clientExtraTag
        };
        this.duel = new scope.Duel({
            "battleField": battleField,
            "startLP": this.startLP,
            "startHand": this.startHand,
            "drawCount": this.drawCount,
            "host": this.host,
            "client": this.client,
            "isTag": this.header.flag & ReplayHeader.TAG
        });

        /*
        this.getNextStep = function () {
    
        };
        this.getProviousStep = function () {
    
        };
        this.getSteps = function () {
    
        };
        */

        Object.freeze(this);
    }
    Replay.parse = function (path, battleField) {
        var promise = $.Deferred();

        if (typeof (path) == "string") {
            var request = new XMLHttpRequest();
            request.open("GET", path);
            request.responseType = "arraybuffer";
            request.onload = function () {
                promise.resolve(new scope.Replay(request.response, battleField));
            };
            request.onerror = function () {
                promise.reject();
            };
            request.send();
        }
        else if (path instanceof Blob) {
            var fileReader = new FileReader();
            fileReader.onloadend = function () {
                promise.resolve(new scope.Replay(fileReader.result, battleField));
            };
            fileReader.onerror = function () {
                promise.reject();
            };
            fileReader.readAsArrayBuffer(path);
        }

        return promise;
    }

    EXPORT_SYMBOLS.forEach(function (name) {
        var object = eval(name);
        if (object) {
            Object.freeze(object);
            scope[name] = object;
        }
    });
})(window);