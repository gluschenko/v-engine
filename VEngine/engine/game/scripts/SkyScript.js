function SkyScript(GO) {

    var Timer = 0;
    var Blend = 0;

    //
    var Atmosphere;
    var SunPivot;
    var MoonPivot;
    var Stars;
    var Clouds;
    //
    var Night = false;
    var Morning = false;
    var Day = false;
    var Evening = false;
    //

    function Start() {
        this.Timer = GameData.CurrentMap.data.Get("DayTime", 0);
    }

    function Update() {
        GO.position = GameObject.Find("MainCamera").globalPosition;
        //
        Timer += Time.deltaTime * (1/60);
        if (Timer > 1) Timer = 0;
        //
        Night = Timer >= 0 && Timer < 1 / 4;
        Morning = Timer >= 1 / 4 && Timer < 2 / 4;
        Day = Timer >= 2 / 4 && Timer < 3 / 4;
        Evening = Timer >= 3 / 4 && Timer < 1;
        //
        if (Night) Blend = 0;
        if (Morning) Blend = (Timer - 1 / 4) * 4;
        if (Day) Blend = 1;
        if (Evening) Blend = 1 - ((Timer - 3 / 4) * 4);
        //
        GameObject.Find("SunMoonPivot").rotation = 360 * (1 - Timer);
        GameObject.Find("Stars").spriteAlpha = Math.pow((1 - Blend), 3);
        GameObject.Find("SunsetGrad").spriteAlpha = Math.pow((1 - Blend) * Blend * 4, 2); //Магия матана

        SceneData.background = Color4.Lerp(new Color4(0, 14, 59, 1), new Color4(0, 163, 234, 1), Blend);
    }

    function LateUpdate() {

    }

    function OnGUI() {
        //GUI.Label(new Rect(50, 50, 100, 100), "Bl: " + (((1 - Blend) * Blend) * 4), GUI.customSkin.freeLabel);
    }

    return {
        Timer: Timer,
        Blend: Blend,
        Night: Night,
        Morning: Morning,
        Day: Day,
        Evening: Evening,
        Start: Start,
        Update: Update,
        LateUpdate: LateUpdate,
        OnGUI: OnGUI,
    }

}