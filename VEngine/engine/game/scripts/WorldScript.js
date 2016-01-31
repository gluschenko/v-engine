var _ChunkSize = 16; //Ширина матрицы чанка

function WorldScript(GO) {

    var Seed = 4;
    //
    var Columns = []; //Колонны матриц матриц матриц
    var Noises = {}; //Перлиновские шумы на любой вкус и цвет
    var WorldDataView = null;
    //
    var WorldBlocks = [];
    //
    var MinHeight = 50;
    var Started = false;

    function StartWorld() {
        this.SetupNoises(this.Seed);
        this.Started = true;
        this.WorldDataView = this.GetWorldDataView();
    }

    function Start() {
        this.StartWorld();
    }

    function Update() {
        var Camera = GameObject.Find("MainCamera");

        var OffsetX = Math.floor(Camera.position.x / _ChunkSize); //Отночительное смещение камеры в пространстве (смещение, потому что делим на размер чанка)
        var OffsetY = Math.floor(Camera.position.y / _ChunkSize);

        if (this.Started) {
            this.UpdateWorldObjects(OffsetX, OffsetY, 3);
        }
    }

    function LateUpdate() {

    }

    function OnGUI() {
        if (Input.GetKey(KeyCode.F)) {
            GUI.DrawTexture(new Rect(0, 0, 30 * _ChunkSize, 30 * _ChunkSize), this.WorldDataView);
        }


        //Дебаг всякий

        //
        /*
        var cverts = [
            new Vector2(Input.mousePosition.x - 50, Input.mousePosition.y - 50),
            new Vector2(Input.mousePosition.x - 50, Input.mousePosition.y + 50),
            new Vector2(Input.mousePosition.x + 50, Input.mousePosition.y + 50),
            new Vector2(Input.mousePosition.x + 50, Input.mousePosition.y - 50)
        ];

        var verts = [
            new Vector2(100, 100),
            new Vector2(200, 100),
            new Vector2(200, 200),
            new Vector2(100, 200)
        ];

        for (var i = 0; i < verts.length; i++) {
            GUI.Box(new Rect(verts[i].x, verts[i].y, 2, 2), "");
        }

        for (var i = 0; i < cverts.length; i++) {
            GUI.Box(new Rect(cverts[i].x, cverts[i].y, 2, 2), "");
        }

        GUI.Label(new Rect(100, 100, 100, 100), "Inside: " + Geometry.PointsInside(cverts, verts));*/

        /*
        var cverts = [
            new Vector2(100, 200),
            new Vector2(200, 100),
            new Vector2(Input.mousePosition.x - 50, Input.mousePosition.y - 50),
            new Vector2(Input.mousePosition.x + 50, Input.mousePosition.y + 50)
        ];

        for (var i = 0; i < cverts.length; i++) {
            GUI.Box(new Rect(cverts[i].x, cverts[i].y, 2, 2), "");
        }

        GUI.Label(new Rect(100, 100, 100, 100), "Intersect: " + Geometry.Intersected([cverts[0], cverts[1]], [cverts[2], cverts[3]]));
        */
    }

    
    function SetupNoises(seed) {
        this.Noises.Terrain = new PerlinNoise(seed * 1); //Очень большие изгибы (макрорельеф)
        this.Noises.Terrain.scale = 1000;

        this.Noises.Mountain = new PerlinNoise(seed * 2); //Явные горы (мезорельеф)
        this.Noises.Mountain.scale = 120;

        this.Noises.Ground = new PerlinNoise(seed * 3); //Отрицательное искажение гор (микрорельеф)
        this.Noises.Ground.scale = 30;

        this.Noises.Cave = new PerlinNoise(seed * 4); //Пещеры
        this.Noises.Cave.scale = 100;

        this.Noises.Cave2 = new PerlinNoise(seed * 5); //Искажение пещерного шума
        this.Noises.Cave2.scale = 10;

        this.Noises.Cavity = new PerlinNoise(seed * 6); //Пустоты в земле (или кластеры)
        this.Noises.Cavity.scale = 10;

        this.Noises.CoalOre = new PerlinNoise(seed * 7); //Уголь
        this.Noises.CoalOre.scale = 12;

        this.Noises.IronOre = new PerlinNoise(seed * 8); //Железная руда
        this.Noises.IronOre.scale = 10;

        this.Noises.GoldenOre = new PerlinNoise(seed * 9); //Золотая руда
        this.Noises.GoldenOre.scale = 6;

        this.Noises.DiamondOre = new PerlinNoise(seed * 11); //Алмазы
        this.Noises.DiamondOre.scale = 2;
    }

    function UpdateWorldObjects(OffsetX, OffsetY, Range) {

        var MinOX = OffsetX - Range;
        var MaxOX = OffsetX + Range;

        var MinOY = OffsetY - Range;
        var MaxOY = OffsetY + Range;

        var isStop = false; //Если хоть в какой-то итерации будет генерирован чанк, то убиваем цикл (прирост производительности)
        for (var x = MinOX; x < MaxOX; x++) {

            if (!this.ColumnExists(x)) {
                this.AddColumn(x);
            }

            if (this.ColumnExists(x)) {
                var c = this.FindColumn(x);
                for (var y = MinOY; y < MaxOY; y++) {
                    if (!c.ChunkExists(y)) {
                        var chunk = c.AddChunk(y);

                        this.GenerateChunkData(x, y, chunk);
                        this.CreateChunkMesh(chunk);

                        chunk.body.collider.enabled = true;
                        //
                        isStop = true;
                        break;
                    }
                }
            }

            if (isStop) break;
        }

        //Удаление чанков, которые оказались за границами захвата
        for (var c = 0; c < Columns.length; c++) {
            for (var i = 0; i < Columns[c].chunks.length; i++) {
                var chunk = Columns[c].chunks[i];

                if (!(chunk.x >= MinOX && chunk.x <= MaxOX && chunk.y >= MinOY && chunk.y <= MaxOY))
                {
                    chunk.Destroy();
                    Columns[c].chunks.RemoveObj(chunk);
                }
            }
        }
    }

    function GenerateChunkData(OffsetX, OffsetY, C) {
        C.blocks = this.GenerateChunk(OffsetX, OffsetY, true);
        C.backBlocks = this.GenerateChunk(OffsetX, OffsetY, false);
    }

    function CreateChunkMesh(C) {
        C.body.sprite = this.CreateChunkSprite(C.blocks);
        C.background.sprite = this.CreateChunkSprite(C.backBlocks);
        C.lightmap.sprite = this.CreateChunkLightmap(C);
        C.body.collider.vertices = this.CreateChunkCollider(C.blocks);
    }

    //

    function SetBlock(x, y, type) {
        var OffsetX = Math.floor(x / _ChunkSize);
        var OffsetY = Math.floor(y / _ChunkSize);

        if (this.ColumnExists(OffsetX)) {
            var Col = this.FindColumn(OffsetX);

            if (Col.ChunkExists(OffsetY)) {
                var C = Col.FindChunk(OffsetY);

                var ix = x - (OffsetX * _ChunkSize);
                var iy = _ChunkSize - (y - (OffsetY * _ChunkSize)) - 1;
                //
                C.blocks.set(ix, iy, type);
                this.WorldBlocks[this.WorldBlocks.length] = new Block(x, y, type);
                //
                this.CreateChunkMesh(C);
            }
        }
    }


    function GetBlock(x, y, alt, isBack) { //back отдает блок из задника чанка
        if (!alt) alt = 0;
        if (!isBack) isBack = false;
        if (!this.Started) return;

        //Если блок уже генерирован

        var OffsetX = Math.floor(x / _ChunkSize);
        var OffsetY = Math.floor(y / _ChunkSize);

        if (this.ColumnExists(OffsetX)) {
            var Col = this.FindColumn(OffsetX);

            if (Col.ChunkExists(OffsetY)) {
                var C = Col.FindChunk(OffsetY);

                var ix = x - (OffsetX * _ChunkSize);
                var iy = _ChunkSize - (y - (OffsetY * _ChunkSize)) - 1;
                //
                if (!isBack) return C.blocks.get(ix, iy, alt);
                else return C.backBlocks.get(ix, iy, alt);
            }
        }

        //Если блока не нашлось

        return this.GenerateBlock(x, y, -1, !isBack);
    }

    //

    function GenerateChunk(OX, OY, isFull) {
        var x = OX * _ChunkSize;
        var y = OY * _ChunkSize;
        //
        var Data = new Matrix2(_ChunkSize, _ChunkSize);

        //
        for (var ix = 0; ix < _ChunkSize; ix++) { //По горизонтали
            var GlobalX = x + ix;
            //
            var Height = this.GenerateHeight(GlobalX);

            for (var iy = 0; iy < _ChunkSize; iy++) { //По вертикали
                var GlobalY = y + (_ChunkSize - iy);
                //
                var type = this.GenerateBlock(GlobalX, GlobalY, Height, isFull);
                //
                Data.set(ix, iy, type);
            }
        }

        return Data;
    }

    function GenerateBlock(GlobalX, GlobalY, Height, isFull) { //Генерируем отдельно взятый блок
        var type = 0;

        if (Height < 0)
        {
            Height = this.GenerateHeight(GlobalX);
        }

        //Слои
        if (GlobalY < Height - 0) type = 1;
        if (GlobalY < Height - 1) type = 2;
        if (GlobalY < Height - 4) type = 3;
        //

        //Полная генерация
        if (isFull) {
            if (type != 0) {
                //Руды
                if (GlobalY < this.MinHeight + 64) {
                    var coal = this.Noises.CoalOre.getValue2(GlobalX, GlobalY);
                    if (coal > 0.5) type = 6;
                }
                if (GlobalY < this.MinHeight) {
                    var iron = this.Noises.IronOre.getValue2(GlobalX, GlobalY);
                    if (iron > 0.5) type = 7;
                }
                if (GlobalY < this.MinHeight - 48) {
                    var gold = this.Noises.GoldenOre.getValue2(GlobalX, GlobalY);
                    if (gold > 0.7) type = 8;
                }
                if (GlobalY < this.MinHeight - 96) {
                    var diamond = this.Noises.DiamondOre.getValue2(GlobalX, GlobalY);
                    if (diamond > 0.5) type = 9;
                }

                //Работа с пещерами
                var cave = this.Noises.Cave.getValue2(GlobalX, GlobalY);
                var cave2 = this.Noises.Cave2.getValue2(GlobalX, GlobalY) * 0.1;
                var CaveFactor = cave + cave2;

                if (CaveFactor > 0.1 && CaveFactor < 0.15) type = 0;

                //Работа с пустотами
                var cavity = this.Noises.Cavity.getValue2(GlobalX, GlobalY);

                if (cavity > 0.5) type = 0;
            }
        }

        return type;
    }

    function GenerateHeight(GlobalX) { //Получаем высоту по горизонтали на основе шума Перлина
        var height = 0;
        var debug = false;

        if (!debug) {
            var terrain = Math.abs(this.Noises.Terrain.getValue(GlobalX)) * 300;
            var mountain = Math.abs(this.Noises.Mountain.getValue(GlobalX)) * 80;
            var ground = Math.abs(this.Noises.Ground.getValue(GlobalX)) * 10;

            height = Math.round(this.MinHeight + terrain + mountain - ground);
        }
        else {
            height = 40;
        }

        return height;
    }

    function CreateChunkSprite(Data) {
        var TileSize = 16;//Размер исходного тайла в точках
        var TilesNum = 16; //Количество тайлов в ширине листа
        var ClipSize = 1 / TilesNum; //Нормализованная единица для резки на тайлы
        var SheetSize = TileSize * 16; //Размер листа тайлов в точках

        GraphicsBuffer.Apply(SheetSize, SheetSize);

        for (var x = 0; x < _ChunkSize; x++) {
            for (var y = 0; y < _ChunkSize; y++) {
                var type = Data.get(x, y, 0);

                if (type != 0) {
                    var rect = new Rect(x * TileSize, y * TileSize, TileSize, TileSize);

                    //GraphicsBuffer.DrawTexture(rect, Assets.Blocks, GetClip(type - 1, TileSize, ClipSize));

                    if (GameItems[type]) GraphicsBuffer.DrawTexture(rect, GameItems[type].sprite);
                }
            }
        }

        return GraphicsBuffer.GetBuffer("ChunkBody");
    }

    function CreateChunkCollider(Data, Method) {
        if (!Method) Method = 1;
        //
        var verts = [];
        var quadWidth = 1 / _ChunkSize;

        //Фактический коллайдер
        if (Method == 0) {
            for (var x = 0; x < _ChunkSize; x++) {
                for (var y = 0; y < _ChunkSize; y++) {
                    var type = Data.get(x, y, 0);

                    if (type != 0) {
                        var Point = new Vector2((x * quadWidth) - 0.5, (1 - (y * quadWidth)) - 0.5 - quadWidth);

                        verts[verts.length] = Point;
                        verts[verts.length] = new Vector2(Point.x + quadWidth, Point.y);
                        verts[verts.length] = new Vector2(Point.x + quadWidth, Point.y + quadWidth);
                        verts[verts.length] = new Vector2(Point.x, Point.y + quadWidth);
                    }
                }
            }
        }

        //Коллайдер Octree-структуры
        if (Method == 1) {
            var FillIndex = new Matrix2(_ChunkSize, _ChunkSize); //Матричное представление уже пройденных блоков

            for (var w = _ChunkSize; w >= 1; w /= 2) { //Феерический цикл перебора ширины захвата

                for (var ix = 0; ix < _ChunkSize; ix += w) {
                    for (var iy = 0; iy < _ChunkSize; iy += w) {

                        var isFull = true;
                        var isFree = true;

                        for (var x = ix; x < ix + w; x++) {
                            for (var y = iy; y < iy + w; y++) {
                                var type = Data.get(x, y, 0);
                                var engaged = FillIndex.get(x, y, 0) == 1;

                                if (type == 0) isFull = false;
                                if (engaged) isFree = false;
                            }
                        }

                        if (isFull && isFree) {
                            var iiy = (_ChunkSize) - iy;

                            var Point = new Vector2((ix * quadWidth) - 0.5, (iiy * quadWidth) - 0.5);

                            verts[verts.length] = Point;
                            verts[verts.length] = new Vector2(Point.x + (quadWidth * w), Point.y);
                            verts[verts.length] = new Vector2(Point.x + (quadWidth * w), Point.y + (quadWidth * -w));
                            verts[verts.length] = new Vector2(Point.x, Point.y + (quadWidth * -w));

                            for (var x = ix; x < ix + w; x++) {
                                for (var y = iy; y < iy + w; y++) {
                                    FillIndex.set(x, y, 1);
                                }
                            }
                        }
                    }
                }

            }
        }

        return verts;
    }

    function CreateChunkLightmap(chunk) { //Карта света для чанков
        //return;

        var TileSize = 16;
        var MapWidth = TileSize * _ChunkSize;
        //
        var DarknessColor = new Color4(0, 0, 0, 0.9); //Цвет темноты
        var ObscurityColor = new Color4(0, 0, 0, 1); //Цвет неизвестности и мрака
        //
        var GlobalX = chunk.x * _ChunkSize;
        var GlobalY = chunk.y * _ChunkSize;
        //

        GraphicsBuffer.Apply(MapWidth, MapWidth);

        var DataImage = GraphicsBuffer.CreateImageData(MapWidth, MapWidth);
        var Data = DataImage.data;
        
        //

        for (var x = 0; x < _ChunkSize; x++) {
            for (var y = 0; y < _ChunkSize; y++) {
                var BlockX = GlobalX + x;
                var BlockY = GlobalY + (_ChunkSize - y - 1);

                var back_type = this.GetBlock(BlockX, BlockY, 0, true);
                var type = this.GetBlock(BlockX, BlockY, 0);
                //
                if (back_type != 0 || (back_type == 0 && type != 0)) { //Лайтинг по заднику

                    var up = this.GetBlock(BlockX, BlockY + 1, 0, true) == 0;
                    var down = this.GetBlock(BlockX, BlockY - 1, 0, true) == 0;
                    var left = this.GetBlock(BlockX - 1, BlockY, 0, true) == 0;
                    var right = this.GetBlock(BlockX + 1, BlockY, 0, true) == 0;

                    var up_right = this.GetBlock(BlockX + 1, BlockY + 1, 0, true) == 0;
                    var up_left = this.GetBlock(BlockX - 1, BlockY + 1, 0, true) == 0;
                    var down_right = this.GetBlock(BlockX + 1, BlockY - 1, 0, true) == 0;
                    var down_left = this.GetBlock(BlockX - 1, BlockY - 1, 0, true) == 0;

                    for (var ix = 0; ix < TileSize; ix++) {
                        for (var iy = 0; iy < TileSize; iy++) {

                            TX = (x * _ChunkSize) + ix;
                            TY = (y * _ChunkSize) + iy;
                            //

                            var BlendRatio = 1;

                            //

                            if (up) BlendRatio = Math.min(BlendRatio, iy / TileSize);
                            if (down) BlendRatio = Math.min(BlendRatio, (TileSize - iy) / TileSize);
                            if (left) BlendRatio = Math.min(BlendRatio, ix / TileSize);
                            if (right) BlendRatio = Math.min(BlendRatio, (TileSize - ix) / TileSize);
                            if (up_right && !(up || right)) BlendRatio = Math.min(BlendRatio, ((TileSize - ix) + iy) / TileSize);
                            if (up_left && !(up || left)) BlendRatio = Math.min(BlendRatio, (ix + iy) / TileSize);
                            if (down_right && !(down || right)) BlendRatio = Math.min(BlendRatio, ((TileSize - ix) + (TileSize - iy)) / TileSize);
                            if (down_left && !(down || left)) BlendRatio = Math.min(BlendRatio, (ix + (TileSize - iy)) / TileSize);

                            //

                            var o = Color4.Lerp(new Color4(DarknessColor.r, DarknessColor.g, DarknessColor.b, 0), DarknessColor, BlendRatio);

                            //
                            var pix = (TX + TY * DataImage.width) * 4;
                            //
                            Data[pix + 0] = o.r;
                            Data[pix + 1] = o.g;
                            Data[pix + 2] = o.b;
                            Data[pix + 3] = Math.floor(o.a * 255);

                        }
                    }
                }

                if (type != 0) { //Лайтинг по передним блокам

                    var up = this.GetBlock(BlockX, BlockY + 1, 0) == 0;
                    var down = this.GetBlock(BlockX, BlockY - 1, 0) == 0;
                    var left = this.GetBlock(BlockX - 1, BlockY, 0) == 0;
                    var right = this.GetBlock(BlockX + 1, BlockY, 0) == 0;

                    var up_right = this.GetBlock(BlockX + 1, BlockY + 1, 0) == 0;
                    var up_left = this.GetBlock(BlockX - 1, BlockY + 1, 0) == 0;
                    var down_right = this.GetBlock(BlockX + 1, BlockY - 1, 0) == 0;
                    var down_left = this.GetBlock(BlockX - 1, BlockY - 1, 0) == 0;

                    for (var ix = 0; ix < TileSize; ix++) {
                        for (var iy = 0; iy < TileSize; iy++) {

                            TX = (x * _ChunkSize) + ix;
                            TY = (y * _ChunkSize) + iy;
                            //
                            
                            var BlendRatio = 1;

                            //

                            if (up) BlendRatio = Math.min(BlendRatio, iy / TileSize);
                            if (down) BlendRatio = Math.min(BlendRatio, (TileSize - iy) / TileSize);
                            if (left) BlendRatio = Math.min(BlendRatio, ix / TileSize);
                            if (right) BlendRatio = Math.min(BlendRatio, (TileSize - ix) / TileSize);
                            if (up_right && !(up || right)) BlendRatio = Math.min(BlendRatio, ((TileSize - ix) + iy) / TileSize);
                            if (up_left && !(up || left)) BlendRatio = Math.min(BlendRatio, (ix + iy) / TileSize);
                            if (down_right && !(down || right)) BlendRatio = Math.min(BlendRatio, ((TileSize - ix) + (TileSize - iy)) / TileSize);
                            if (down_left && !(down || left)) BlendRatio = Math.min(BlendRatio, (ix + (TileSize - iy)) / TileSize);

                            //
                            var pix = (TX + TY * DataImage.width) * 4;
                            //
                            var alpha = (Data[pix + 3] / 255);
                            var o = Color4.Lerp(new Color4(ObscurityColor.r, ObscurityColor.g, ObscurityColor.b, alpha * 1.1), ObscurityColor, BlendRatio);
                            //
                            Data[pix + 0] = o.r;
                            Data[pix + 1] = o.g;
                            Data[pix + 2] = o.b;
                            Data[pix + 3] = Math.floor(o.a * 255);

                        }
                    }
                }
            }
        }

        GraphicsBuffer.PutImageData(DataImage);

        return GraphicsBuffer.GetBuffer("LightmapBody");
    }

    function GetClip(Tile, TilesNum, ClipSize) {
        var row = Math.floor(Tile / TilesNum);
        var col = Tile - (row * TilesNum);

        return new Rect(ClipSize * col, ClipSize * row, ClipSize, ClipSize);
    }

    function AddColumn(offset) {
        var c = new Column();

        c.index = this.Columns.length;
        c.offset = offset;

        this.Columns[c.index] = c;
    }

    function ColumnExists(offset) {
        for (var i = 0; i < this.Columns.length; i++) {
            if (this.Columns[i].offset == offset) {
                return true;
            }
        }

        return false;
    }

    function FindColumn(offset) {
        for (var i = 0; i < this.Columns.length; i++) {
            if (this.Columns[i].offset == offset) {
                return this.Columns[i];
            }
        }

        return null;
    }

    function GetWorldDataView() {
        var x = 30 * _ChunkSize;
        var y = 30 * _ChunkSize;

        GraphicsBuffer.Apply(x, y);

        var DataImage = GraphicsBuffer.CreateImageData(x, y);
        var Data = DataImage.data;

        for (var ix = 0; ix < x; ix += _ChunkSize) {
            for (var iy = 0; iy < x; iy += _ChunkSize) {
                var OX = ix / _ChunkSize;
                var OY = (y - iy) / _ChunkSize;

                var ChunkData = this.GenerateChunk(OX, OY, true);

                for (cx = 0; cx < _ChunkSize; cx++) {
                    for (cy = 0; cy < _ChunkSize; cy++) {
                        var PicX = ix + cx;
                        var PicY = iy + cy;
                        //
                        var pix = (PicX + PicY * DataImage.width) * 4;

                        if (ChunkData.get(cx, cy, 0) != 0) {
                            Data[pix + 0] = 255;
                            Data[pix + 1] = 255;
                            Data[pix + 2] = 0;

                            Data[pix + 3] = 255;
                        }
                    }
                }
            }
        }

        GraphicsBuffer.PutImageData(DataImage);
        return GraphicsBuffer.GetBuffer("WorldDataView");
    }

    function RenderChunk() {
        //Резерв
    }

    return {
        Seed: Seed,
        Columns: Columns,
        Noises: Noises,
        WorldDataView: WorldDataView,
        WorldBlocks: WorldBlocks,
        MinHeight: MinHeight,
        Started: Started,
        StartWorld: StartWorld,
        Start: Start,
        Update: Update,
        LateUpdate: LateUpdate,
        OnGUI: OnGUI,
        SetupNoises: SetupNoises,
        UpdateWorldObjects: UpdateWorldObjects,
        GenerateChunkData: GenerateChunkData,
        CreateChunkMesh: CreateChunkMesh,
        SetBlock: SetBlock,
        GetBlock: GetBlock,
        GenerateChunk: GenerateChunk,
        GenerateBlock: GenerateBlock,
        GenerateHeight: GenerateHeight,
        CreateChunkSprite: CreateChunkSprite,
        CreateChunkCollider: CreateChunkCollider,
        CreateChunkLightmap: CreateChunkLightmap,
        GetClip: GetClip,
        AddColumn: AddColumn,
        ColumnExists: ColumnExists,
        FindColumn: FindColumn,
        GetWorldDataView: GetWorldDataView,
    }

}

