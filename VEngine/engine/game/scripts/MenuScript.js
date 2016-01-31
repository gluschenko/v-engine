function MenuScript(GO) {

    var MenuSection = 0;
    var Logged = false;
    var Login = "Login";
    var Password = "Password";
    var MapName = "";

    var BluredStars = Assets.Stars;
    var StarsOffset = 0;

    var MapsOffset = 0;
    var SelectedMap = -1;

    var DisplayDeletedMaps = false;

    function Start() {
        Time.timeScale = 1;

        if (true) {
            GraphicsBuffer.Apply(Screen.width, Screen.height);
            GraphicsBuffer.DrawTexture(new Rect(0, 0, Screen.width, Screen.height), BluredStars)
            GraphicsBuffer.Blur(7);
            BluredStars = GraphicsBuffer.GetBuffer("BluredStars");
        }
    }

    function Update() {
        this.Logged = true;//GameData.hasData; //GlobalUserData.HasKey("id");
        //
        ApplySettings();
    }

    function LateUpdate() {

    }

    function OnGUI() {
        //Декор
        SceneData.background = new Color4(0, 14, 59, 1);

        var Stars = Assets.Stars;
        var Landscape = Assets.MenuLandscape;

        if (MenuSection != 0) {
            Stars = BluredStars;
            Landscape = Assets.MenuLandscapeBlured;
        }

        if (StarsOffset < Screen.width) StarsOffset += Time.deltaTime * 6;
        else StarsOffset = 0;

        GUI.DrawTexture(new Rect(-Screen.width + StarsOffset, 0, Screen.width, Screen.width * (3 / 4)), Stars);
        GUI.DrawTexture(new Rect(0 + StarsOffset, 0, Screen.width, Screen.width * (3 / 4)), Stars);

        GUI.DrawTexture(new Rect(0, 0, Screen.width, Screen.width * (3 / 4)), Assets.SkyGrad);

        GUI.DrawTexture(new Rect(0, Screen.height - (Screen.width * (1 / 5)), Screen.width, Screen.width * (1 / 5)), Landscape);

        if (MenuSection != 0) GUI.DrawBox(new Rect(0, 0, Screen.width, Screen.height), 0, new Color4(0, 0, 0, 0.1));
        //
        //

        //Интерфейс

        GUI.Label(new Rect(10, Screen.height - 20, 0, 0), "v " + Engine.projectVersion + " (engine)", GUI.customSkin.freeLabel);

        if (!this.Logged) {
            GUI.Box(new Rect(Screen.width/2 - 100, Screen.height/2 - 25, 200, 26), "Загрузка...");
        }
        else {
            //
            if (GameData.bonus) MenuSection = 5; //Включаем принудительно, если есть бонус
            //

            //Профиль
            GUI.Box(new Rect(Screen.width - 210, 10, 200, 60), "");
            GUI.DrawTexture(new Rect(Screen.width - 205, 15, 50, 50), Assets.Get("Avatar", Assets.DefaultAvatar));
            GUI.Label(new Rect(Screen.width - 145, 25, 100, 60), GlobalUserData.Get("first_name", "Firstname"));
            GUI.Label(new Rect(Screen.width - 145, 45, 100, 60), GlobalUserData.Get("last_name", "Lastname"));

            GUI.Box(new Rect(Screen.width - 210, 80, 200, 41), "");
            GUI.Label(new Rect(Screen.width - 200, 97, 0, 0), GameData.balance + " монет");
            if (GUI.Button(new Rect(Screen.width - 88, 83, 75, 35), "Купить")) {
                MenuSection = 4;
            }

            //
            if (GUI.Button(new Rect(Screen.width - 190, Screen.height - 50, 180, 40), "Настройки")) {
                //MenuSection = 2;
            }
            if (GUI.Button(new Rect(Screen.width - 380, Screen.height - 50, 180, 40), "Магазин")) {
                //MenuSection = 3;
            }
            /*if (MenuSection != 0 && MenuSection != 1) { //Бред
                if (GUI.Button(new Rect(Screen.width - 570, Screen.height - 50, 180, 40), "Играть")) {
                    MenuSection = 1;
                }
            }*/

            if (GUI.Button(new Rect(110, Screen.height - 27, 70, 25), "dev")) {
                DevScene();
            }
            //

            if (MenuSection == 0) {

                if (GUI.Button(new Rect(Screen.width / 2 - 75, Screen.height / 2 - 75, 150, 150), "", GUI.customSkin.radialButton)) {
                    GameplayScene();
                    //MenuSection = 1;
                }

                GUI.DrawTexture(new Rect(Screen.width / 2 - 25, Screen.height / 2 - 25, 50, 50), Assets.Play);

            }

            //Раздел работы с картами (основной)
            if (MenuSection == 1) {
                
                GUI.Box(new Rect(Screen.width / 2 - 335, Screen.height / 2 - 160, 670, 370), "");
                //

                if (SelectedMap >= 0 && SelectedMap < GameData.maps.length) { //Отображаем рычаги воздействия на карту или селектим какую-нибудь карту (else)
                    if (GameData.maps[SelectedMap].status != -1) {
                        if (GUI.Button(new Rect(Screen.width / 2 - 325, Screen.height / 2 - 130, 200, 50), "Играть")) {
                            MenuSection = 999;
                            PlayGame(GameData.maps[SelectedMap]);
                        }

                        if (GUI.Button(new Rect(Screen.width / 2 - 325, Screen.height / 2 - 70, 200, 40), "Переименовать", GUI.customSkin.greenButton)) {
                            MapName = GameData.maps[SelectedMap].name;
                            MenuSection = 7;
                        }

                        if (GUI.Button(new Rect(Screen.width / 2 - 325, Screen.height / 2 - 20, 200, 40), "Удалить", GUI.customSkin.redButton)) {
                            MenuSection = 8;
                        }
                    }
                    else {
                        if (GUI.Button(new Rect(Screen.width / 2 - 325, Screen.height / 2 - 130, 200, 50), "Восстановить")) {
                            MenuSection = 999;

                            WebData.Call("map.restore", { map_id: GameData.maps[SelectedMap].id },
                                function (data) {
                                    console.log(data);
                                    try {
                                        GameData.maps[SelectedMap].status = 0;
                                        //
                                        MenuSection = 1;
                                    }
                                    catch (e) {
                                        MenuSection = 99;
                                        Debug.Log(e);
                                    }

                                },
                                function (error) {
                                    console.log(data);
                                });
                        }
                    }
                }
                else { //Селектим карту, которая не удалена
                    for (var i = 0; i < GameData.maps.length; i++) {
                        var index = GameData.maps.length - i - 1;
                        if (GameData.maps[index].status != -1) { //Если карта не удалена
                            SelectedMap = index;
                            break;
                        }
                    }
                }

                //

                if (GUI.Button(new Rect(Screen.width / 2 - 325, Screen.height / 2 + 130, 200, 50), "Создать мир")) {
                    MapName = "";
                    MenuSection = 6;
                }

                //
                GUI.DrawBox(new Rect(Screen.width / 2 - 115, Screen.height / 2 - 160, 3, 370), 0, GUIColors.orange);
                //
                var Maps = [];

                for (var m = 0; m < GameData.maps.length; m++){
                    if (GameData.maps[m].status == 0 || DisplayDeletedMaps) {
                        Maps[Maps.length] = m;
                    }
                }
                //
                var MapsDisplayX = 5;

                for (var i = 0; i < MapsDisplayX; i++) {
                    var MapIndex = i + (MapsOffset * MapsDisplayX);
                    MapIndex = (Maps.length - MapIndex) - 1;

                    if (MapIndex < Maps.length && MapIndex >= 0) {
                        var MainIndex = Maps[MapIndex];

                        var ButtonTitle = GameData.maps[MainIndex].name;
                        //
                        var style = null;
                        if (GameData.maps[MainIndex].status == -1) {
                            style = GUI.customSkin.redButton;
                            ButtonTitle = ButtonTitle + " [УДАЛЕНО]";
                        }

                        var ModX = 0;
                        if (MainIndex == SelectedMap) ModX = 10;
                        //

                        if (GUI.Button(new Rect(Screen.width / 2 - 90 - ModX, Screen.height / 2 - 130 + (i * 55), 400 + (ModX * 2), 50), ButtonTitle, style)) {
                            SelectedMap = MainIndex;
                        }
                    }
                }

                if (Maps.length == 0) GUI.Label(new Rect(Screen.width / 2 - 90, Screen.height / 2 - 130, 400, 50), "Карт нет");
                //

                if (GUI.Button(new Rect(Screen.width / 2 - 100, Screen.height / 2 + 170, 60, 30), "<<")) {
                    if (MapsOffset > 0) MapsOffset--;
                }

                if (GUI.Button(new Rect(Screen.width / 2 - 30, Screen.height / 2 + 170, 60, 30), ">>")) {
                    if (MapsOffset < Math.floor((Maps.length - 1) / MapsDisplayX)) MapsOffset++;
                }

                if (GUI.Button(new Rect(Screen.width / 2 + 40, Screen.height / 2 + 170, 120, 30), "Удалённые")) {
                    DisplayDeletedMaps = !DisplayDeletedMaps;
                    MapsOffset = 0;
                    SelectedMap = -1;
                }

                //
                if (GUI.Button(new Rect(Screen.width / 2 + 205, Screen.height / 2 + 170, 120, 30), "Закрыть")) {
                    MenuSection = 0;
                }
            }

            //Настройки
            if (MenuSection == 2) {
                DrawSettings(function () {
                    MenuSection = 0;
                });
            }

            //Магаз
            if (MenuSection == 3) {
                DrawStore(function () {
                    MenuSection = 0;
                });
            }

            //Платежи
            if (MenuSection == 4) {
                DrawPayments(function () {
                    MenuSection = 0;
                });
            }

            //Бонус
            if (MenuSection == 5) {
                GUI.Box(new Rect(Screen.width / 2 - 180, Screen.height / 2 - 60, 360, 120), "Ежедневный бонус");

                GUI.Label(new Rect(Screen.width / 2 - 140, Screen.height / 2 - 20, 100, 100), "Вам зачислен бонус в размере " + GameData.bonus_size + " монет!");

                if (GUI.Button(new Rect(Screen.width / 2 - 60, Screen.height / 2 + 10, 120, 40), "Закрыть")) {
                    GameData.bonus = false;
                    MenuSection = 0;
                }
            }

            //Создание мира
            if (MenuSection == 6) {
                GUI.Box(new Rect(Screen.width / 2 - 200, Screen.height / 2 - 100, 400, 200), "Придумайте название");

                MapName = GUI.TextBox(new Rect(Screen.width / 2 - 190, Screen.height / 2 - 40, 380, 40), "map_field", MapName, 32);

                if (MapName.length > 0) {
                    if (GUI.Button(new Rect(Screen.width / 2 - 60, Screen.height / 2 + 50, 120, 40), "Создать")) {
                        MenuSection = 999;

                        WebData.Call("map.create", { name: MapName },
                            function (data) {
                                console.log(data);
                                try {
                                    var d = FromJSON(data);
                                    //
                                    if (d.id != 0) {
                                        GameData.maps[GameData.maps.length] = d;
                                    }
                                    //
                                    MenuSection = 1;
                                }
                                catch (e) {
                                    MenuSection = 99;
                                    Debug.Log(e);
                                }

                            },
                            function (error) {
                                console.log(data);
                            });
                    }
                }
                else {
                    if (GUI.Button(new Rect(Screen.width / 2 - 40, Screen.height / 2 + 50, 80, 40), "Отмена", GUI.customSkin.redButton)) {
                        MenuSection = 1;
                    }
                }
                
            }

            //Переименование
            if (MenuSection == 7) {
                GUI.Box(new Rect(Screen.width / 2 - 200, Screen.height / 2 - 100, 400, 200), "Переименование");

                MapName = GUI.TextBox(new Rect(Screen.width / 2 - 190, Screen.height / 2 - 40, 380, 40), "map_field", MapName, 32);

                if (MapName.length > 0) {
                    if (GUI.Button(new Rect(Screen.width / 2 - 80, Screen.height / 2 + 50, 160, 40), "Переименовать")) {
                        MenuSection = 999;

                        WebData.Call("map.rename", { map_id: GameData.maps[SelectedMap].id, name: MapName },
                            function (data) {
                                console.log(data);
                                try {
                                    GameData.maps[SelectedMap].name = MapName;
                                    //
                                    MenuSection = 1;
                                }
                                catch (e) {
                                    MenuSection = 99;
                                    Debug.Log(e);
                                }

                            },
                            function (error) {
                                console.log(data);
                            });
                    }
                }
                else {
                    if (GUI.Button(new Rect(Screen.width / 2 - 40, Screen.height / 2 + 50, 80, 40), "Отмена", GUI.customSkin.redButton)) {
                        MenuSection = 1;
                    }
                }
            }

            //Удаление
            if (MenuSection == 8) {
                GUI.Box(new Rect(Screen.width / 2 - 150, Screen.height / 2 - 50, 300, 100), "Вы хотите удалить этот мир?");

                if (GUI.Button(new Rect(Screen.width / 2 - 85, Screen.height / 2 + 0, 80, 40), "Да", GUI.customSkin.greenButton)) {
                    MenuSection = 999;

                    WebData.Call("map.delete", { map_id: GameData.maps[SelectedMap].id },
                        function (data) {
                            console.log(data);
                            try {
                                GameData.maps[SelectedMap].status = -1;
                                //
                                MenuSection = 1;
                            }
                            catch (e) {
                                MenuSection = 99;
                                Debug.Log(e);
                            }

                        },
                        function (error) {
                            console.log(data);
                        });
                }

                if (GUI.Button(new Rect(Screen.width / 2 + 5, Screen.height / 2 + 0, 80, 40), "Нет", GUI.customSkin.redButton)) {
                    MenuSection = 1;
                }
            }

            //Ошибка
            if (MenuSection == 99) {
                GUI.Box(new Rect(Screen.width / 2 - 150, Screen.height / 2 - 50, 300, 100), "Произошла ошибка");
                if (GUI.Button(new Rect(Screen.width / 2 - 60, Screen.height / 2 - 0, 120, 40), "ОК")) {
                    MenuSection = 0;
                }
            }

            //Ожидание сервера
            if(MenuSection == 999)
            {
                GUI.Box(new Rect(Screen.width / 2 - 100, Screen.height / 2 - 25, 200, 26), "Подождите...");
            }

            //Тест 
            if (MenuSection == 9999) {
                GUI.Box(new Rect(Screen.width / 2 - 100, Screen.height / 2 - 100, 200, 200), "Auth form");

                Login = GUI.TextBox(new Rect(Screen.width / 2 - 90, Screen.height / 2 - 70, 180, 40), "log_field", Login, 18);
                Password = GUI.TextBox(new Rect(Screen.width / 2 - 90, Screen.height / 2 - 20, 180, 40), "pass_field", Password, 30, true);

                if (GUI.Button(new Rect(Screen.width / 2 - 60, Screen.height / 2 + 50, 120, 40), "Log in")) {
                    MenuSection = 0;
                }
            }
        }
    }

    return {
        MenuSection: MenuSection,
        Logged: Logged,
        Login: Login, //Не нужно
        Password: Password, //Не нужно
        MenuSection: MenuSection,
        Start: Start,
        Update: Update,
        LateUpdate: LateUpdate,
        OnGUI: OnGUI,
    }

}

