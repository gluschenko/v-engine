Input = new function () {

    var mousePosition = new Vector2(-100, -100);

    var currentKey = null;
    var currentEvent = null;

    var eventTarget = null;

    function Start() {
        Engine.Canvas.addEventListener("mousemove", function (event) {
            Input.mousePosition = Input.getMousePosition(event);
        }, false);

        window.addEventListener("keydown", onKeyDown, true);
        window.addEventListener("keyup", onKeyUp, true);

        Engine.Canvas.addEventListener("mousedown", onKeyDown, true);
        Engine.Canvas.addEventListener("mouseup", onKeyUp, true);
    }

    function LateUpdate() {
        FlushKeys();
        //
        Input.currentKey = null;
    }

    function FlushKeys() {
        for (var item in KeyCode) {
            KeyCode[item].up = false;
            KeyCode[item].down = false;
        }
    }

    function FindKey(k) {
        for (var item in KeyCode) {
            if (KeyCode[item].key == k) {
                return KeyCode[item];
            }
        }

        return false;
    }

    function GetKey(kCode) {
        if (kCode != null) {
            return kCode.pressed;
        }
        return false;
    }

    function GetKeyUp(kCode) {
        if (kCode != null) {
            return kCode.up;
        }
        return false;
    }

    function GetKeyDown(kCode) {
        if (kCode != null) {
            return kCode.down;
        }
        return false;
    }

    function getMousePosition(moveEvent) {
        var rect = Engine.Canvas.getBoundingClientRect();

        var x = moveEvent.clientX - rect.left;
        var y = moveEvent.clientY - rect.top;

        return new Vector2(x, y);
    }

    function onKeyDown(keyEvent) {
        var k = keyEvent.keyCode || keyEvent.button;

        var key = Input.FindKey(k);

        if (key !== false) {
            if (!key.pressed) {
                key.pressed = true;
                key.down = true;
                //
                Input.currentKey = key;
                Input.currentEvent = keyEvent;
            }
        }

        //Отменяем воздействие всего, кроме мышки
        if (k != 0 && k != 1 && k != 2) keyEvent.preventDefault();
    }

    function onKeyUp(keyEvent) {
        var k = keyEvent.keyCode || keyEvent.button;

        var key = Input.FindKey(k);

        if (key !== false) {
            key.pressed = false;
            key.up = true;
            //
            Input.currentKey = null;
            Input.currentEvent = null;
        }

        keyEvent.preventDefault();
    }

    //
    return {
        mousePosition: mousePosition,
        currentKey: currentKey,
        currentEvent: currentEvent,
        Start: Start,
        LateUpdate: LateUpdate,
        FlushKeys: FlushKeys,
        FindKey: FindKey,
        GetKey: GetKey,
        GetKeyUp: GetKeyUp,
        GetKeyDown: GetKeyDown,
        getMousePosition: getMousePosition,
        onKeyUp: onKeyUp,
        onKeyDown: onKeyDown,
    }
}();

function KeyObject(k, writable) {
    if (!writable) writable = false;
    //
    this.key = k;
    this.writable = writable;
    this.pressed = false;
    this.down = false;
    this.up = false;
}

var KeyCode = new function () {
    return {
        Mouse0: new KeyObject(0),
        Mouse2: new KeyObject(1),
        Mouse1: new KeyObject(2),
        Backspace: new KeyObject(8),
        Tab: new KeyObject(9),
        Enter: new KeyObject(13),
        Shift: new KeyObject(16),
        Control: new KeyObject(17),
        Alt: new KeyObject(18),
        Break: new KeyObject(19),
        CapsLock: new KeyObject(20),
        Escape: new KeyObject(27),
        Space: new KeyObject(32, true),
        PageUp: new KeyObject(33),
        PageDown: new KeyObject(34),
        End: new KeyObject(35),
        Home: new KeyObject(36),
        LeftArrow: new KeyObject(37),
        UpArrow: new KeyObject(38),
        RightArrow: new KeyObject(39),
        DownArrow: new KeyObject(40),
        Insert: new KeyObject(45),
        Delete: new KeyObject(46),
        Alpha0: new KeyObject(48, true),
        Alpha1: new KeyObject(49, true),
        Alpha2: new KeyObject(50, true),
        Alpha3: new KeyObject(51, true),
        Alpha4: new KeyObject(52, true),
        Alpha5: new KeyObject(53, true),
        Alpha6: new KeyObject(54, true),
        Alpha7: new KeyObject(55, true),
        Alpha8: new KeyObject(56, true),
        Alpha9: new KeyObject(57, true),
        A: new KeyObject(65, true),
        B: new KeyObject(66, true),
        C: new KeyObject(67, true),
        D: new KeyObject(68, true),
        E: new KeyObject(69, true),
        F: new KeyObject(70, true),
        G: new KeyObject(71, true),
        H: new KeyObject(72, true),
        I: new KeyObject(73, true),
        J: new KeyObject(74, true),
        K: new KeyObject(75, true),
        L: new KeyObject(76, true),
        M: new KeyObject(77, true),
        N: new KeyObject(78, true),
        O: new KeyObject(79, true),
        P: new KeyObject(80, true),
        Q: new KeyObject(81, true),
        R: new KeyObject(82, true),
        S: new KeyObject(83, true),
        T: new KeyObject(84, true),
        U: new KeyObject(85, true),
        V: new KeyObject(86, true),
        W: new KeyObject(87, true),
        X: new KeyObject(88, true),
        Y: new KeyObject(89, true),
        Z: new KeyObject(90, true),
        LeftWin: new KeyObject(91),
        RightWin: new KeyObject(92),
        Select: new KeyObject(93),
        Numpad0: new KeyObject(96, true),
        Numpad1: new KeyObject(97, true),
        Numpad2: new KeyObject(98, true),
        Numpad3: new KeyObject(99, true),
        Numpad4: new KeyObject(100, true),
        Numpad5: new KeyObject(101, true),
        Numpad6: new KeyObject(102, true),
        Numpad7: new KeyObject(103, true),
        Numpad8: new KeyObject(104, true),
        Numpad9: new KeyObject(105, true),
        Multiply: new KeyObject(106),
        Add: new KeyObject(107),
        Subsract: new KeyObject(109),
        DecimalPoint: new KeyObject(110),
        Divide: new KeyObject(111),
        F1: new KeyObject(112),
        F2: new KeyObject(113),
        F3: new KeyObject(114),
        F4: new KeyObject(115),
        F5: new KeyObject(116),
        F6: new KeyObject(117),
        F7: new KeyObject(118),
        F8: new KeyObject(119),
        F9: new KeyObject(120),
        F10: new KeyObject(121),
        F11: new KeyObject(122),
        F12: new KeyObject(123),
        NumLock: new KeyObject(144),
        ScrollLock: new KeyObject(145),
        Semicolon: new KeyObject(186),
        Equal: new KeyObject(187),
        Comma: new KeyObject(188),
        Minus: new KeyObject(189),
        Period: new KeyObject(190),
        ForwardSlash: new KeyObject(191),
        GraveAccent: new KeyObject(192),
        OpenBracket: new KeyObject(219),
        BackSlash: new KeyObject(220),
        CloseBraket: new KeyObject(221),
        SingleQuote: new KeyObject(222),
    }
}();