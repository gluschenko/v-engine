var ItemColliders = GetItemColliders();
var ItemTypes = GetItemTypes();

var GameItems = [];

function SetupGameItems() { //Униморфные сущности предметов
    GameItems = [
        new Item({ //0
            type: ItemTypes.block,
            title: "Nothing",
            description: "Empty item",
            icon: null,
            sprite: null,
            collider: null,
            colliderEnabled: false,
            stack: true,
        }),
        new Item({ //1
            type: ItemTypes.block,
            title: "Трава",
            description: "Блок ландшафта",
            icon: Assets.GrassBlock,
            sprite: Assets.GrassBlock,
            collider: ItemColliders.block,
            colliderEnabled: true,
            stack: true,
        }),
        new Item({ //2
            type: ItemTypes.block,
            title: "Земля",
            description: "Блок ландшафта",
            icon: Assets.DirtBlock,
            sprite: Assets.DirtBlock,
            collider: ItemColliders.block,
            colliderEnabled: true,
            stack: true,
        }),
        new Item({ //3
            type: ItemTypes.block,
            title: "Камень",
            description: "Блок ландшафта",
            icon: Assets.StoneBlock,
            sprite: Assets.StoneBlock,
            collider: ItemColliders.block,
            colliderEnabled: true,
            stack: true,
        }),
        new Item({ //4
            type: ItemTypes.block,
            title: "Булыжник",
            description: "Блок ландшафта",
            icon: Assets.CobblestoneBlock,
            sprite: Assets.CobblestoneBlock,
            collider: ItemColliders.block,
            colliderEnabled: true,
            stack: true,
        }),
        new Item({ //5
            type: ItemTypes.block,
            title: "Древесина",
            description: "Блок ландшафта",
            icon: Assets.TreeBlock,
            sprite: Assets.TreeBlock,
            collider: ItemColliders.block,
            colliderEnabled: true,
            stack: true,
        }),
        new Item({ //6
            type: ItemTypes.block,
            title: "Факел",
            description: "Блок ландшафта",
            icon: Assets.TorchBlock,
            sprite: Assets.TorchBlock,
            collider: ItemColliders.block,
            colliderEnabled: true,
            stack: true,
        }),
        new Item({ //7
            type: ItemTypes.block,
            title: "Угольная руда",
            description: "Блок ландшафта",
            icon: Assets.CoalOreBlock,
            sprite: Assets.CoalOreBlock,
            collider: ItemColliders.block,
            colliderEnabled: true,
            stack: true,
        }),
        new Item({ //8
            type: ItemTypes.block,
            title: "Железная руда",
            description: "Блок ландшафта",
            icon: Assets.IronOreBlock,
            sprite: Assets.IronOreBlock,
            collider: ItemColliders.block,
            colliderEnabled: true,
            stack: true,
        }),
        new Item({ //9
            type: ItemTypes.block,
            title: "Железная руда",
            description: "Блок ландшафта",
            icon: Assets.GoldOreBlock,
            sprite: Assets.GoldOreBlock,
            collider: ItemColliders.block,
            colliderEnabled: true,
            stack: true,
        }),
        new Item({ //10
            type: ItemTypes.block,
            title: "Алмазная руда",
            description: "Блок ландшафта",
            icon: Assets.DiamondOreBlock,
            sprite: Assets.DiamondOreBlock,
            collider: ItemColliders.block,
            colliderEnabled: true,
            stack: true,
        }),
    ];
}

var StoreItems = { //Ассоциация <товар: предмет> (id)
    1: 1,
    2: 2,
};


//
//
//

var GameConfig = {
    NewItemID: 0,
};

function Item(obj) {
    this.id = GameConfig.NewItemID;
    this.type = obj.type;
    this.title = obj.title;
    this.description = obj.description;
    this.icon = obj.icon;
    //
    this.sprite = obj.sprite != null ? obj.sprite : null;
    this.collider = obj.collider != null ? obj.collider : null;
    this.colliderEnabled = obj.colliderEnabled != null ? obj.colliderEnabled : false;
    //
    this.stack = obj.stack != null ? obj.stack : false;
    //
    GameConfig.NewItemID++;
}

//

function GetItemColliders(){
    return {
        block: [
            new Vector2(-0.5, -0.5),
            new Vector2(-0.5, 0.5),
            new Vector2(0.5, 0.5),
            new Vector2(0.5, -0.5),
        ],
    };
}

function GetItemTypes() {
    return {
        block: "block",
        item: "item",
        service: "service",
    };
}