function PlayGame(mapObj) { //Запускает игровой процесс
    GameData.CurrentMap.id = mapObj.id;
    GameData.CurrentMap.blocks = mapObj.blocks;
    GameData.CurrentMap.objects = mapObj.objects;
    GameData.CurrentMap.data = (mapObj.data != "") ? FromJSON(mapObj.data) : {};
    //
    GameplayScene();
}

function DrawSettings(closeCallback) {
    GUI.Box(new Rect(Screen.width / 2 - 200, Screen.height / 2 - 150, 400, 300), "Настройки");

    //

    /*GUI.Label(new Rect(Screen.width / 2 - 190, Screen.height / 2 - 120, 100, 30), "Lighting quality");

    var LightScale = PlayerPrefs.Get("LightScale", 4);

    var QTitle = "";
    if (LightScale == 4) QTitle = "High";
    if (LightScale == 5) QTitle = "Medium";
    if (LightScale == 6) QTitle = "Low";
    if (LightScale == 7) QTitle = "Very low";

    GUI.Button(new Rect(Screen.width / 2 - 155, Screen.height / 2 - 100, 110, 30), QTitle);

    if (GUI.Button(new Rect(Screen.width / 2 - 190, Screen.height / 2 - 100, 30, 30), "+")) {
        if (LightScale > 4) {
            LightScale--;
        }
    }
    if (GUI.Button(new Rect(Screen.width / 2 - 40, Screen.height / 2 - 100, 30, 30), "-")) {
        if (LightScale < 7) {
            LightScale++;
        }
    }

    PlayerPrefs.Set("LightScale", LightScale);
    //
    GUI.Label(new Rect(Screen.width / 2 + 10, Screen.height / 2 - 120, 100, 30), "Shadows");

    if (PlayerPrefs.Get("ShadowsEnabled", 0) == 1) {
        if (GUI.Button(new Rect(Screen.width / 2 + 10, Screen.height / 2 - 100, 180, 30), "Enabled")) {
            PlayerPrefs.Set("ShadowsEnabled", 0);
        }
    }
    else {
        if (GUI.Button(new Rect(Screen.width / 2 + 10, Screen.height / 2 - 100, 180, 30), "Disabled")) {
            PlayerPrefs.Set("ShadowsEnabled", 1);
        }
    }
    */

    //
    if (GUI.Button(new Rect(Screen.width / 2 - 60, Screen.height / 2 + 110, 120, 30), "Закрыть")) {
        closeCallback();
    }
}

