Game = new function () {

    var productName = "The Forge"; //Название игры
    var productDeveloper = "Alexander Gluschenko"; //Разработчик

    var deviceID = "device"; //ID холста

    function Start() {
        if (CreateAssets) { //Загружаются ассеты
            CreateAssets();
        }
        else {
            Debug.Log("CreateAssets() function is not exists!");
        }

        //

        if (Main) { //Игра стартует
            Main();
        }
        else {
            Debug.Log("Main() function is not exists!");
        }
    }

    function Update() {
        Physics.Update();
        Light.Update();
    }

    function LateUpdate() {
        Physics.LateUpdate();
    }

    //
    return {
        productName: productName,
        productDeveloper: productDeveloper,
        deviceID: deviceID,
        Start: Start,
        Update: Update,
        LateUpdate: LateUpdate,
    }
}();