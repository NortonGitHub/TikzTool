

(function() {

    var canvas = document.getElementById('sample');

    if ( ! canvas || ! canvas.getContext ) { return false; }

    var ctx = canvas.getContext('2d');

    var img = new Image();    //新規画像オブジェクト
    img.src = "./cat.jpg";   //読み込みたい画像のパス

    ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(0, 0, 320, 399);


    canvas.addEventListener('mousedown', onClick, false);
    canvas.addEventListener('mousemove', onMove, false);
    canvas.addEventListener('mouseup', drawEnd, false);
    canvas.addEventListener('mouseout', drawClear, false);

    var defosize = 7;
    var defocolor = "#555555";
    var defoalpha = 1.0;

    var its_width = "";
    var its_height = "";

    var objects = new Array();

    function DrawRect() {
        ctx.beginPath();
        ctx.grobalAlpha = defoalpha;

        ctx.lineCap = "butt";
        ctx.linSize = defosize;
        ctx.strokeStyle = defocolor;

        ctx.drawImage(img, 0, 0);

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
        ctx.drawImage(img, 0, 0);
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
    }

    function eraserAll(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        objects = [];
    }


    function GetXMLHttpRequest() {
        var req = new XMLHttpRequest();
        req.open("GET", "Upload2.js", false);
        req.send("");
    }

})();

function GetObjects(){
  return objects;
}

function object(X, Y, WIDTH, HEIGHT, COL, SIZE) {
    this.X = X;
    this.Y = Y;
    this.WIDTH = WIDTH;
    this.HEIGHT = HEIGHT;
    this.COL = COL;
    this.SIZE = SIZE;
}
