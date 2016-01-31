Physics = new function () {

    var Enabled = true;

    var Gravity = new Vector2(0, -9.81); //Ускорение свободного падения
    var AirFriction = 0.01; //Трение о воздух, которого нет

    var GameObjects = []; //Все активные объекты в памяти

    function Update() {
        Physics.GameObjects = GameObject.All();

        if (Physics.Enabled) Physics.UpdateRigidbodies();
    }

    function LateUpdate() {
        for (var i = 0; i < this.GameObjects.length; i++) {
            Physics.SetGlobalCollider(this.GameObjects[i]);
        }
    }

    function UpdateRigidbodies() {

        for (var i = 0; i < this.GameObjects.length; i++) {
            var GO = this.GameObjects[i];

            if (GO.rigidbody.enabled) {
                Physics.UpdateRigidbody(GO);
            }
        }
    }

    function SetGlobalCollider(GO) {
        GO.rigidbody.globalCollider = Physics.GetGlobalCollider(GO);
    }

    function UpdateRigidbody(GO) {

        var deltaTime = Time.deltaTime;
        if (deltaTime > (1 / 15) || Time.timeScale == 0) return; //Если ниже 10 фпс, то твёрдые тела спят
        //
        
        var CollisionActions = GetCollisionActions(GO);

        //
        GO.rigidbody.velocity.x *= (1 - AirFriction);
        GO.rigidbody.velocity.y *= (1 - AirFriction);
        //

        Force.Add(GO.rigidbody, new Force(Physics.Gravity));

        if (CollisionActions.length > 0) { //Ести есть активные столкновения

            var Reaction = new Vector2(-GO.rigidbody.velocity.x, -GO.rigidbody.velocity.y); //Гашение первичного импульса
            Force.Add(GO.rigidbody, new Force(Reaction));

            //
            var MidsA = [];
            var MidsB = [];

            for (var i = 0; i < CollisionActions.length; i++) {
                MidsA[MidsA.length] = CollisionActions[i].firstMid;
                MidsB[MidsB.length] = CollisionActions[i].secondMid;
            }

            var CommomMidA = Geometry.Mid(MidsA); //Общие миды столкновения всех событий столкновения
            var CommomMidB = Geometry.Mid(MidsB);
            var MidsAngle = Vector2.Angle(CommomMidA, CommomMidB); //Угол между мидами
            var NormalMidsAngle = Math.round(MidsAngle / 90) * 90;
            var MidsDistance = Vector2.Distance(CommomMidA, CommomMidB); //Растояние между сабжами
            //
            var InnerReaction = new Vector2(0, 0); //Реакция проникновения
            var MemPosition = new Vector2(GO.position.x, GO.position.y); //Кладём в память до окнчания эмпирического перемещения
            //
            var MoveDirection = Vector2.Rotate(Vector2.Left, NormalMidsAngle);
            var MoveScalar = (1 / (MidsDistance)) * 0.01;

            var TempCollisionActions = GetCollisionActions(GO);

            for (var i = 0; i < 20; i++) {
                if (TempCollisionActions.length > 0) {
                    GO.GlobalTranslate(MoveDirection, MoveScalar);
                    Physics.SetGlobalCollider(GO);

                    TempCollisionActions = GetCollisionActions(GO);
                }
                else {
                    //console.log(MidsDistance);
                    break;
                }
            }
            //
            //GO.position = new Vector2(MemPosition.x, MemPosition.y); //Возвращаем объект на место
            Force.Add(GO.rigidbody, new Force(InnerReaction)); //Прикладываем реакцию проникновения (тёпленькую, но без дыма)
        }
        else {
            //GO.rigidbody.lastPosition = new Vector2(GO.position.x, GO.position.y);
        }

        GO.rigidbody.deltaPosition = new Vector2(GO.position.x - GO.rigidbody.lastPosition.x, GO.position.y - GO.rigidbody.lastPosition.y);
        GO.rigidbody.lastPosition = new Vector2(GO.position.x, GO.position.y);

        GO.GlobalTranslate(GO.rigidbody.velocity, deltaTime * deltaTime);
    }

    function GetCollisionActions(GO) {
        var actions = [];

        for (var i = 0; i < Physics.GameObjects.length; i++) {
            if (Physics.GameObjects[i] != GO) {

                if (GO.collider.enabled && Physics.GameObjects[i].collider.enabled) {
                    if (Physics.SphereCollision(GO, Physics.GameObjects[i])) {
                        var CA = Physics.GetCollision(GO, Physics.GameObjects[i]);

                        if (CA.inside) {
                            actions[actions.length] = CA;
                        }
                    }
                }

            }
        }

        return actions;
    }


    function ffff(){
        /*
function Pretty_Old_UpdateRigidbody(GO) {

    var deltaTime = Time.deltaTime;
    if (deltaTime > (1 / 15)) deltaTime = 0; //Если ниже 15 фпс, то физика не работает
    //
    var GetCollisionAction = function () {
        for (var i = 0; i < Physics.GameObjects.length; i++) {
            if (Physics.GameObjects[i] != GO) {

                if (GO.collider.enabled && Physics.GameObjects[i].collider.enabled) {
                    if (Physics.SphereCollision(GO, Physics.GameObjects[i])) {
                        var CA = Physics.Collision(GO, Physics.GameObjects[i]);

                        if (CA.inside) {
                            return CA;
                        }
                    }
                }

            }
        }

        return false;
    }

    //

    var CollisionAction = GetCollisionAction();

    var VelX = GO.rigidbody.velocity.x * (1 - AirFriction);
    var VelY = GO.rigidbody.velocity.y * (1 - AirFriction);

    if (CollisionAction) {
        //GUI.Box(new Rect(50, 50, 100, 100), "");

        VelX *= -0.3;
        VelY *= -0.3;
        //
        if (CollisionAction.inside) {
            
            GO.position = new Vector2(GO.position.x + (GO.rigidbody.lastPosition.x - GO.position.x), GO.position.y + (GO.rigidbody.lastPosition.y - GO.position.y));


            //

            var Col = GetCollisionAction();

            if (Col.inside) {
                var firstGOMid = Geometry.Mid(Col.firstMids);
                var secondGOMid = Geometry.Mid(Col.secondMids);

                var dir = new Vector2(firstGOMid.x - secondGOMid.x, firstGOMid.y - secondGOMid.y); //Терпимо
                var angle = Math.round(Vector2.Angle(dir, new Vector2(0, 0)) / 90) * 90 + 90;

                var offset = new Vector2(0, 1);
                GO.GlobalTranslate(Vector2.Rotate(offset, angle), deltaTime);

                //GUI.Box(new Rect(50, 50, 100, 100), "");
            }
        }
    }
    else {
        GO.rigidbody.lastPosition = new Vector2(GO.position.x, GO.position.y);

        //

        VelX += GO.rigidbody.mass * Physics.Gravity.x * deltaTime;
        VelY += GO.rigidbody.mass * Physics.Gravity.y * deltaTime;
    }

    GO.rigidbody.velocity = new Vector2(VelX, VelY);

    GO.rigidbody.deltaPosition = new Vector2(GO.position.x - GO.rigidbody.lastPosition.x, GO.position.y - GO.rigidbody.lastPosition.y);
    GO.rigidbody.lastPosition = new Vector2(GO.position.x, GO.position.y);

    GO.GlobalTranslate(GO.rigidbody.velocity, deltaTime);

    //
    //var VelX = 0; //GO.rigidbody.velocity.x * (1 - AirFriction);
    //var VelY = 0; //GO.rigidbody.velocity.y * (1 - AirFriction);
    //
    //if (CollisionAction) { //Столкновение
        //VelX = 0;
        //VelY = 0;

        //GO.rigidbody.canMove = false;

        //Жесткое перемещение
        //GO.GlobalTranslate(DeltaPos, 1);
        //Итерированное перемещение (прямо как на тракторе!)
        /*var CA = Physics.Collision(CollisionAction.firstGO, CollisionAction.secondGO);
        if (CA.inside) {

            var MiddleCA = CA;
            var Iteration = 0;
            var MaxIterations = 10;

            while (MiddleCA.inside && Iteration < MaxIterations) {
                var firstGOMid = Geometry.Mid(MiddleCA.firstMids);
                var secondGOMid = Geometry.Mid(MiddleCA.secondMids);

                var dir = new Vector2(firstGOMid.x - secondGOMid.x, firstGOMid.y - secondGOMid.y); //Терпимо
                var angle = Math.round(Vector2.Angle(dir, new Vector2(0, 0)) / 90) * 90 + 90;

                var offset = new Vector2(0, 1);
                GO.GlobalTranslate(Vector2.Rotate(offset, angle), Time.deltaTime * 0.2);
                //
                Physics.SetGlobalCollider(GO);
                MiddleCA = Physics.Collision(MiddleCA.firstGO, MiddleCA.secondGO);
                

                Iteration++;
                console.log(Iteration);
            }
        }*/

        /*var firstGOMid = Geometry.Mid(CollisionAction.firstMids);
        var secondGOMid = Geometry.Mid(CollisionAction.secondMids);

        var dir = new Vector2(firstGOMid.x - secondGOMid.x, firstGOMid.y - secondGOMid.y); //Терпимо
        var angle = Math.round(Vector2.Angle(dir, new Vector2(0, 0)) / 90) * 90 + 90;

        var offset = new Vector2(0, 1);
        GO.GlobalTranslate(Vector2.Rotate(offset, angle), Time.deltaTime * 0.2);
        //
        GO.GlobalTranslate(DeltaPos, 1);*/
        //

        //GUI.Box(new Rect(GO.screenPosition.x, GO.screenPosition.y, 20, 20), "");
        //}
        //else { //Нет столкновения
        /*if (GO.rigidbody.canMove) {
            VelX += GO.rigidbody.mass * Physics.Gravity.x * Time.deltaTime;
            VelY += GO.rigidbody.mass * Physics.Gravity.y * Time.deltaTime;
        }
        else {
            GO.rigidbody.canMove = true;
        }*/

        //GO.rigidbody.outerPosition = new Vector2(GO.rigidbody.lastPosition.x, GO.rigidbody.lastPosition.y);
        //}

        //GUI.Box(new Rect(50, 50, 100, 100), "" + GO.rigidbody.moveDirection.x + " " + GO.rigidbody.moveDirection.y);

        //

        //var CurrentVelocity = new Vector2(VelX, VelY);

        /*
        GO.rigidbody.deltaPosition = new Vector2(GO.position.x - GO.rigidbody.lastPosition.x, GO.position.y - GO.rigidbody.lastPosition.y);

        GO.rigidbody.lastPosition = new Vector2(GO.position.x, GO.position.y);

        GO.rigidbody.deltaVelocity = new Vector2(GO.rigidbody.velocity.x - VelX, GO.rigidbody.velocity.y - VelY);
        GO.rigidbody.velocity = CurrentVelocity;
        GO.rigidbody.speed = Vector2.Distance(Vector2.Zero, GO.rigidbody.velocity) * Time.deltaTime;
        */
        //

        //GO.GlobalTranslate(GO.rigidbody.velocity, Time.deltaTime);
        //var CurrentPos = new Vector2(GO.position.x, GO.position.y);
        //var DeltaPos = new Vector2(GO.rigidbody.lastPosition.x - CurrentPos.x, GO.rigidbody.lastPosition.y - CurrentPos.y);
        /*}
    
        function Old_UpdateRigidbody(GO) {
            */
        /*GO.GlobalTranslate(GO.rigidbody.velocity, Time.deltaTime);
        var CurrentPos = new Vector2(GO.position.x, GO.position.y);
        var DeltaPos = new Vector2(GO.rigidbody.lastPosition.x - CurrentPos.x, GO.rigidbody.lastPosition.y - CurrentPos.y);

        //

        var GetCollisionAction = function () {
            for (var i = 0; i < Physics.GameObjects.length; i++) {
                if (Physics.GameObjects[i] != GO) {

                    if (GO.collider.enabled && Physics.GameObjects[i].collider.enabled) {
                        var CA = Physics.Collision(GO, Physics.GameObjects[i]);

                        if (CA.inside) {
                            return CA;
                        }
                    }

                }
            }

            return false;
        }

        var CollisionAction = GetCollisionAction();
        */
        /*for (var i = 0; i < this.GameObjects.length; i++) {
            if (this.GameObjects[i] != GO) {

                if (GO.collider.enabled && this.GameObjects[i].collider.enabled) {
                    var CA = Physics.Collision(GO, this.GameObjects[i]);

                    if (CA.inside) {
                        CollisionAction = CA;
                    }
                }

            }
        }*/
        /*
        //
        var VelX = 0; //GO.rigidbody.velocity.x * (1 - AirFriction);
        var VelY = 0; //GO.rigidbody.velocity.y * (1 - AirFriction);
        //
        if (CollisionAction) { //Столкновение
            VelX = 0;
            VelY = 0;
            
            //GO.rigidbody.canMove = false;
            */
        //Жесткое перемещение
        //GO.GlobalTranslate(DeltaPos, 1);
        //Итерированное перемещение (прямо как на тракторе!)
        /*var CA = Physics.Collision(CollisionAction.firstGO, CollisionAction.secondGO);
        if (CA.inside) {

            var MiddleCA = CA;
            var Iteration = 0;
            var MaxIterations = 10;

            while (MiddleCA.inside && Iteration < MaxIterations) {
                var firstGOMid = Geometry.Mid(MiddleCA.firstMids);
                var secondGOMid = Geometry.Mid(MiddleCA.secondMids);

                var dir = new Vector2(firstGOMid.x - secondGOMid.x, firstGOMid.y - secondGOMid.y); //Терпимо
                var angle = Math.round(Vector2.Angle(dir, new Vector2(0, 0)) / 90) * 90 + 90;

                var offset = new Vector2(0, 1);
                GO.GlobalTranslate(Vector2.Rotate(offset, angle), Time.deltaTime * 0.2);
                //
                Physics.SetGlobalCollider(GO);
                MiddleCA = Physics.Collision(MiddleCA.firstGO, MiddleCA.secondGO);
                

                Iteration++;
                console.log(Iteration);
            }
        }*/
        /*
            var firstGOMid = Geometry.Mid(CollisionAction.firstMids);
            var secondGOMid = Geometry.Mid(CollisionAction.secondMids);

            var dir = new Vector2(firstGOMid.x - secondGOMid.x, firstGOMid.y - secondGOMid.y); //Терпимо
            var angle = Math.round(Vector2.Angle(dir, new Vector2(0, 0)) / 90) * 90 + 90;

            var offset = new Vector2(0, 1);
            GO.GlobalTranslate(Vector2.Rotate(offset, angle), Time.deltaTime * 0.2);
            //
            GO.GlobalTranslate(DeltaPos, 1);
            //
            */
        //GUI.Box(new Rect(GO.screenPosition.x, GO.screenPosition.y, 20, 20), "");
        //}
        /*else { //Нет столкновения
            /*if (GO.rigidbody.canMove) {
                VelX += GO.rigidbody.mass * Physics.Gravity.x * Time.deltaTime;
                VelY += GO.rigidbody.mass * Physics.Gravity.y * Time.deltaTime;
            }
            else {
                GO.rigidbody.canMove = true;
            }*/

        //GO.rigidbody.outerPosition = new Vector2(GO.rigidbody.lastPosition.x, GO.rigidbody.lastPosition.y);
        //}

        //GUI.Box(new Rect(50, 50, 100, 100), "" + GO.rigidbody.moveDirection.x + " " + GO.rigidbody.moveDirection.y);

        //
        /*
        var CurrentVelocity = new Vector2(VelX, VelY);

        GO.rigidbody.deltaPosition = new Vector2(GO.position.x - GO.rigidbody.lastPosition.x, GO.position.y - GO.rigidbody.lastPosition.y);

        GO.rigidbody.lastPosition = new Vector2(GO.position.x, GO.position.y);

        GO.rigidbody.deltaVelocity = new Vector2(GO.rigidbody.velocity.x - VelX, GO.rigidbody.velocity.y - VelY);
        GO.rigidbody.velocity = CurrentVelocity;
        GO.rigidbody.speed = Vector2.Distance(Vector2.Zero, GO.rigidbody.velocity) * Time.deltaTime;
    }
*/
    }

    function GetGlobalCollider(GO) {
        var globalCollider = [];

        for (var i = 0; i < GO.collider.vertices.length; i++) {
            var v = GO.collider.vertices[i];
            v = new Vector2(v.x * GO.globalScale.x, v.y * GO.globalScale.y);
            v = Vector2.Rotate(v, GO.globalRotation);
            v = new Vector2(GO.globalPosition.x + v.x, GO.globalPosition.y + v.y);

            globalCollider[i] = v;
        }

        return globalCollider;
    }

    function GetCollision(FirstGO, SecondGO) { //Анализирует сечение коллайдеров по их топологиям
        var Action = {
            inside: false, //состояние проникновения
            firstGO: FirstGO, //участники столкновения
            secondGO: SecondGO,
            firstMids: [], //точки суб-коллайдеров, участвеющих в столкновении объектов
            secondMids: [],
            firstMid: null, //средние значения средних значений суб-коллайдеров
            secondMid: null,
        };

        //

        var FirstStep = FirstGO.collider.step;
        var SecondStep = SecondGO.collider.step;

        var FirstGC = FirstGO.rigidbody.globalCollider;
        var SecondGC = SecondGO.rigidbody.globalCollider;

        for (var s = 0; s < FirstGC.length; s += FirstStep) {

            var FirstSubCollider = [];

            for (var i = 0; i < FirstStep; i++) {
                FirstSubCollider[i] = FirstGC[s + i];
            }

            //

            for (var m = 0; m < SecondGC.length; m += SecondStep) {
                var SecondSubCollider = [];

                for (var i = 0; i < SecondStep; i++) {
                    SecondSubCollider[i] = SecondGC[m + i];
                }

                //

                if (Geometry.PointsInside(FirstSubCollider, SecondSubCollider) || Geometry.PointsInside(SecondSubCollider, FirstSubCollider)) {
                    Action.inside = true;
                    Action.firstMids[Action.firstMids.length] = Geometry.Mid(FirstSubCollider);
                    Action.secondMids[Action.secondMids.length] = Geometry.Mid(SecondSubCollider);
                    Action.firstMid = Geometry.Mid(Action.firstMids);
                    Action.secondMid = Geometry.Mid(Action.secondMids);
                }
            }
        }

        return Action;
    }

    function SphereCollision(FirstGO, SecondGO) { //Сферическое сечение по топологии
        var FirstStep = FirstGO.collider.step;
        var SecondStep = SecondGO.collider.step;

        var FirstGC = FirstGO.rigidbody.globalCollider;
        var SecondGC = SecondGO.rigidbody.globalCollider;

        for (var s = 0; s < FirstGC.length; s += FirstStep) {
            var FirstSubCollider = [];

            for (var i = 0; i < FirstStep; i++) {
                FirstSubCollider[i] = FirstGC[s + i];
            }

            var FirstSphere = Geometry.BoundingSphere(FirstSubCollider);

            for (var m = 0; m < SecondGC.length; m += SecondStep) {
                var SecondSubCollider = [];

                for (var i = 0; i < SecondStep; i++) {
                    SecondSubCollider[i] = SecondGC[m + i];
                }

                var SecondSphere = Geometry.BoundingSphere(SecondSubCollider);

                if(Geometry.SphereIntersects(FirstSphere, SecondSphere)){
                    return true;
                }
            }
        }

        return false;
    }

    
    //
    return {
        Enabled: Enabled,
        Gravity: Gravity,
        AirFriction: AirFriction,
        GameObjects: GameObjects,
        Update: Update,
        LateUpdate: LateUpdate,
        SetGlobalCollider: SetGlobalCollider,
        UpdateRigidbodies: UpdateRigidbodies,
        UpdateRigidbody: UpdateRigidbody,
        GetCollisionActions: GetCollisionActions,
        GetGlobalCollider: GetGlobalCollider,
        GetCollision: GetCollision,
        SphereCollision: SphereCollision,
    }
}();

