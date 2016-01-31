function StarterScene() {
    IScene.LoadLevel(new Scene("Gameplay"));
    SceneData.background = "#222";
    //
    var Camera = IGameObject.CreateCamera("MainCamera", true);
    Camera.position = new Vector2(0, 0);
    Camera.AddComponent("StarterScript");
}

//
//
//

function StarterScript(GO) { //Код скрипта здесь, так как отдельным файлом слишком жирно

    function Start() {

    }

    function Update() {
        var Status = Assets.GetStatus();

        if (Status.all == Status.loaded) {
            MenuScene();
        }
    }

    function LateUpdate() {

    }

    function OnGUI() {
        if (Assets.EngineLogo.loaded) {
            GUI.DrawTexture(new Rect(Screen.width / 2 - 100, Screen.height / 2 - 100, 200, 200), Assets.EngineLogo);
        }
        else {
            GUI.Box(new Rect(Screen.width / 2 - 100, Screen.height / 2 - 25, 200, 26), "Загрузка...");
        }
    }

    return {
        Start: Start,
        Update: Update,
        LateUpdate: LateUpdate,
        OnGUI: OnGUI,
    }

}