function Column() {
    this.index = 0;
    this.offset = 0;
    this.chunks = [];
}

Column.prototype.AddChunk = function (offset) {
    var c = new Chunk(_ChunkSize);

    c.index = this.chunks.length;
    c.x = this.offset;
    c.y = offset;

    var pivot = IGameObject.Instantiate("ChunkPivot_" + c.x + "_" + c.y);
    pivot.position = new Vector2(c.x * _ChunkSize, c.y * _ChunkSize);
    pivot.collider.enabled = false;

    var body = IGameObject.Instantiate("ChunkBody");
    body.scale = new Vector2(_ChunkSize, _ChunkSize);
    body.position = new Vector2(_ChunkSize / 2, _ChunkSize / 2);
    body.layer = 3;
    body.collider.enabled = false;
    body.castShadows = false;

    var background = IGameObject.Instantiate("ChunkBackground");
    background.scale = new Vector2(_ChunkSize, _ChunkSize);
    background.position = new Vector2(_ChunkSize / 2, _ChunkSize / 2);
    background.layer = 1;
    background.collider.enabled = false;
    background.castShadows = false;

    var lightmap = IGameObject.Instantiate("ChunkLightmap");
    lightmap.scale = new Vector2(_ChunkSize, _ChunkSize);
    lightmap.position = new Vector2(_ChunkSize / 2, _ChunkSize / 2);
    lightmap.layer = 4;
    lightmap.collider.enabled = false;
    lightmap.castShadows = false;

    pivot.Append(body);
    pivot.Append(background);
    pivot.Append(lightmap);

    c.pivot = pivot;
    c.body = body;
    c.background = background;
    c.lightmap = lightmap;

    this.chunks[c.index] = c;
    return c;
};

Column.prototype.ChunkExists = function (offset) {
    for (var i = 0; i < this.chunks.length; i++) {
        if (this.chunks[i].y == offset) {
            return true;
        }
    }

    return false;
};

Column.prototype.FindChunk = function (offset) {
    for (var i = 0; i < this.chunks.length; i++) {
        if (this.chunks[i].y == offset) {
            return this.chunks[i];
        }
    }

    return null;
};

function Chunk(size) {
    if (!size) size = 16;

    this.index = 0;
    this.x = 0;//Смещение столбца
    this.y = 0;//Вертикальное смещение чанка
    this.size = size;
    this.blocks = new Matrix2(size, size);
    this.backBlocks = new Matrix2(size, size);

    this.pivot = null;
    this.body = null;
    this.background = null;
}

Chunk.prototype.Destroy = function () { //Удаляем со сцены прицепленные объекты
    var ObjectsToDestroy = [
        this.pivot,
        this.body,
        this.background,
        this.lightmap,
    ];
    //
    for (var i = 0; i < ObjectsToDestroy.length; i++) {
        GameObject.Destroy(ObjectsToDestroy[i]);
    }
};

function Block(x, y, id) {
    this.x = x;
    this.y = y;
    this.id = id;
}