//Содержит авторизационную базу для клиента (см. код лаунчера на сервере)
//Принимает и отпраляет игровые данные

var GlobalData = {}; //Массив для всякого межпроцедурного трэша

var GameData = {
    hasData: false,
    //
    id: 0,
    platform: "",
    status: 0,
    email: "",
    first_name: "",
    last_name: "",
    avatar: "",
    data: null,
    balance: 0,
    bonus: false,
    bonus_size: 0,
    //
    maps: null,
    items: null,
    store: null,
    //
    CurrentMap: {
        id: 0,
        blocks: "",
        objects: "",
        data: {},
    },
};

//

var GlobalUserData = new Object();

function SetUserData(ud) //Вызывается в лаунчере.
{
    GlobalUserData = ud;
    //
    OnDataSet();
}

function OnDataSet() {
    var AvatarURL = GlobalUserData.Get("avatar", "");
    if(AvatarURL == "")AvatarURL = Assets.Avatar.source;
    Assets.Add(new Asset("Avatar", AssetTypes.texture, AvatarURL));
    //
    GetGameData();
}

//

function GetGameData() {
    WebData.Call("game.get", {},
        function (data) {
            console.log(data);
            try{
                var d = FromJSON(data);
                //
                ApplyUserData(d.user);
                GameData.maps = d.maps;
                GameData.items = d.items;
                GameData.store = d.store;
                //
                GameData.hasData = true;
                //

            }
            catch (e){
                Debug.Log(e);
            }
            
        },
        function (error) {
            console.log(data);
        });
}

function SaveGameData(with_map, done, failed) {

    var data = ToJSON(PackUserData(GameData));
    var player_prefs = PlayerPrefs.GetData();
    //
    var method = "user.save";
    if (with_map) method = "user.save, map.save";
    //
    var request = {
        "data": data,
        "player_prefs": player_prefs,
    };

    if (with_map){
        request["map"] = ToJSON({
            id: GameData.CurrentMap.id,
            blocks: GameData.CurrentMap.blocks,
            objects: GameData.CurrentMap.objects,
            data: ToJSON(GameData.CurrentMap.data),
        });
    }


    WebData.Call(method, request,
        function (data) {
            done();
        },
        function (error) {
            failed();
        });
}

function ApplyUserData(user_data){
    GameData.id = user_data.id;
    GameData.platform = user_data.platform;
    GameData.status = user_data.status;
    GameData.email = user_data.email;
    GameData.first_name = user_data.first_name;
    GameData.last_name = user_data.last_name;
    GameData.avatar = user_data.avatar;
    GameData.data = user_data.data;
    GameData.balance = user_data.balance;
    GameData.bonus = user_data.bonus;
    GameData.bonus_size = user_data.bonus_size;
    //
    PlayerPrefs.SetData(user_data.player_prefs);
}

function PackUserData(data) {
    var pack = new Object();

    pack.email = data.email;
    pack.first_name = data.first_name;
    pack.last_name = data.last_name;
    pack.avatar = data.avatar;
    pack.data = data.data;

    return pack;
}

//

//var VKMoneyItems = ["item1", "item2", "item3", "item4", "item5", "item6"];

//Мажорская функция
function BuyMoney(item) { 

    if (GameData.hasData) {

        if (GameData.platform == "vk") {
            var params = {
                type: "item",
                item: item,
            };
            VK.callMethod("showOrderBox", params);
        }

        if (GameData.platform == "ok") {
            Debug.Log("This platform in not supported!");
        }

        if (GameData.platform == "fb") {
            Debug.Log("This platform in not supported!");
        }

        if (GameData.platform == "mm") {
            Debug.Log("This platform in not supported!");
        }
        
        if (GameData.platform == "std") {
            Debug.Log("This platform in not supported!");
        }

    }

}

function BuyStoreItem(item_id, type, done, failed) {
    WebData.Call("store.buy", { item_id: item_id, for_week: type },
        function (data) {
            done();
        },
        function (error) {
            failed();
        });
}

OnVKOrder = function () { }; //Делегат, который вызывается при успешной оплате товара