function PlayerScript(GO) {
    

    function Start() {

    }

    function Update() {
        var Direction = new Vector2(0, 0);
        var Speed = 6;
        //
        var W = Input.GetKey(KeyCode.W) || Input.GetKey(KeyCode.UpArrow);
        var S = Input.GetKey(KeyCode.S) || Input.GetKey(KeyCode.DownArrow);
        var A = Input.GetKey(KeyCode.A) || Input.GetKey(KeyCode.LeftArrow);
        var D = Input.GetKey(KeyCode.D) || Input.GetKey(KeyCode.RightArrow);
        
        GO.sprite = Assets.PlayerIdle;

        if (W) {
            Direction = new Vector2(0, 1);
            GO.Translate(Direction, Time.deltaTime * Speed);
        }

        if (S) {
            /*Direction = new Vector2(0, -1);
            GO.Translate(Direction, Time.deltaTime * Speed);*/
        }

        if (A) {
            Direction = new Vector2(-0.3, 0);
            GO.Translate(Direction, Time.deltaTime * Speed);

            GO.scale = new Vector2(-1, GO.scale.y);
        }

        if (D) {
            Direction = new Vector2(0.3, 0);
            GO.Translate(Direction, Time.deltaTime * Speed);

            GO.scale = new Vector2(1, GO.scale.y);
        }
    }

    function LateUpdate() {

    }

    function OnGUI() {

    }

    return {
        Start: Start,
        Update: Update,
        LateUpdate: LateUpdate,
        OnGUI: OnGUI,
    }

}