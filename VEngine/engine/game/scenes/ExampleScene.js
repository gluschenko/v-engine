function ExampleScene() {
    IScene.LoadLevel(new Scene("Gameplay"));
    //
    var Camera = IGameObject.CreateCamera("MainCamera", true);
    Camera.position = new Vector2(0, 0);
    //
    var G = null;
    //

}