function ApplySettings() {
    //
    /*Light.Scale = PlayerPrefs.Get("LightScale", Light.Scale);
    Light.ShadowsEnabled = PlayerPrefs.Get("ShadowsEnabled", 0) == 1;*/
    //
}

//

var StoreBase = {
    offset: 0,
    currentItem: null,
    currentGameItem: null,
};

function DrawStore(closeCallback) {
    var store_items = [

    ];

    var onBuy = function (id, price) {
        GameData.balance -= price;
        GameData.items[GameData.items.length] = id;
    };

    var isBought = function (id) {
        for (var i = 0; i < GameData.items.length; i++)
        {
            if (GameData.items[i] == id) return true;
        }
        return false;
    };

    //
    GUI.Box(new Rect(Screen.width / 2 - 335, Screen.height / 2 - 160, 670, 370), "Магазин");
    //

    if (StoreBase.currentItem != null) {

        GUI.DrawTexture(new Rect(Screen.width / 2 - 325, Screen.height / 2 - 150, 140, 140), StoreBase.currentGameItem.icon);

        GUI.Label(new Rect(Screen.width / 2 - 325, Screen.height / 2 + 0, 140, 140), StoreBase.currentGameItem.title);


        GUI.DrawBox(new Rect(Screen.width / 2 - 335, Screen.height / 2 + 20, 160, 1), 0, GUIColors.orange);

        if (!isBought(StoreBase.currentItem.id)) {
            GUI.Label(new Rect(Screen.width / 2 - 325, Screen.height / 2 + 30, 140, 140), "Навсегда:");
            GUI.Label(new Rect(Screen.width / 2 - 315, Screen.height / 2 + 50, 140, 140), StoreBase.currentItem.price + " монет");

            if (GUI.Button(new Rect(Screen.width / 2 - 315, Screen.height / 2 + 70, 120, 30), "Купить")) {
                if (GameData.balance >= StoreBase.currentItem.price) {
                    BuyStoreItem(StoreBase.currentItem.id, 0, function () {
                        onBuy(StoreBase.currentItem.id, StoreBase.currentItem.price);
                    }, function () {
                        console.log("Item Buy Error!");
                    });
                }
            }

            GUI.DrawBox(new Rect(Screen.width / 2 - 335, Screen.height / 2 + 110, 160, 1), 0, GUIColors.orange);
            GUI.Label(new Rect(Screen.width / 2 - 325, Screen.height / 2 + 120, 140, 140), "На неделю:");
            GUI.Label(new Rect(Screen.width / 2 - 315, Screen.height / 2 + 140, 140, 140), StoreBase.currentItem.slim_price + " монет");

            if (GUI.Button(new Rect(Screen.width / 2 - 315, Screen.height / 2 + 160, 120, 30), "Купить")) {
                if (GameData.balance >= StoreBase.currentItem.slim_price) {
                    BuyStoreItem(StoreBase.currentItem.id, 1, function () {
                        onBuy(StoreBase.currentItem.id, StoreBase.currentItem.slim_price);
                    }, function () {
                        console.log("Item Buy Error!");
                    });
                }
            }
        }
        else {
            GUI.Label(new Rect(Screen.width / 2 - 325, Screen.height / 2 + 30, 140, 140), "Куплено!");
        }

    }

    //
    GUI.DrawBox(new Rect(Screen.width / 2 - 175, Screen.height / 2 - 160, 3, 370), 0, GUIColors.orange);
    //

    var ItemsX = 6; //Число сущностей по горизонтали
    var ItemsY = 3; //Число сущностей по вертикали
    var ItemsNumber = ItemsX * ItemsY; //Смещение в массиве предметов
    var BtnWidth = 75;

    for (var x = 0; x < ItemsX; x++) {
        for (var y = 0; y < ItemsY; y++) {
            var ItemIndex = (y * ItemsX + x) + (ItemsNumber * StoreBase.offset);

            if (ItemIndex < GameData.store.length) {
                var ItemObj = GameData.store[ItemIndex];
                //
                var GameItemID = StoreItems[ItemObj.id];
                var GameItemObj = null;

                if(GameItemID != null){
                    for(var i = 0; i < GameItems.length; i++){
                        if (GameItems[i].id == ItemObj.id) {
                            GameItemObj = GameItems[i];
                        }
                    }
                }
                //
                var r = new Rect(Screen.width / 2 - 160 + (x * (BtnWidth + 5)), Screen.height / 2 - 130 + (y * (BtnWidth + 5)), BtnWidth, BtnWidth);

                if (GUI.Button(r, "", GUI.customSkin.whiteButton)) {
                    if (GameItemObj != null) {
                        StoreBase.currentItem = GameData.store[ItemIndex];
                        StoreBase.currentGameItem = GameItemObj;
                    }
                }
                //
                ItemIcon = Assets.Null;
                if (GameItemObj != null) ItemIcon = GameItemObj.icon;

                GUI.DrawTexture(new Rect(r.x + r.width / 8, r.y + r.height / 8, r.width * 6 / 8, r.height * 6 / 8), ItemIcon);
                //
                if (isBought(ItemObj.id)) {
                    GUI.DrawTexture(new Rect(r.x + r.width / 4, r.y + r.height / 4, r.width / 2, r.height / 2), Assets.StoreCheck);
                }
            }
            
        }
    }

    //
    if (GUI.Button(new Rect(Screen.width / 2 - 160, Screen.height / 2 + 170, 60, 30), "<<")) {
        if (StoreBase.offset > 0) StoreBase.offset--;
    }

    if (GUI.Button(new Rect(Screen.width / 2 - 90, Screen.height / 2 + 170, 60, 30), ">>")) {
        if (StoreBase.offset < Math.floor(GameData.store.length / ItemsNumber)) StoreBase.offset++;
    }

    if (GUI.Button(new Rect(Screen.width / 2 + 205, Screen.height / 2 + 170, 120, 30), "Закрыть")) {
        closeCallback();
    }
}

