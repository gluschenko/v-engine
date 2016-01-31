var SceneData = null;

function Scene(name) {
    this.id = 0;
    this.name = name;
    this.background = "#789ebe";
    this.GameObjects = [];
    //
    this.mainCamera = null;
    //
    this.AmbientColor = new Color4(255, 255, 255, 0);
}

Scene.prototype.getMainCamera = function () {
    var camera = null;

    for (var i = 0; i < this.GameObjects.length; i++) {
        if (this.GameObjects[i].camera.enabled) {
            camera = this.GameObjects[i];
            if (camera.camera.main) return camera;
        }
    }

    return camera;
};

IScene = new function () {

    function LoadLevel(scene) {
        SceneData = null;

        if (scene) {
            SceneData = scene;
            return true;
        }
        return false;
    }

    //
    return {
        LoadLevel: LoadLevel,
    }
}();

