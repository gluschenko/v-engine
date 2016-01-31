function GameCameraScript(GO) {

    function Start() {

    }

    function Update() {
        var speedRatio = 10;
        if (Input.GetKey(KeyCode.Shift)) speedRatio = 20;

        if (Input.GetKey(KeyCode.W) || Input.GetKey(KeyCode.UpArrow)) {
            GO.Translate(new Vector2(0, 1), Time.deltaTime * speedRatio);
        }

        if (Input.GetKey(KeyCode.S) || Input.GetKey(KeyCode.DownArrow)) {
            GO.Translate(new Vector2(0, -1), Time.deltaTime * speedRatio);
        }

        if (Input.GetKey(KeyCode.D) || Input.GetKey(KeyCode.RightArrow)) {
            GO.Translate(new Vector2(1, 0), Time.deltaTime * speedRatio);
        }

        if (Input.GetKey(KeyCode.A) || Input.GetKey(KeyCode.LeftArrow)) {
            GO.Translate(new Vector2(-1, 0), Time.deltaTime * speedRatio);
        }

        if (Input.GetKey(KeyCode.E)) {
            GO.Rotate(-1, Time.deltaTime * speedRatio * 15);
        }

        if (Input.GetKey(KeyCode.Q)) {
            GO.Rotate(1, Time.deltaTime * speedRatio * 15);
        }

        if (Input.GetKey(KeyCode.Minus)) {
            if (SceneData.mainCamera.camera.scale > 0.01) SceneData.mainCamera.camera.scale *= 0.99;
        }

        if (Input.GetKey(KeyCode.Equal)) {
            SceneData.mainCamera.camera.scale *= 1.01;
        }

        //
        
        if (Input.GetKey(KeyCode.Mouse0)) GameObject.Find("TestObj7").position = SceneData.mainCamera.camera.ScreenToWorld(Input.mousePosition);

        //

        /*var i = 0;
        for (var x = 0; x < 10; x++) {
            for (var y = 0; y < 10; y++) {

                var G = IGameObject.Find("Obj" + i);
                G.Rotate(1, Time.deltaTime * i);

                i++;
            }
        }*/

        /*BerettaTimer += Time.deltaTime;

        if (BerettaTimer > 0.15)
        {
            G = IGameObject.Instantiate("Illuminati");
            G.scale = new Vector2(1.5, 1.5);
            G.position = IGameObject.Find("Spawner").globalPosition;
            G.rotation = IGameObject.Find("Spawner").globalRotation;
            G.sprite = IAssets.GetData("illuminati");

            BerettaTimer = 0;
        }

        var Ills = IGameObject.FindObjects("Illuminati");

        for (var i = 0; i < Ills.length; i++)
        {
            Ills[i].Translate(new Vector2(1, 0), Time.deltaTime * 2);
        }

        var G = IGameObject.Find("Beretta");
        G.Rotate(-1, Time.deltaTime * 150);*/


    }

    function LateUpdate() {

    }

    function OnGUI() {
        if (GUI.Button(new Rect(Screen.width - 315, Screen.height - 45, 100, 40), "Menu")) {
            MenuScene();
        }

        if (GUI.Button(new Rect(Screen.width - 210, Screen.height - 45, 100, 40), "Dev")) {
            DevScene();
        }

        if (GUI.Button(new Rect(Screen.width - 105, Screen.height - 45, 100, 40), "Debug")) {
            Debug.boundsEnabled = !Debug.boundsEnabled;
        }

        //GUI.Button(new Rect(Input.mousePosition.x, Input.mousePosition.y, 10, 10), "");
    }

    return {
        Start: Start,
        Update: Update,
        LateUpdate: LateUpdate,
        OnGUI: OnGUI,
    }

}