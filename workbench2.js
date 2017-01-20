$(function(){

    //----- whole init
    var canvas = $('#draw');
    var ctx = canvas[0].getContext('2d');

    var image = new Image();
    var reader = new FileReader();

    //----- canvas init
    var defosize = 7;
    var defocolor = "#FF0000";
    var defoalpha = 1.0; 

    var its_width = "";
    var its_height = "";

    var objects = new Array();

    $('#upload').change(function() {

        if (!this.files.length){
            alert('ファイルが選択されていません');
            return;
        }

       var file = this.files[0];

        if ( !canvas || !canvas[0].getContext ) { return; }

	   reader.onload = function(e){
            image.onload = function(){
                ctx.beginPath();
                objects.length = 0;
                var cnvsH = image.naturalHeight;
                var cnvsW = image.naturalWidth;
                canvas.attr('width', cnvsW);
                canvas.attr('height', cnvsH);
            }
            image.src = e.target.result;
        }
        reader.readAsDataURL(file);
    })

    function DrawRect() {
        ctx.beginPath();
        ctx.grobalAlpha = defoalpha;

        ctx.lineCap = "butt";
        ctx.lineSize = defosize;
        ctx.strokeStyle = defocolor;

        ctx.drawImage(image, 0, 0);

        for (var i = 0; i < objects.length; i++) {
            ctx.strokeRect(objects[i].X, objects[i].Y, objects[i].WIDTH, objects[i].HEIGHT);
        }
    }

    function NowDrawingRect() {
        ctx.beginPath();
        ctx.grobalAlpha = defoalpha;

        ctx.lineCap = "butt";
        ctx.lineSize = defosize;
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
        }
    }

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

    function drawClear(e) {
    }

    canvas[0].addEventListener('mousedown', onClick, false);
    canvas[0].addEventListener('mousemove', onMove, false)  ;
    canvas[0].addEventListener('mouseup', drawEnd, false);
    canvas[0].addEventListener('mouseout', drawClear, false);
})

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
