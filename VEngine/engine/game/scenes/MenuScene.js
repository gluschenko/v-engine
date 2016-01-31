function MenuScene() {
    IScene.LoadLevel(new Scene("Menu"));
    //

    var Camera = IGameObject.CreateCamera("MainCamera", true);
    Camera.position = new Vector2(0, 0);
    Camera.AddComponent("MenuScript");
    //
    var G = null;
    //
}