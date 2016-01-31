IGameObject = new function () {

    //Creates a new GameObject
    function Instantiate(name) {
        var GO = new GameObject();
        GO.name = name;

        return IGameObject.InstantiateGO(GO);
    }

    function InstantiateGO(GO) {
        SceneData.GameObjects[SceneData.GameObjects.length] = GO;
        return GO;
    }

    function CreateCamera(name, main) {
        var Cam = IGameObject.Instantiate(name);
        Cam.camera.enabled = true;
        Cam.camera.main = main;
        Cam.layer = 100;
        //
        return Cam;
    }

    function Append(GO, parentGO) { //Legacy
        IGameObject.Remove(GO, GO.parent);

        if (!GO.parent && parentGO) {
            GO.parent = parentGO;
            parentGO.children[parentGO.children.length] = GO;
        }
    }

    function Remove(GO, parentGO) { //Legacy
        if (GO.parent) {
            GO.parent = null;

            for (var i = 0; i < parentGO.children.length; i++) {
                if (parentGO.children[i] == GO) {
                    parentGO.children.splice(i, 1);
                }
            }
        }
    }

    function Find(name) {
        for (var i = 0; i < SceneData.GameObjects.length; i++) {
            if (SceneData.GameObjects[i].name == name) {
                return SceneData.GameObjects[i];
            }
        }
        return false;
    }

    function FindObjects(name) {
        var arr = new Array(0);

        for (var i = 0; i < SceneData.GameObjects.length; i++) {
            if (SceneData.GameObjects[i].name == name) {
                arr[arr.length] = SceneData.GameObjects[i];
            }
        }
        return arr;
    }

    //

    function getGlobalPosition(GO) {
        var parent = GO; //Сам себе родитель, лол
        var pos = new Vector2(0, 0);

        while (parent != null) {
            var scale = new Vector2(1, 1); //чтобы GO не скейлил собственное пространство
            if (parent.parent != null) scale = IGameObject.getGlobalScale(parent.parent);

            pos = new Vector2(pos.x + (parent.position.x * scale.x), pos.y + (parent.position.y * scale.y));
            parent = parent.parent;
        }


        return pos;
    }

    function getGlobalRotation(GO) {
        var parent = GO;
        var rot = 0;

        while (parent != null) {
            rot = rot + parent.rotation;
            parent = parent.parent;
        }

        return rot;
    }

    function getParentPosition(GO) {
        if (GO.parent) {
            return IGameObject.getGlobalPosition(GO.parent);
        }

        return IGameObject.getGlobalPosition(GO);
    }

    function getParentRotation(GO) {
        if (GO.parent) {
            return IGameObject.getGlobalRotation(GO.parent);
        }

        return IGameObject.getGlobalRotation(GO);
    }

    function getParentRotatedPosition(GO) {
        var parent = GO.parent;
        var pos = IGameObject.getGlobalPosition(GO);

        while (parent != null) {
            pos = Vector2.RotateAround(pos, IGameObject.getGlobalPosition(parent), parent.rotation);
            parent = parent.parent;
        }

        return pos;
    }

    function getGlobalScale(GO) {
        var parent = GO; //Сам себе родитель, лол
        var scale = new Vector2(1, 1);

        while (parent != null) {
            scale = new Vector2(scale.x * parent.scale.x, scale.y * parent.scale.y);
            parent = parent.parent;
        }

        return scale;
    }

    function getGlobalActive(GO) {
        var parent = GO; //Сам себе родитель, лол
        var active = GO.active;

        while (parent != null) {
            if (!parent.active) return false;
            parent = parent.parent;
        }

        return active;
    }

    //
    return { //Весь интерфейс необходимо перевести в legacy (В будущем придется выпилить все интерфейсы в двигателе. Они больше не нужны)
        Instantiate: Instantiate,
        InstantiateGO: InstantiateGO,
        CreateCamera: CreateCamera,
        Append: Append,
        Remove: Remove,
        Find: Find,
        FindObjects: FindObjects,
        getGlobalPosition: getGlobalPosition,
        getGlobalRotation: getGlobalRotation,
        getParentPosition: getParentPosition,
        getParentRotation: getParentRotation,
        getParentRotatedPosition: getParentRotatedPosition,
        getGlobalScale: getGlobalScale,
        getGlobalActive: getGlobalActive,
    }
}();


function GameObject() {
    //Пространственные
    this.active = true;
    this.name = "New Object";
    this.tag = "default";
    this.position = new Vector2(0, 0); //Метры
    this.rotation = 0; //Градусы
    this.scale = new Vector2(1, 1); //Масштаб
    this.globalActive = true;
    this.globalPosition = new Vector2(0, 0);
    this.globalRotation = 0;
    this.globalScale = new Vector2(1, 1);
    this.screenPosition = new Vector2(0, 0);
    this.layer = 0;
    this.offset = new Vector2(0.5, 0.5);
    this.clip = new Rect(0, 0, 1, 1);
    this.children = [];
    this.parent = null;
    //Навесные
    this.sprite = null;
    this.spriteAlpha = 1;
    this.visible = true;
    this.components = {};
    //Осветительные
    this.castShadows = true;
    this.receiveShadows = false;
    //Нативные компоненты
    this.collider = new Collider(this);
    this.camera = new Camera(this);
    this.light = new LightSource(this);
    this.rigidbody = new Rigidbody(this);
}

//

