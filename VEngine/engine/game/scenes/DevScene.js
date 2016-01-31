function DevScene() {
    IScene.LoadLevel(new Scene("Gameplay"));
    //
    var Camera = IGameObject.CreateCamera("MainCamera", true);
    Camera.position = new Vector2(0, 0);
    Camera.AddComponent("GameCameraScript");
    Camera.collider.enabled = false;
    //
    var G = null;
    //
    var GF = IGameObject.Instantiate("RigidBody1");
    GF.position = new Vector2(-2, 6.1);
    GF.sprite = Assets.Avatar;
    GF.rigidbody.enabled = true;
    GF.collider.enabled = true;

    var GF = IGameObject.Instantiate("RigidBody1");
    GF.position = new Vector2(-0.5, 6.1);
    GF.sprite = Assets.Avatar;
    GF.rigidbody.enabled = true;
    GF.collider.enabled = true;


    var GF = IGameObject.Instantiate("RigidBody1");
    GF.position = new Vector2(1.5, 6.1);
    GF.sprite = Assets.Avatar;
    GF.rigidbody.enabled = true;
    GF.collider.enabled = true;


    var G = IGameObject.Instantiate("RigidBody2");
    G.position = new Vector2(0, 7.5);
    G.sprite = Assets.Avatar;
    G.rigidbody.enabled = true;
    G.collider.enabled = true;

    var G = IGameObject.Instantiate("RigidBody3");
    G.position = new Vector2(0.9, 5);
    G.sprite = Assets.Avatar;
    G.rigidbody.enabled = true;
    G.collider.enabled = true;
    //G.light.enabled = true;

    //

    var G4 = IGameObject.Instantiate("TestObj3");
    G4.position = new Vector2(-2, -1);
    G4.sprite = Assets.Avatar;
    G4.collider.enabled = true;
    G4.light.enabled = true;
    G4.castShadows = false;

    var G5 = IGameObject.Instantiate("TestObj4");
    G5.position = new Vector2(1.2, 0);
    G5.sprite = Assets.Avatar;
    G5.collider.enabled = true;

    var G6 = IGameObject.Instantiate("TestObj6");
    G6.position = new Vector2(2, 0);
    G6.sprite = Assets.Avatar;
    G6.collider.enabled = true;
    G6.light.enabled = true;
    G6.light.color = new Color4(0, 0, 255, 0);
    G6.castShadows = false;

    var G8 = IGameObject.Instantiate("TestObj8");
    G8.position = new Vector2(-2, 2);
    G8.sprite = Assets.Avatar;
    G8.collider.enabled = true;
    G8.light.enabled = true;
    G8.light.color = new Color4(255, 0, 0, 0);
    G8.castShadows = false;

    var G9 = IGameObject.Instantiate("TestObj9");
    G9.position = new Vector2(1.5, 2);
    G9.sprite = Assets.Avatar;
    G9.collider.enabled = true;
    G9.light.enabled = true;
    G9.light.color = new Color4(0, 255, 0, 0);
    G9.castShadows = false;

    var G7 = IGameObject.Instantiate("TestObj7");
    G7.position = new Vector2(-5, -5);
    G7.sprite = Assets.Avatar;
    G7.collider.enabled = true;
    
    G4.Append(G5);
    G5.Append(G6);

    //

    var G = IGameObject.Instantiate("Parent1");
    G.position = new Vector2(4, 4);
    G.scale = new Vector2(1, 1);
    G.sprite = Assets.Avatar;

    var GA = IGameObject.Instantiate("Child1");
    GA.position = new Vector2(1, 1);
    GA.scale = new Vector2(1, 1);
    GA.sprite = Assets.Avatar;

    var GB = IGameObject.Instantiate("ChildChild1");
    GB.position = new Vector2(1, 1);
    GB.scale = new Vector2(1, 1);
    GB.sprite = Assets.Avatar;

    G.Append(GA);
    GA.Append(GB);
    //

    var G = IGameObject.Instantiate("Parent2");
    G.position = new Vector2(4, 4);
    G.scale = new Vector2(0.5, 0.5);
    G.sprite = Assets.Avatar;

    var GA = IGameObject.Instantiate("Child2");
    GA.position = new Vector2(1, 1);
    GA.scale = new Vector2(1, 1);
    GA.sprite = Assets.Avatar;

    var GB = IGameObject.Instantiate("ChildChild2");
    GB.position = new Vector2(1, 1);
    GB.scale = new Vector2(1, 1);
    GB.sprite = Assets.Avatar;

    G.Append(GA);
    GA.Append(GB);
}