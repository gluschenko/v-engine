//Система Ассетов 1.0 (2-08-2015)
//Система Ассетов 2.0 (20-09-2015)
//Система Ассетов 3.0 (17-11-2015)

var Assets = new Object(); //Все ассеты теперь здесь (доступ по имени)

AssetsSettings = {
    CDN: "", //На случай использования сторонних CDN (больше не используется)
    onLoad: function () { }, //Выполняется после полной загрузки всех ассетов
};

Assets.Add = function (asset) { //Добавляет объект ассета в массив
    Assets[asset.name] = asset;
    if (!asset.loaded) Assets.Load(asset);
};

Assets.AddRange = function (assets) { //Добавляет массив объектов в основной массив
    for (var i = 0; i < assets.length; i++) {
        Assets.Add(assets[i]);
    }
};

Assets.AddSprite = function (name, x, y, width, height, sheet) { //Добавляет спрайт в общий массив ассетов
    var sprite = Assets.CreateSprite(name, x, y, width, height, sheet);
    if (sprite != false) {
        Assets.Add(sprite);
    }
};

Assets.CreateSprite = function (name, x, y, width, height, sheet) { //Режет спрайт из ассета
    if (sheet.type == AssetTypes.texture && sheet.loaded) {
        var full_width = sheet.data.width;
        var full_height = sheet.data.height;

        GraphicsBuffer.Apply(full_width * width, full_height * height);
        //
        var rect = new Rect(0, 0, full_width * width, full_height * height);
        var clip = new Rect(x, y, width, height);
        GraphicsBuffer.DrawTexture(rect, sheet, clip);
        //
        var a = GraphicsBuffer.GetBuffer(name);
        return a;
    }
    return false;
};

Assets.CreateSprites = function (name, sheet, x, y) { //Резка листа в массив спрайтов
    var assets = [];

    for (var ix = 0; ix < x; ix++) {
        for (var iy = 0; iy < y; iy++) {
            var index = (x * iy) + ix;

            assets[index] = Assets.CreateSprite(name + index, ix / x, iy / y, 1 / x, 1 / y, sheet);
        }
    }

    return assets;
};

Assets.CreateByBase64 = function(name, base){
    Assets.Add(new Asset(name, Assets.TypeByMIME(base), base));
};

Assets.TypeByMIME = function (mime) {
    var assocs = [
        "image/png", AssetTypes.texture,
        "audio/mp3", AssetTypes.audio,
    ];

    for (var i = 0; i < assocs.length; i += 2) {
        if (mime.indexOf(assocs[i + 0]) != -1) return assocs[i + 1];
    }

    return AssetTypes.none;
};

Assets.Load = function(asset) { //Загружает ассет с сервера
    if (asset.type == AssetTypes.texture) {
        if (asset.source != "")
        {
            asset.data = new Image();
            asset.data.onload = function () {
                asset.loaded = true;
            };
            //
            asset.data.crossOrigin = "Anonymous"; //Вот на этом я собаку съел, сука!
            asset.data.src = asset.source;
        }
    }

    if (asset.type == AssetTypes.audio) {
        if (asset.source != "") {
            asset.data = new Audio();
            asset.data.onload = function () {
                asset.loaded = true;
            };
            //
            asset.data.crossOrigin = "Anonymous";
            asset.data.src = asset.source;
        }
    }

    return false;
};

Assets.GetStatus = function () { //Соотношение между всеми и уже загруженными ассетами
    var loaded = 0;
    var all = 0;

    for (var key in Assets) {
        if (typeof (Assets[key]) != "function") {
            if (Assets[key].loaded) loaded++;
            all++;
        }
    }

    //
    if (loaded == all) {
        AssetsSettings.onLoad();
        AssetsSettings.onLoad = function () { };
    }
    //

    return { loaded: loaded, all: all };
};

//

var AssetTypes = {
    texture: "texture",
    audio: "audio",
    none: "none",
};

function Asset(name, type, source, data) {
    if (!data) data = null;
    //
    var loaded = false;
    
    if (data) {
        loaded = true;
    }
    else {
        loaded = false;
    }
    //
    this.name = name;
    this.type = type;
    this.source = source;
    this.loaded = loaded;
    this.data = data;
}

Asset.prototype.Reload = function (source) {
    this.source = source;
    IAssets.Load(this);
}

    //

    //Обломки старого интерфейса
    /*IAssets = new function () {
    
        function Load(asset) {
            if (asset.type == AssetTypes.texture) {
                if (asset.source != "")
                {
                    asset.data = new Image();
                    asset.data.onload = function () {
                        asset.loaded = true;
                    };
                    //
                    asset.data.crossOrigin = "Anonymous"; //Вот на этом я собаку съел
                    asset.data.src = AssetsSettings.CDN + asset.source;
                }
            }
    
            if (asset.type == AssetTypes.audio) {
                if (asset.source != "") {
                    asset.data = new Audio();
                    asset.data.onload = function () {
                        asset.loaded = true;
                    };
                    //
                    asset.data.src = AssetsSettings.CDN + asset.source;
                }
            }
    
            return false;
        }
    
        function GetStatus() { //соотношение между всеми и уже загруженными ассетами
            var loaded = 0;
            var all = 0;
    
            for (var key in Assets)
            {
                if (typeof (Assets[key]) != "function") {
                    if (Assets[key].loaded) loaded++;
                    all++;
                }
            }
    
            return { loaded: loaded, all: all };
        }
    
        function Add(asset) {
            //Game.Assets[Game.Assets.length] = asset; - устаревший финт (весь сопутствующий функционал выпилен)
            Assets[asset.name] = asset;
            if (!asset.loaded) IAssets.Load(asset);
        }
    
        function AddRange(assets) { //Массив из ассетов
            for (var i = 0; i < assets.length; i++) {
                IAssets.Add(assets[i]);
            }
        }*/

    /*function LoadAssets() { //Больше не нужно
        for (var i = 0; i < Game.Assets.length; i++) {
            IAssets.Load(Game.Assets[i]);
        }

        return false;
    }*/

    /*function GetData(name) { //Больше не нужно
        for (var i = 0; i < Game.Assets.length; i++) {
            if (Game.Assets[i].name == name) {
                return Game.Assets[i].data;
            }
        }

        return false;
    }

    return {
        Load: Load,
        GetStatus: GetStatus,
    }
}();*/

