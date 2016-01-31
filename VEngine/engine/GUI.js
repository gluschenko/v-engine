GUIColors = {
    orange: Color4.toRGBA("#f39c11"),
    orangeHover: Color4.toRGBA("#f5b517"),
    green: Color4.toRGBA("#2dcc70"),
    greenHover: Color4.toRGBA("#58d68d"),
    red: Color4.toRGBA("#e84c3d"),
    redHover: Color4.toRGBA("#ee6f66"),
    blue: Color4.toRGBA("#3598db"),
    blueHover: Color4.toRGBA("#5cade2"),
    white: Color4.toRGBA("#fff"),
    whiteHover: Color4.toRGBA("#eee"),
    gray: Color4.toRGBA("#494a45"),
    grayHover: Color4.toRGBA("#676862"),

    disabled: new Color4(255, 255, 255, 0.5),
    transparent: new Color4(255, 255, 255, 0),
};

//

GUI = new function () {

    var skin = new GUISkin();
    var customSkin = new CustomSkin();
    //
    var Enabled = true;
    //
    var textOffset = 0;
    var selectedLength = 0;
    var selectedId = "";
    //
    var Clicked = false;
    //
    function Update() {

        if (GUI.selectedId != "") {
            if (Input.GetKeyDown(KeyCode.RightArrow)) {
                if (GUI.textOffset < GUI.selectedLength) GUI.textOffset++;
            }

            if (Input.GetKeyDown(KeyCode.LeftArrow)) {
                if(GUI.textOffset > 0)GUI.textOffset--;
            }
        }


        GUI.Clicked = false;
    }

    function Label(rect, text, style) {
        if (!style) style = GUI.skin.label;

        Engine.Context.font = style.fontSize + "px " + style.font;
        Engine.Context.fillStyle = style.color;
        Engine.Context.fillText(text, rect.x, rect.y + style.fontSize / 1.5);
    }

    function Button(rect, text, style) {
        if (!style) style = GUI.skin.button;

        var hover = GUI.Over(rect);
        var active = false;
        var pressed = false;

        if (hover) {
            active = Input.GetKey(KeyCode.Mouse0);
            pressed = Input.GetKeyUp(KeyCode.Mouse0) && !GUI.Clicked;
            //
            if (pressed) GUI.Clicked = true;
        }
        //
        if (!active) {
            if (!hover) GUI.DrawBox(rect, style.radius, style.back);
            else GUI.DrawBox(rect, style.radius, style.backHover);
        }
        else {
            GUI.DrawBox(rect, style.radius, style.backActive);
        }
        //
        Engine.Context.font = style.fontSize + "px " + style.font;

        GUI.Label(new Rect(rect.x + rect.width / 2 - Engine.Context.measureText(text).width/2, rect.y + rect.height / 2 - (style.fontSize / 1.5) / 2, 0, 0), text, style);
        //
        return pressed;
    }

    function Box(rect, text, style) {
        if (!style) style = GUI.skin.box;

        GUI.DrawBox(rect, style.radius, style.back);
        //
        Engine.Context.font = style.fontSize + "px " + style.font;

        GUI.Label(new Rect(rect.x + rect.width / 2 - Engine.Context.measureText(text).width / 2, rect.y + style.fontSize / 2, 0, 0), text, style);
    }

    function TextBox(rect, id, text, max, password, style) { //Всё работает на чёртовой магии
        if (!password) password = false;
        if (!style) style = GUI.skin.textBox;

        var hover = GUI.Over(rect);
        var selected = (id == GUI.selectedId);
        //
        if (Input.GetKeyDown(KeyCode.Mouse0)) { //Сброс выделения (при клике мимо)
            GUI.selectedId = "";
        }

        if (hover) {
            if (Input.GetKey(KeyCode.Mouse0)) { //Выделение
                GUI.selectedId = id;
                GUI.selectedLength = text.length;
                GUI.textOffset = GUI.selectedLength;
            }
        }

        if (selected) { //Ввод
            GUI.selectedLength = text.length;//Сообщаем пространсту длину строки

            if (Input.currentKey) {
                var charCode = Input.currentEvent.which || Input.currentEvent.keyCode; //Input.currentEvent.charCode; - в далеком будущем можно будет так

                //console.log(Input.currentEvent);

                var newchar = String.fromCharCode(charCode);//Получаем символ в верхнем регистре
                if (!Input.GetKey(KeyCode.Shift)) newchar = newchar.toLowerCase();//Переводим в нижний регистр, если не нажата Shift

                if (!Input.GetKey(KeyCode.Backspace)) {
                    if (Input.currentKey.writable && text.length <= max) {
                        text = text.Insert(GUI.textOffset, 0, newchar);
                        GUI.textOffset++;
                    }
                }
                else {
                    if (GUI.textOffset > 0) {
                        text = text.Cut(GUI.textOffset - 1, GUI.textOffset);
                        GUI.textOffset--;
                    }
                }
            }
        }
        //

        if (hover || selected) {
            GUI.DrawBox(rect, style.radius, style.backHover);
        }
        else {
            GUI.DrawBox(rect, style.radius, style.back);
        }
        //
        var output = text;
        if (password) output = text.replace(new RegExp(".", "g"), "•");
        //
        Engine.Context.font = style.fontSize + "px " + style.font;
        var textWidth = Engine.Context.measureText(output).width;
        var textHeigth = style.fontSize / 1.5;

        var textRect = new Rect(rect.x + rect.width / 2 - textWidth / 2, rect.y + rect.height / 2 - textHeigth / 2, 0, 0);
        GUI.Label(textRect, output, style);

        if (selected) {
            var cursorOffset = Engine.Context.measureText(output.substr(0, GUI.textOffset)).width;

            GUI.DrawQuad(new Rect(textRect.x + cursorOffset - 1, textRect.y - 3, 1, textHeigth + 6), style.color);
        } 

        //
        return text;
    }

    //

    function DrawTexture(rect, asset, clip) { //рисует текстуру
        if (!clip) clip = new Rect(0, 0, 1, 1);

        if (asset) {
            if (asset.data) {
                var image = asset.data;

                if (image.width > 0 && image.height > 0) {
                    var clipStartX = image.width * clip.x;
                    var clipStartY = image.height * clip.y;
                    var clipEndX = image.width * clip.width;
                    var clipEndY = image.height * clip.height;

                    Engine.Context.drawImage(image, clipStartX, clipStartY, clipEndX, clipEndY, rect.x, rect.y, rect.width, rect.height);
                    return;
                }
            }
        }

        GUI.DrawQuad(rect, "#f0f");
    }

    //

    function DrawElement(rect, text, style) {
        //Когда-нибудь надо будет перевести весь GUI на единую систему элементов
    }

    function DrawBox(rect, radius, color) {  //Коробка с возможностью скрубления при radius > 0
        if (rect.width < rect.height) {
            if (radius > rect.width / 2) radius = rect.width / 2;
        }
        else {
            if (radius > rect.height / 2) radius = rect.height / 2;
        }
        //
        Engine.Context.fillStyle = color;

        if (radius > 0) {
            Engine.Context.beginPath();

            Engine.Context.arc(rect.x + radius, rect.y + radius, radius, 0, Math.PI * 2);
            Engine.Context.fill();

            Engine.Context.arc(rect.x + rect.width - radius, rect.y + radius, radius, 0, Math.PI * 2);
            Engine.Context.fill();

            Engine.Context.arc(rect.x + radius, rect.y + rect.height - radius, radius, 0, Math.PI * 2);
            Engine.Context.fill();

            Engine.Context.arc(rect.x + rect.width - radius, rect.y + rect.height - radius, radius, 0, Math.PI * 2);
            Engine.Context.fill();
        }

        Engine.Context.fillRect(rect.x, rect.y + radius, rect.width, rect.height - (radius * 2));
        Engine.Context.fillRect(rect.x + radius, rect.y, rect.width - (radius * 2), rect.height);
    }

    function DrawQuad(rect, color) { //Коробка без скруглений
        Engine.Context.fillStyle = color;
        Engine.Context.fillRect(rect.x, rect.y, rect.width, rect.height);
    }

    function DrawFrame(rect, color) { //рисует рамку
        Engine.Context.strokeStyle = color;
        Engine.Context.strokeRect(rect.x, rect.y, rect.width, rect.height);
    }

    function DrawLine(A, B, color) { //Рисует линию (давно пора)
        Engine.Context.beginPath();

        Engine.Context.strokeStyle = color;
        Engine.Context.moveTo(A.x, A.y);
        Engine.Context.lineTo(B.x, B.y);

        Engine.Context.stroke();
    }

    function Over(rect) { //true, когда курсор внутри
        if (Input.mousePosition.x > rect.x && Input.mousePosition.y > rect.y) {
            if (Input.mousePosition.x < rect.x + rect.width && Input.mousePosition.y < rect.y + rect.height) {
                return true;
            }
        }
        return false;
    }

    //
    return {
        skin: skin,
        customSkin: customSkin,
        Enabled: Enabled,
        textOffset: textOffset,
        selectedLength: selectedLength,
        selectedId: selectedId,
        Clicked: Clicked,
        Update: Update,
        Label: Label,
        Button: Button,
        Box: Box,
        TextBox: TextBox,
        DrawTexture: DrawTexture,
        DrawElement: DrawElement,
        DrawBox: DrawBox,
        DrawQuad: DrawQuad,
        DrawFrame: DrawFrame,
        DrawLine: DrawLine,
        Over: Over,
    }
}();