GameObject.Instantiate = function (name, params) {
    if (!params) params = new Object();

    var GO = new GameObject();
    GO.name = name;

    for (var e in params) {
        GO[e] = params[e];
    }

    return GameObject.InstantiateGO(GO);
};

GameObject.InstantiateGO = function (GO) {
    SceneData.GameObjects[SceneData.GameObjects.length] = GO;
    return GO;
};

GameObject.Destroy = function (GO) {
    SceneData.GameObjects.RemoveObj(GO);
};

GameObject.Find = function (name) { //Поиск объекта по имени
    for (var i = 0; i < SceneData.GameObjects.length; i++) {
        if (SceneData.GameObjects[i].name == name) {
            return SceneData.GameObjects[i];
        }
    }
    return false;
};

GameObject.FindObjects = function (name) { //Поиск объектов по имени
    var arr = new Array(0);

    for (var i = 0; i < SceneData.GameObjects.length; i++) {
        if (SceneData.GameObjects[i].name == name) {
            arr[arr.length] = SceneData.GameObjects[i];
        }
    }
    return arr;
};

GameObject.FindByTag = function (tag) { //Поиск объекта по тегу
    for (var i = 0; i < SceneData.GameObjects.length; i++) {
        if (SceneData.GameObjects[i].tag == tag) {
            return SceneData.GameObjects[i];
        }
    }
    return false;
};

GameObject.FindObjectsByTag = function (tag) { //Поиск объектов по тегу
    var arr = new Array(0);

    for (var i = 0; i < SceneData.GameObjects.length; i++) {
        if (SceneData.GameObjects[i].tag == tag) {
            arr[arr.length] = SceneData.GameObjects[i];
        }
    }
    return arr;
};

GameObject.All = function () { //Возвращает массив активных объектов
    var arr = new Array(0);

    for (var i = 0; i < SceneData.GameObjects.length; i++) {
        if (SceneData.GameObjects[i].active) {
            arr[arr.length] = SceneData.GameObjects[i];
        }
    }
    return arr;
};

//

GameObject.prototype.Apply = function () {
    this.globalActive = IGameObject.getGlobalActive(this);
    this.globalPosition = IGameObject.getParentRotatedPosition(this);
    this.globalRotation = IGameObject.getGlobalRotation(this);
    this.globalScale = IGameObject.getGlobalScale(this);
};

GameObject.prototype.AddComponent = function (name) {
    if (window[name]) {
        var obj = this.components[name] = new window[name](this);
        Engine.Call(obj, "Start");
    }
    else {
        Debug.Log(name + " is not exists!");
    }
};

GameObject.prototype.AddComponents = function (names) {
    for (var i = 0; i < names.length; i++) {
        this.AddComponent(names[i]);
    }
};

GameObject.prototype.GetComponent = function (name) {
    if (this.components[name]) {
        return this.components[name];
    }
    return false;
};

GameObject.prototype.Append = function (GO) {
    this.Remove(GO);

    if (!GO.parent) {
        GO.parent = this;
        this.children[this.children.length] = GO;
    }
};

GameObject.prototype.Remove = function (GO) {
    if (GO.parent) {
        GO.parent = null;

        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i] == GO) {
                this.children.splice(i, 1);
            }
        }
    }
};

GameObject.prototype.Move = function (pos) {
    this.position = pos;
}

GameObject.prototype.Translate = function (direction, speed) {
    direction = Vector2.Rotate(direction, this.rotation);//Поворачиваем направление на угол поворота объекта

    this.GlobalTranslate(direction, speed);
    this.Apply();
}

GameObject.prototype.GlobalTranslate = function (direction, speed) {
    var offset = new Vector2(direction.x * speed, direction.y * speed);

    this.position.x += offset.x;
    this.position.y += offset.y;

    this.Apply();
}

/*GameObject.prototype.TranslateTo = function (target, speed) { Нужно меньше натива
    //ХЗ
}*/

GameObject.prototype.Rotate = function (direction, speed) {
    this.rotation += direction * speed;

    this.Apply();
}

//

function Camera(GO) {
    this.enabled = false;
    this.GO = GO;
    this.main = false;
    this.scale = 1;
}

Camera.prototype.WorldToScreen = function (pos) {
    var deltaPos = new Vector2((pos.x - this.GO.globalPosition.x) * this.scale, (pos.y - this.GO.globalPosition.y) * this.scale);
    deltaPos = new Vector2(deltaPos.x * Graphics.PixelsPerMeter, deltaPos.y * Graphics.PixelsPerMeter);
    deltaPos = Vector2.Rotate(deltaPos, -this.GO.globalRotation);

    var x = deltaPos.x + (Screen.width / 2);
    var y = Screen.height - (deltaPos.y + (Screen.height / 2));

    return new Vector2(x, y);
}

Camera.prototype.ScreenToWorld = function (pos) {
    var deltaPos = new Vector2(pos.x - (Screen.width / 2), (Screen.height - pos.y) - (Screen.height / 2));
    var deltaPos = Vector2.Rotate(deltaPos, this.GO.globalRotation);

    var x = (deltaPos.x * (1 / Graphics.PixelsPerMeter)) * (1 / this.scale) + this.GO.globalPosition.x;
    var y = (deltaPos.y * (1 / Graphics.PixelsPerMeter)) * (1 / this.scale) + this.GO.globalPosition.y;

    return new Vector2(x, y);
}