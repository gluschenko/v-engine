Light = new function () {

    var Map = null;

    var Enabled = false; //true
    var ShadowsEnabled = true;

    var Scale = 4;

    //
    var GameObjects = [];

    var DarknessColor = new Color4(0, 0, 0, 0.9);
    
    var UpdateTime = 0.033;
    var Timer = 0;

    function Update() {
        this.Timer += Time.deltaTime;

        if (this.Timer > this.UpdateTime && Light.Enabled) {
            Light.GameObjects = GameObject.All();
            Light.UpdateMap();

            this.Timer = 0;
        }

        if (Light.Map) GUI.DrawTexture(new Rect(0, 0, Screen.width, Screen.height), Light.Map);
    }

    function UpdateMap() {

        if (!SceneData.mainCamera) return;
        //
        var MapX = Math.ceil(Screen.width / Light.Scale);
        var MapY = Math.ceil(Screen.height / Light.Scale);

        GraphicsBuffer.Apply(MapX, MapY);

        var DataImage = GraphicsBuffer.CreateImageData(MapX, MapY);
        var Data = DataImage.data;

        //Буфер коллайдеров, переведенных на Screen Thread
        var ColliderBuffer = [];

        if (Light.ShadowsEnabled) {
            for (var g = 0; g < this.GameObjects.length; g++) {

                var isVisible = this.GameObjects[g].screenPosition.x > 0 &&
                    this.GameObjects[g].screenPosition.x < Screen.width &&
                    this.GameObjects[g].screenPosition.y > 0 &&
                    this.GameObjects[g].screenPosition.y < Screen.height;

                if (this.GameObjects[g].collider.enabled && this.GameObjects[g].castShadows && isVisible) {
                    var GC = this.GameObjects[g].rigidbody.globalCollider;

                    var ScreenCollider = [];
                    for (var c = 0; c < GC.length; c++) {
                        ScreenCollider[ScreenCollider.length] = SceneData.mainCamera.camera.WorldToScreen(GC[c]);
                    }
                    ScreenCollider[ScreenCollider.length] = ScreenCollider[0];
                    //
                    ColliderBuffer[ColliderBuffer.length] = ScreenCollider;
                }
            }
        }
        //

        var IncX = 0;
        var IncY = 0;

        for (var x = 0; x < Screen.width; x += this.Scale) {
            for (var y = 0; y < Screen.height; y += this.Scale) {

                var o = Light.DarknessColor;

                var PointColor = Light.DarknessColor;

                for (var i = 0; i < this.GameObjects.length; i++) {
                    var GO = this.GameObjects[i];

                    if (GO.light.enabled) {
                        
                        var Dist = Vector2.Distance(new Vector2(x, y), GO.screenPosition);
                        var MaxDist = GO.light.radius * Graphics.PixelsPerMeter * SceneData.mainCamera.camera.scale;
                        
                        if (Dist < MaxDist) {
                            var BlendRatio = Math.sqrt(Dist) / Math.sqrt(MaxDist);
                            o = PointColor = Color4.Lerp(GO.light.color, PointColor, BlendRatio); //GO.light.color;
                            //
                            if (Light.ShadowsEnabled) {

                                for (var c = 0; c < ColliderBuffer.length; c++) {
                                    var BS = Geometry.BoundingSphere(ColliderBuffer[c]);

                                    if (Geometry.RaySphereIntersects(BS, GO.screenPosition, new Vector2(x, y))) {
                                        for (var gc = 0; gc < ColliderBuffer[c].length - 1; gc++) {
                                            if (Geometry.Intersected([GO.screenPosition, new Vector2(x, y)], [ColliderBuffer[c][gc], ColliderBuffer[c][gc + 1]])) {
                                                o = PointColor = Color4.Lerp(Light.DarknessColor, o, BlendRatio);
                                                break;
                                            }
                                        }
                                    }
                                    
                                }

                            }
                            
                        }
                        

                    }
                }

                //
                var pix = (IncX + IncY * DataImage.width) * 4;
                //
                Data[pix + 0] = o.r;
                Data[pix + 1] = o.g;
                Data[pix + 2] = o.b;
                Data[pix + 3] = Math.floor(o.a * 255);
                //
                IncY++;
            }
            //
            IncY = 0;
            IncX++;
        }

        GraphicsBuffer.PutImageData(DataImage);
        //GraphicsBuffer.Blur(10);

        Light.Map = GraphicsBuffer.GetBuffer("LightMap");
    }
    //
    return {
        Map: Map,
        Scale: Scale,
        Enabled: Enabled,
        ShadowsEnabled: ShadowsEnabled,
        GameObjects: GameObjects,
        DarknessColor: DarknessColor,
        UpdateTime: UpdateTime,
        Timer: Timer,
        Update: Update,
        UpdateMap: UpdateMap,
    }
}();

function LightSource(GO) {
    this.enabled = false;
    this.GO = GO;
    this.radius = 3;
    this.color = new Color4(255, 255, 255, 0);
}