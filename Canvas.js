(function() {

    var canvas = document.getElementById('sample');

    var ctx = canvas.getContext('2d');

    var baseGraphPath =

        ctx.beginPath();
    ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(0, 0, 700, 400);

    canvas.addEventListener('mousedown', onClick, false);
    canvas.addEventListener('mousemove', onMove, false);
    canvas.addEventListener('mouseup', drawEnd, false);
    canvas.addEventListener('mouseout', drawClear, false);

    var defosize = 7;
    var defocolor = "#555555";
    var defoalpha = 1.0;

    //始点
    var first_X = "";
    var first_Y = "";

    //終点
    var end_X = "";
    var end_Y = "";

    var its_width = "";
    var its_height = "";

    var objects = new Array();

    function DrawRect() {
        ctx.beginPath();
        ctx.grobalAlpha = defoalpha;

        ctx.lineCap = "butt";
        ctx.linSize = defosize;
        ctx.strokeStyle = defocolor;


        //    ctx.clearRect(first_X, first_Y, (end_X - first_X), (end_Y - first_Y));

        //    ctx.clearRect(0, 0, canvas.width, canvas.height);
        //      ctx.strokeRect(first_X, first_Y, its_width,its_height);

        //        NowDrawingRect();

        for (var i = 0; i < objects.length; i++) {
            ctx.strokeRect(objects[i].X, objects[i].Y, objects[i].WIDTH, objects[i].HEIGHT);
        }

    }

    function NowDrawingRect() {
        ctx.beginPath();
        ctx.grobalAlpha = defoalpha;

        ctx.lineCap = "butt";
        ctx.linSize = defosize;
        ctx.strokeStyle = defocolor;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeRect(first_X, first_Y, its_width, its_height);
    }


    function onClick(e) {
        if (e.button === 0) {
            var rect = e.target.getBoundingClientRect();
            var X = (e.clientX - rect.left);
            var Y = (e.clientY - rect.top);

            first_X = X;
            first_Y = Y;

        };
    };


    function onMove(e) {
        var rect = e.target.getBoundingClientRect();
        var X = (e.clientX - rect.left);
        var Y = (e.clientY - rect.top);

        if (e.buttons === 1 || e.witch === 1) {

            its_width = (X - first_X)
            its_height = (Y - first_Y)

            NowDrawingRect();
        }

        DrawRect();
    }

    function drawEnd(e) {
        objects[objects.length] = new object(first_X, first_Y, its_width, its_height, ctx.strokeStyle, ctx.linSize);

        DrawRect();
    }

    function drawClear() {
        first_X = "";
        first_Y = "";
        end_X = "";
        end_Y = "";
    }


    function GetXMLHttpRequest() {
        var req = new XMLHttpRequest();
        req.open("GET", "Upload2.js", false);
        req.send("");
    }

})();


function object(X, Y, WIDTH, HEIGHT, COL, SIZE) {
    this.X = X;
    this.Y = Y;
    this.WIDTH = WIDTH;
    this.HEIGHT = HEIGHT;
    this.COL = COL;
    this.SIZE = SIZE;
}