//

function Rect(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

Rect.prototype.isVisible = function () {
    return (this.x < Screen.width && this.y < Screen.height && this.x + this.width > 0 && this.y + this.height > 0);
};
//

function GUIStyle() {
    this.color = GUIColors.gray;
    this.font = "Arial";
    this.fontSize = 14;
    this.radius = 8;
    this.back = GUIColors.transparent;
    this.backHover = GUIColors.transparent;
    this.backActive = GUIColors.transparent;
}

function GUISkin() { //Стандартный набор стилей
    //
    this.label = new GUIStyle();
    //
    this.button = new GUIStyle();
    this.button.color = GUIColors.white;
    this.button.back = GUIColors.orange;
    this.button.backHover = GUIColors.orangeHover;
    this.button.backActive = GUIColors.orange;
    //
    this.box = new GUIStyle();
    this.box.color = GUIColors.gray;
    this.box.back = GUIColors.white;
    //
    this.textBox = new GUIStyle();
    this.textBox.color = GUIColors.white;
    this.textBox.back = GUIColors.green;
    this.textBox.backHover = GUIColors.greenHover;
    this.textBox.backActive = GUIColors.green;
    //
}

function CustomSkin() { //Набор стилей, которые прикладываются последним аргументом при рисовании элементов
    //
    this.freeLabel = new GUIStyle();
    this.freeLabel.color = GUIColors.white;
    //
    this.radialButton = new GUIStyle();
    this.radialButton.color = GUIColors.white;
    this.radialButton.back = GUIColors.orange;
    this.radialButton.backHover = GUIColors.orangeHover;
    this.radialButton.backActive = GUIColors.orange;
    this.radialButton.radius = 3000;
    //
    this.whiteButton = new GUIStyle();
    this.whiteButton.color = GUIColors.gray;
    this.whiteButton.back = GUIColors.white;
    this.whiteButton.backHover = GUIColors.whiteHover;
    this.whiteButton.backActive = GUIColors.whiteHover;
    //
    this.greenButton = new GUIStyle();
    this.greenButton.color = GUIColors.white;
    this.greenButton.back = GUIColors.green;
    this.greenButton.backHover = GUIColors.greenHover;
    this.greenButton.backActive = GUIColors.green;
    //
    this.redButton = new GUIStyle();
    this.redButton.color = GUIColors.white;
    this.redButton.back = GUIColors.red;
    this.redButton.backHover = GUIColors.redHover;
    this.redButton.backActive = GUIColors.red;
    //
}


//Legacy
/*function GUIColors() {
    return {
        orange: "#f39c11",
        orangeHover: "#f5b517",
        green: "#2dcc70",
        greenHover: "#58d68d",
        red: "#e84c3d",
        redHover: "#ee6f66",
        blue: "#3598db",
        blueHover: "#5cade2",
        white: "#fff",
        whiteHover: "#eee",
        gray: "#494a45",
        grayHover: "#676862",
    };
}*/

/*function GUISkin() {
    return {
        label: {
            font: "Arial",
            fontSize: 14,
            color: GUIColors().gray,
        },
        button: {
            font: "Arial",
            fontSize: 14,
            color: "#fff",
            radius: 8,
            back: GUIColors().orange,
            backHover: GUIColors().orangeHover,
            backActive: GUIColors().orange,
        },
        box: {
            font: "Arial",
            fontSize: 14,
            color: GUIColors().gray,
            radius: 8,
            back: GUIColors().white,
        },
        textBox: {
            font: "Arial",
            fontSize: 14,
            color: GUIColors().white,
            radius: 8,
            back: GUIColors().green,
            backHover: GUIColors().greenHover,
        },
    }
}*/

/*function CustomGUISkin() {
    return {
        freeLabel: {
            font: "Arial",
            fontSize: 14,
            color: GUIColors().white,
        },
    }
}*/