Geometry = new function () {

    function Mid(verts) { //Средняя точка во множестве вершин
        var cx = 0;
        var cy = 0;

        for (var i = 0; i < verts.length; i++) {
            cx += verts[i].x;
            cy += verts[i].y;
        }

        cx /= verts.length;
        cy /= verts.length;
        //
        return new Vector2(cx, cy);
    }

    function Sigma(target, verts) { //Ищем сумму углов радиальных лучей вокруг одной точки
        var s = 0;

        var v = []; //Колдунство для того, чтобы присвоить ещё один элемент, не затронув оригинал массива
        for (var i = 0; i < verts.length; i++) v[i] = verts[i];

        v[v.length] = verts[0];

        for (var i = 0; i < v.length - 1; i++) {
            s += Vector2.AngleBetween(target, v[i], v[i + 1]);
        }

        return s;
    }

    function PointInside(target, verts) {
        var mid = Geometry.Mid(verts);
        var midSigma = Geometry.Sigma(mid, verts);
        var targetSigma = Geometry.Sigma(target, verts);

        //GUI.Label(new Rect(150, 150, 100, 100), midSigma + "_" + targetSigma);

        return Math.round(targetSigma) == Math.round(midSigma);
    }

    function PointsInside(a, b) { //Тут можно сделать быстрее
        var status = false;

        for (var i = 0; i < a.length; i++) {
            if (Geometry.PointInside(a[i], b)) {
                status = true;
            }
        }

        return status;
    }

    function Intersected(A, B) { // [a, b], [c, d]
        //Получаем разности векторов
        var DeltaA = Vector2.Delta(A[1], A[0]);
        var DeltaB = Vector2.Delta(B[1], B[0]);
        //Пляшем с бубном
        var DA = -(-DeltaA.y * A[0].x + DeltaA.x * A[0].y);
        var DB = -(-DeltaB.y * B[0].x + DeltaB.x * B[0].y);
        //Молимся Шиве
        var StartA = -DeltaB.y * A[0].x + DeltaB.x * A[0].y + DB;
        var EndA = -DeltaB.y * A[1].x + DeltaB.x * A[1].y + DB;

        var StartB = -DeltaA.y * B[0].x + DeltaA.x * B[0].y + DA;
        var EndB = -DeltaA.y * B[1].x + DeltaA.x * B[1].y + DA;
        //

        //В будущем нужно будет определять точку пересечения (сейчас лень)
        //var U = StartA / (StartA - EndA);
        //var Position = A[0] + U * DeltaA;

        //Логический вывод
        if (StartA * EndA >= 0 || StartB * EndB >= 0) return false;
        return true;
    }

    function BoundingSphere(verts) {
        var Pos = Geometry.Mid(verts);
        var Radius = 0;

        for (var i = 0; i < verts.length; i++) {
            var dist = Vector2.Distance(verts[i], Pos);
            if(dist > Radius)Radius = dist;
        }

        return { position: Pos, radius: Radius };
    }

    function SphereIntersects(A, B) {
        if(Vector2.Distance(A.position, B.position) < A.radius + B.radius){
            return true;
        }
        return false;
    }

    function RaySphereIntersects(S, A, B) { //BoundingSphere, Vector2, Vector2
        var RayLen = Vector2.Distance(A, B);
        var SLen = Vector2.Distance(A, S.position);
        var ratio = SLen / RayLen;
        var C = Vector2.Lerp(A, B, ratio);
        //
        if (Vector2.Distance(C, S.position) <= S.radius) return true;
        return false;
    }

    //
    return {
        Mid: Mid,
        Sigma: Sigma,
        PointInside: PointInside,
        PointsInside: PointsInside,
        Intersected: Intersected,
        BoundingSphere: BoundingSphere,
        SphereIntersects: SphereIntersects,
        RaySphereIntersects: RaySphereIntersects,
    }
}();

