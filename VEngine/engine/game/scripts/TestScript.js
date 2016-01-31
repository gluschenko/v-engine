function TestScript(GO) {
    //this.GO = GO;

    function Start() {
        //Debug.Log("Start");
    }

    function Update() {
        //Debug.Log("Update");

        /*if(Input.GetKey(KeyCode.D)){
            GO.position.x += Time.deltaTime;
        }

        if (Input.GetKey(KeyCode.A)) {
            GO.position.x -= Time.deltaTime;
        }

        if (Input.GetKey(KeyCode.W)) {
            GO.position.y += Time.deltaTime;
        }

        if (Input.GetKey(KeyCode.S)) {
            GO.position.y -= Time.deltaTime;
        }*/
    }

    function LateUpdate() {
        //Debug.Log("LateUpdate");
    }

    function OnGUI() {
        //GUI.DrawTexture(new Rect(0, 0, Screen.width, Screen.height), IAssets.GetData("test3"));

        /*GUI.Box(new Rect(Screen.width / 2 - 100, Screen.height / 2 - 100, 200, 200), "Menu");

        if (GUI.Button(new Rect(Screen.width / 2 - 90, Screen.height / 2 - 70, 180, 40), "Play")) {
            
        }
        if(GUI.Button(new Rect(Screen.width / 2 - 90, Screen.height / 2 - 20, 180, 40), "Settings")){
            
        }
        if (GUI.Button(new Rect(Screen.width / 2 - 90, Screen.height / 2 + 30, 180, 40), "Log out")) {
            
        }*/
    }

    return {
        Start: Start,
        Update: Update,
        LateUpdate: LateUpdate,
        OnGUI: OnGUI,
    }

}