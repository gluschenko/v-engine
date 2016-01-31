//var GameVersion = "0.1"; - номера версий движка и приложения будут совпадать

//Точка входа в игру
function Main() {
    CreateAssets();
    //
    StarterScene();
}

//Точка окончания загрузки
function OnAssetsLoad() {
    SetupGameItems();
}


function CreateAssets() {

    for (var key in _ASSETS) {
        if (typeof _ASSETS[key] != "function") {
            Assets.CreateByBase64(key, _ASSETS[key]);
        }
    }

    AssetsSettings.onLoad = function () {
        OnAssetsLoad();
    };

    /*var assets = [
        //Минор всякий
        new Asset("MenuBackground", AssetTypes.texture, "//pp.vk.me/c619818/v619818684/1366d/2ZXHoF8Jpp0.jpg"),
        new Asset("Player", AssetTypes.texture, "game/assets/Mario32.png"),
        new Asset("terrain", AssetTypes.texture, "game/assets/terrain.png"),

        //То, что пойдет релиз
        new Asset("Items", AssetTypes.texture, "game/assets/Items.png"),
        new Asset("Blocks", AssetTypes.texture, "game/assets/Blocks.png"),
        new Asset("Sprites", AssetTypes.texture, "game/assets/Sprites.png"),
        new Asset("EngineLogo", AssetTypes.texture, "game/assets/EngineLogo.png"),
        new Asset("DefaultAvatar", AssetTypes.texture, "game/assets/Avatar.png"),
        new Asset("GUIBackground", AssetTypes.texture, "game/assets/GUIBackground.png"),
        new Asset("Null", AssetTypes.texture, "game/assets/Null.png"),

        new Asset("Coins1", AssetTypes.texture, "game/assets/Coins1.png"),
        new Asset("Coins2", AssetTypes.texture, "game/assets/Coins2.png"),
        new Asset("Coins3", AssetTypes.texture, "game/assets/Coins3.png"),
        new Asset("Coins4", AssetTypes.texture, "game/assets/Coins4.png"),
        new Asset("Coins5", AssetTypes.texture, "game/assets/Coins5.png"),
        new Asset("Coins6", AssetTypes.texture, "game/assets/Coins6.png"),
    ];

    Assets.AddRange(assets);

    //Резка спрайтов
    AssetsSettings.onLoad = function () {
        Assets.AddSprite("Sun", 0, 0, 1 / 16, 1 / 16, Assets.Sprites);
        Assets.AddSprite("Moon", 1 / 16, 0, 1 / 16, 1 / 16, Assets.Sprites);
        Assets.AddSprite("SelectorGreen", 2 / 16, 0, 1 / 16, 1 / 16, Assets.Sprites);
        Assets.AddSprite("SelectorRed", 3 / 16, 0, 1 / 16, 1 / 16, Assets.Sprites);
        Assets.AddSprite("Play", 0, 1 / 16, 4 / 16, 4 / 16, Assets.Sprites);
        Assets.AddSprite("StoreCheck", 0, 5 / 16, 2 / 16, 2 / 16, Assets.Sprites);

        //
        OnAssetsLoad();
    };*/

}