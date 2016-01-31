function GameScript(GO) {

    //Playable
    var InvX = 8, InvY = 6;
    var Items = [];

    //Public
    var GameSection = 1;
    var MenuSection = 0;

    var SelectedItem = 0;

    //Private
    var MenuPanelOffset = 0;

    var World = null;
    var MainCamera = null;
    //

    function Start() {

    }

    function Update() {
        ApplySettings();
        //
        World = GameObject.Find("World").GetComponent("WorldScript");
        MainCamera = GameObject.Find("MainCamera");
        //
        if (GameSection == 0) { //Дефолт

            if (Input.GetKeyUp(KeyCode.Escape) || Input.GetKeyUp(KeyCode.M)) {
                GameSection = 1;
            }

            if (Input.GetKeyUp(KeyCode.E)) {
                GameSection = 2;
            }

            if (Input.GetKeyUp(KeyCode.R)) {
                GO.position = new Vector2(0, 65);
            }

            //

            var Pos = MainCamera.camera.ScreenToWorld(Input.mousePosition);

            var SelX = Math.floor(Pos.x);
            var SelY = Math.floor(Pos.y);

            var BlockType = World.GetBlock(SelX, SelY, 0);

            var Selector = GameObject.Find("Selector");

            var CanSet = true;

            if (BlockType != 0) {
                Selector.position = new Vector2(SelX + 0.5, SelY + 0.5);

                if (CanSet) {
                    Selector.sprite = Assets.SelectorGreen;
                }
                else {
                    Selector.sprite = Assets.SelectorRed;
                }
            }
            else {
                Selector.position = new Vector2(-1000, -1000);
            }

            //

            if ((BlockType == 0 || this.SelectedItem == 0) && CanSet) {
                if (Input.GetKeyUp(KeyCode.Mouse0)) {

                    World.SetBlock(SelX, SelY, this.SelectedItem);

                }
            }

            //

            if (Input.GetKeyUp(KeyCode.Alpha1)) {
                if (this.SelectedItem > 0) this.SelectedItem--;
            }

            if (Input.GetKeyUp(KeyCode.Alpha2)) {
                this.SelectedItem++;
            }
            

        }

        if (GameSection == 1) { //Меню
            
        }

        if (GameSection == 2) { //Инвентарь

        }

        //

        if (GameSection == 1) Time.timeScale = 0;
        else Time.timeScale = 1;

        //
        //Анимации в меню
        if (MenuSection != 0) MenuPanelOffset = Math.Lerp(MenuPanelOffset, 0, Time.deltaTimeNormal * 10);
        else MenuPanelOffset = Math.Lerp(MenuPanelOffset, Screen.height / 2 - 25, Time.deltaTimeNormal * 10);
        
        //
    }

    function LateUpdate() {

    }

    function OnGUI() {
        var GetItem = function (x, y) {
            for (var item = 0; item < Items.length; item++) {
                if (Items[item].x == x && Items[item].y == y) {
                    return Items[item];
                }
            }

            return null;
        };

        var DrawItem = function (rect, x, y) {
            var IconRect = new Rect(rect.x + 4, rect.y + 4, rect.width - 8, rect.height - 8);

            GUI.Box(rect, "");
            //

            /*for (var item = 0; item < Items.length; item++) {
                if (Items[item].x == x && Items[item].y == y) {
                    hasItem = true;
                    GItem = Items[item];
                }
            }*/

            if (GetItem(x, y) != null) {
                var GItem = GetItem(x, y);

                GUI.DrawTexture(IconRect, GameItems[GItem.id].icon);

                GUI.Box(new Rect(IconRect.x + IconRect.width - 32, IconRect.y + IconRect.height - 26, 30, 24), GItem.number);

                if (GameSection == 2) {
                    if (Input.GetKeyDown(KeyCode.Mouse0)) {
                        if (GUI.Over(rect)) {
                            RemoveItem(GItem);
                        }
                    }
                }
            }
            else {
                if (GameSection == 2) {
                    if (Input.GetKeyDown(KeyCode.Mouse0)) {
                        if (GUI.Over(rect)) {
                            if (GetItem(-1, -1) != null) {
                                MoveItem(GetItem(-1, -1), x, y);
                            }
                        }
                    }
                }
            }
        };

        var AddItem = function (id, number) {
            var NewItem = null;
            Items[Items.length] = NewItem = new GameItem(id, number, -1, -1);

            MoveItem(NewItem);
        };

        var MoveItem = function (item, x, y, canStack) {
            if (canStack == null) canStack = true;

            if (x == null && y == null) { //Если позиция не задана, то вычисляем место нового расположения
                //
                var has = false;

                for (var iy = 0; iy < InvY + 1; iy++) {
                    for (var ix = 0; ix < InvX; ix++) {
                        if (!has) {
                            if (GetItem(ix, iy) == null) {
                                x = ix;
                                y = iy;
                                has = true;
                            }
                            else {
                                var GItem = GetItem(ix, iy);

                                if (GameItems[GItem.id].stack && canStack) {
                                    if (GItem.id == item.id) {
                                        GItem.number += item.number;
                                        DeleteItem(item);
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }

            }

            item.x = x;
            item.y = y;
        };

        var RemoveItem = function (item) {
            item.x = -1;
            item.y = -1;
        };

        var DeleteItem = function (item) {
            Items.splice(Items.indexOf(item), 1);
        };

        if (this.Items.length == 0) {
            for (var i = 1; i < 10; i++) {
                AddItem(i, i * 2);
                AddItem(i, i * 3);
            }

            /*this.Items[0] = new GameItem(1, 34, 0, 0);
            this.Items[1] = new GameItem(2, 14, 0, 1);
            this.Items[2] = new GameItem(2, 14, 3, InvY);*/
        }
        

        //

        if (GameSection == 1 || GameSection == 2) { //Фон в некоторых разделах
            GUI.DrawTexture(new Rect(0, 0, Screen.width, Screen.height), Assets.GUIBackground);
        }

        //

        if (GameSection != 1) { //Вне меню
            //Вывод позиции игрока
            GUI.Label(new Rect(Screen.width / 2 - 20, 10, 100, 100), (Math.round(GO.position.x * 10) / 10) + ", " + (Math.round(GO.position.y * 10) / 10), GUI.customSkin.freeLabel);

            //Иконка выбпанного блока
            GUI.Box(new Rect(Screen.width - 90, 10, 80, 80), "");

            //Нижние предметы
            for (var x = 0; x < InvX; x++) {
                var ItemThumbWidth = 64;

                var ItemRect = new Rect(Screen.width / 2 - ((ItemThumbWidth + 5) * ((InvX/2) - x)) - 3, Screen.height - (ItemThumbWidth + 5), ItemThumbWidth, ItemThumbWidth);

                DrawItem(ItemRect, x, 0);
            }
            
        }

        //

        if (GameSection == 0) { //Дефолт

        }

        if (GameSection == 1) { //Меню
            GUI.Box(new Rect(Screen.width / 2 - 250, Screen.height - 55 - MenuPanelOffset, 500, 50), "");

            if (GUI.Button(new Rect(Screen.width / 2 - 245, Screen.height - 50 - MenuPanelOffset, 160, 40), "Продолжить")) {
                GameSection = 0;
                MenuSection = 0;
            }
            if (GUI.Button(new Rect(Screen.width / 2 - 80, Screen.height - 50 - MenuPanelOffset, 160, 40), "Настройки")) {
                MenuSection = 1;
            }
            if (GUI.Button(new Rect(Screen.width / 2 + 85, Screen.height - 50 - MenuPanelOffset, 160, 40), "Сохранить")) {
                MenuSection = 2;
                //MenuScene();
            }

            //

            if (MenuSection == 1) { //Настройки

                DrawSettings(function () {
                    MenuSection = 0;
                });

            }

            if (MenuSection == 2) { //Сохранение
                GUI.Box(new Rect(Screen.width / 2 - 150, Screen.height / 2 - 150, 300, 300), "");

                if (GUI.Button(new Rect(Screen.width / 2 - 140, Screen.height / 2 - 120, 280, 50), "Сохранить и выйти")) {
                    SaveGame(true);
                }

                if (GUI.Button(new Rect(Screen.width / 2 - 140, Screen.height / 2 - 60, 280, 50), "Сохранить", GUI.customSkin.greenButton)) {
                    SaveGame(false);
                }

                if (GUI.Button(new Rect(Screen.width / 2 - 140, Screen.height / 2 - 0, 280, 50), "Выйти без сохранения", GUI.customSkin.redButton)) {
                    MenuSection = 3;
                }

                if (GUI.Button(new Rect(Screen.width / 2 - 60, Screen.height / 2 + 100, 120, 40), "Назад")) {
                    MenuSection = 0;
                }
            }

            if (MenuSection == 3) { //Подтверждение выхода без сохранения
                GUI.Box(new Rect(Screen.width / 2 - 150, Screen.height / 2 - 50, 300, 100), "Хотите выйти без сохранения?");

                if (GUI.Button(new Rect(Screen.width / 2 - 85, Screen.height / 2 + 0, 80, 40), "Да", GUI.customSkin.greenButton)) {
                    MenuScene();
                }

                if (GUI.Button(new Rect(Screen.width / 2 + 5, Screen.height / 2 + 0, 80, 40), "Нет", GUI.customSkin.redButton)) {
                    MenuSection = 0;
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
            if (MenuSection == 999) {
                GUI.Box(new Rect(Screen.width / 2 - 100, Screen.height / 2 - 25, 200, 26), "Подождите...");
            }
        }

        if (GameSection == 2) { //Инвентарь

            var ThumbWidth = 64;

            for (var x = 0; x < InvX; x++){
                for (var y = 0; y < InvY; y++) {
                    var ItemRect = new Rect(Screen.width / 2 - ((ThumbWidth + 5) * (InvX / 2 - x)), Screen.height / 2 - ((ThumbWidth + 5) * (InvY / 2 - y)), ThumbWidth, ThumbWidth);

                    DrawItem(ItemRect, x, y + 1);
                }
            }

            if(Input.GetKeyDown(KeyCode.Mouse0))
            {
                if (!GUI.Over(new Rect(Screen.width / 2 - ((ThumbWidth + 5) * (InvX / 2)), Screen.height / 2 - ((ThumbWidth + 5) * (InvY / 2)), (ThumbWidth + 5) * InvX, (ThumbWidth + 5) * InvY * 2)))
                {
                    GameSection = 0;
                }
            }

            if(GetItem(-1, -1) != null)
            {
                var GItem = GetItem(-1, -1);
                
                GUI.DrawTexture(new Rect(Input.mousePosition.x - 24, Input.mousePosition.y - 24, 48, 48), GameItems[GItem.id].icon);
            }

        }
    }

    function SaveGame(is_quit) {
        MenuSection = 999;

        var done = function () {
            MenuSection = 0;
        };

        var fail = function () {
            MenuSection = 99;
        };

        if (is_quit) {
            done = function () {
                MenuScene();
            };
        }

        SaveGameData(true, done, fail);
    }

    return {
        Items: Items,
        GameSection: GameSection,
        MenuSection: MenuSection,
        SelectedItem: SelectedItem,
        Start: Start,
        Update: Update,
        LateUpdate: LateUpdate,
        OnGUI: OnGUI,
        SaveGame: SaveGame,
    }

}


function GameItem(id, number, x, y) {
    this.id = id;
    this.number = number;
    this.x = x;
    this.y = y;
}