function Rigidbody(GO) {
    this.enabled = false;
    this.GO = GO;
    this.globalCollider = [];
    this.canMove = true;
    this.lastPosition = new Vector2(0, 0); //Позиция текущей итерации
    this.deltaPosition = new Vector2(0, 0); //Дельта позиции прошлои итерации и текущей
    this.tempOffset = new Vector2(0, 0);
    //this.outerPosition = new Vector2(0, 0); //Последняя позиция вне коллайдера
    this.velocity = new Vector2(0, 0); //Вектор скорости и направления
    //this.deltaVelocity = new Vector2(0, 0); //Дельта смещений между итерациями
    this.mass = 1; //килограммы
    this.speed = 0; //ХЗ вообще (кажется, метры в секунду)
}

/*Rigidbody.prototype.Bump = function (direction) { //Импульс к телу (всё очень плохо)
    this.velocity = new Vector2(this.velocity.x + direction.x, this.velocity.y + direction.y);
};*/

//

function Collider(GO) {
    this.enabled = false; //стд
    this.GO = GO; //стд
    this.vertices = [  //дефолт
        new Vector2(-0.5, -0.5),
        new Vector2(-0.5, 0.5),
        new Vector2(0.5, 0.5),
        new Vector2(0.5, -0.5),
    ];
    this.step = 4; //Шаг коллайдера
}

function Force(direction) {
    this.direction = new Vector2(direction.x, direction.y);
    this.scalar = Vector2.Scalar(direction);
}

Force.Add = function (rigidbody, force) { //Склеивание сил. Уровень: Сельская гимназия
    rigidbody.velocity.x += force.direction.x;
    rigidbody.velocity.y += force.direction.y;
};