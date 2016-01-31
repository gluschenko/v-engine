function GameplayScene() {
    IScene.LoadLevel(new Scene("Gameplay"));
    //
    SceneData.background = "#3598db";

    var Camera = IGameObject.CreateCamera("MainCamera", true);
    Camera.position = new Vector2(0, 55);
    Camera.collider.enabled = false;
    //Camera.AddComponent("GameCameraScript");
    Camera.AddComponent("CameraFollowScript");
    //
    var G = null;
    //
    G = IGameObject.Instantiate("World");
    G.position = new Vector2(0, 0);
    G.sprite = Assets.terrain;
    G.AddComponent("WorldScript");
    //
    G = IGameObject.Instantiate("Player");
    G.position = new Vector2(0, 55);
    G.scale = new Vector2(1, 2);
    G.sprite = Assets.Player;
    G.collider.enabled = true;
    G.rigidbody.enabled = true;
    G.AddComponent("PlayerScript");
    G.AddComponent("GameScript");
    G.light.enabled = true;
    G.castShadows = false;
    G.layer = 2;
    //
    G = IGameObject.Instantiate("Selector");
    G.position = new Vector2(0, 0);
    G.sprite = Assets.SelectorGreen;
    G.layer = 11;
    //
    G = IGameObject.Instantiate("SkySystem");
    G.position = new Vector2(0, 0);
    G.scale = new Vector2(0.9, 0.9);
    G.collider.enabled = false;
    G.AddComponent("SkyScript");
    G.layer = 1;
    //
    G = IGameObject.Instantiate("SunMoonPivot");
    G.position = new Vector2(0, 0);
    G.collider.enabled = false;
    GameObject.Find("SkySystem").Append(G);
    //
    G = IGameObject.Instantiate("Sun");
    G.position = new Vector2(4, -4);
    G.scale = new Vector2(1.5, 1.5);
    G.collider.enabled = false;
    G.sprite = Assets.Sun;
    GameObject.Find("SunMoonPivot").Append(G);
    //
    G = IGameObject.Instantiate("Moon");
    G.position = new Vector2(-4, 4);
    G.scale = new Vector2(1.5, 1.5);
    G.collider.enabled = false;
    G.sprite = Assets.Moon;
    GameObject.Find("SunMoonPivot").Append(G);
    //
    G = IGameObject.Instantiate("Stars");
    G.position = new Vector2(0, 0);
    G.scale = new Vector2(24, 16);
    G.collider.enabled = false;
    G.sprite = Assets.Stars;
    GameObject.Find("SkySystem").Append(G);
    //
    G = IGameObject.Instantiate("SkyGrad");
    G.position = new Vector2(0, 0);
    G.scale = new Vector2(24, 16);
    G.collider.enabled = false;
    G.sprite = Assets.SkyGrad;
    GameObject.Find("SkySystem").Append(G);
    //
    G = IGameObject.Instantiate("SunsetGrad");
    G.position = new Vector2(0, 0);
    G.scale = new Vector2(24, 16);
    G.collider.enabled = false;
    G.sprite = Assets.SunsetGrad;
    GameObject.Find("SkySystem").Append(G);
    //
    G = IGameObject.Instantiate("SkyBackground");
    G.position = new Vector2(0, 0);
    G.scale = new Vector2(24, 16);
    G.collider.enabled = false;
    G.sprite = Assets.SkyBackground;
    GameObject.Find("SkySystem").Append(G);
    //
}