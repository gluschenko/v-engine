function CameraFollowScript(GO) {

    function Start() {

    }

    function Update() {
        var Player = GameObject.Find("Player");

        if (Player) {
            GO.position = Vector2.Lerp(GO.position, Player.position, Time.deltaTime * 2);
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