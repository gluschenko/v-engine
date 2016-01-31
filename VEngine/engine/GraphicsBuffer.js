//Графический буфер. Предназначен для процедурной обработки текстур (процесс асинхронный, происходит на стороне вёрстки)
GraphicsBuffer = GB = new function () {

    var width = 0;
    var height = 0;

    function Apply(w, h) {
        GraphicsBuffer.width = w;
        GraphicsBuffer.height = h;
        Engine.Buffer.width = GraphicsBuffer.width;
        Engine.Buffer.height = GraphicsBuffer.height;
        //
        GraphicsBuffer.Clear();
    }

    function GetBufferImage() { //Картинку изображение из буфера
        var BaseData = Engine.Buffer.toDataURL("image/png");
        var ProcImage = new Image();
        ProcImage.src = BaseData;

        return ProcImage;
    }

    function GetBuffer(name) { //Получаем содержимое буфера в форме ассета
        var imageObj = GraphicsBuffer.GetBufferImage();
        return new Asset(name, AssetTypes.texture, "", imageObj);
    }

    function Clear() {
        Engine.BufferContext.clearRect(0, 0, GraphicsBuffer.width, GraphicsBuffer.height);
    }

    function ClearPixel(x, y) {
        Engine.BufferContext.clearRect(x, y, 1, 1);
    }

    function DrawPixel(x, y, color) {
        GraphicsBuffer.DrawQuad(new Rect(x, y, 1, 1), color);
    }

    function DrawQuad(rect, color) { //Взято из GUI
        Engine.BufferContext.fillStyle = color;
        Engine.BufferContext.fillRect(rect.x, rect.y, rect.width, rect.height);
    }

    function DrawTexture(rect, asset, clip) { //Взято из GUI
        if (!clip) clip = new Rect(0, 0, 1, 1);

        var image = asset.data;

        if (image) {
            var clipStartX = image.width * clip.x;
            var clipStartY = image.height * clip.y;
            var clipEndX = image.width * clip.width;
            var clipEndY = image.height * clip.height;

            Engine.BufferContext.drawImage(image, clipStartX, clipStartY, clipEndX, clipEndY, rect.x, rect.y, rect.width, rect.height);
        }
        else {
            GraphicsBuffer.DrawQuad(rect, "#f0f");
        }
    }

    function CreateImageData(w, h) {
        return Engine.BufferContext.createImageData(w, h);
    }

    function PutImageData(image, x, y) {
        if (!x) x = 0;
        if (!y) y = 0;

        Engine.BufferContext.putImageData(image, x, y);
    }

    function Blur(radius) {
        StackBlur.canvasRGBA(Find("buffer"), 0, 0, this.width, this.height, radius);
    }
    
    //
    return {
        width: width,
        height: height,
        Apply: Apply,
        GetBufferImage: GetBufferImage,
        GetBuffer: GetBuffer,
        Clear: Clear,
        ClearPixel: ClearPixel,
        DrawPixel: DrawPixel,
        DrawQuad: DrawQuad,
        DrawTexture: DrawTexture,
        CreateImageData: CreateImageData,
        PutImageData: PutImageData,
        Blur: Blur,
    }
}();