//

function DrawPayments(closeCallback) {
    var Data = [
        "item1", 100, 1 + " голос", Assets.Coins1,
        "item2", 200, 2 + " голоса", Assets.Coins2,
        "item3", 400, (4 - 1) + " голоса", Assets.Coins3,
        "item4", 800, (8 - 2) + " голосов", Assets.Coins4,
        "item5", 1600, (16 - 3) + " голосов", Assets.Coins5,
        "item6", 3200, (32 - 5) + " голосов", Assets.Coins6,
    ];
    //
    GUI.Box(new Rect(Screen.width / 2 - 335, Screen.height / 2 - 150, 670, 300), "Платежи");
    //
    for (var i = 0; i < Data.length; i += 4)
    {
        var offset = (i / 4) * 110;

        GUI.DrawTexture(new Rect(Screen.width / 2 - 325 + offset, Screen.height / 2 - 115, 100, 100), Data[i + 3]);

        GUI.Label(new Rect(Screen.width / 2 - 315 + offset, Screen.height / 2 - 0, 100, 100), Data[i + 1] + " монет");
        GUI.Label(new Rect(Screen.width / 2 - 310 + offset, Screen.height / 2 + 20, 100, 100), Data[i + 2]);

        if(GUI.Button(new Rect(Screen.width/2 - 315 + offset, Screen.height/2 + 45, 80, 40), "Купить"))
        {
            BuyMoney(Data[i + 0]);
            OnVKOrder = function () {
                GameData.balance += Data[i + 1];
                closeCallback();
            };
        }
    }

    GUI.DrawBox(new Rect(Screen.width / 2 - 335, Screen.height / 2 + 97, 670, 2), 0, GUIColors.orange);
    //
    if (GUI.Button(new Rect(Screen.width / 2 - 60, Screen.height / 2 + 110, 120, 30), "Закрыть")) {
        closeCallback();
    }
}