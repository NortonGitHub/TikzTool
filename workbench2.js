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
    var code = new Array();

    var f_name = "";

    canvas[0].addEventListener('mousedown', onClick, false);
    canvas[0].addEventListener('mousemove', onMove, false)  ;
    canvas[0].addEventListener('mouseup', drawEnd, false);
    canvas[0].addEventListener('mouseout', drawClear, false);

    $('#upload').change(function() {

        if (!this.files.length){
            alert('ファイルが選択されていません');
            return;
        }

       var file = this.files[0];

        if ( !canvas || !canvas[0].getContext) { return; }

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
        f_name = file.name;
    });

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

    function generateCode(){
        code.length = 0;

        const begin_figure = "\\begin{figure}[htbp]\n";
        const centering = "\\centering\n";
        const begin_tikz = "\\begin{tikzpicture}\n";
        const end_tikz = "\\end{tikzpicture}\n";
        const _caption = "\\caption{caption}\n";
        const _lebel = "\\label{label}\n";
        const end_figure ="\\end{figure}\n";

        code.push(begin_figure);
        code.push(centering);
        code.push(begin_tikz);

        var str = "\\node[anchor=south west,inner sep=0] at (0,0)";

        str = str + "{\\includegraphics[scale=1.00]{./" + f_name + "}};\n"
        code.push(str);

        for(var i=0;i < objects.length;i++){
            var rx = objects[i].X + objects[i].WIDTH;
            var ry = objects[i].Y + objects[i].HEIGHT;
            str = "\\draw[red,ultra thick, rounded corners] \n";
            str = str + "(" + objects[i].X + "," + objects[i].Y + 
            ") rectangle(" + rx + "," + ry + ");\n";
            code.push(str);
            str = "";
        }

        code.push(end_tikz);
        code.push(_caption);
        code.push(_lebel);
        code.push(end_figure);

        return code;
    }

    function onClick(e) {
        if(image.src == ""){
            return;
        }
        
        if (e.button === 0) {
            var rect = e.target.getBoundingClientRect();
            var X = (e.clientX - rect.left);
            var Y = (e.clientY - rect.top);

            first_X = X;
            first_Y = Y;
        }
    }

    function onMove(e) {

        if(image.src == ""){
            return;
        }

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

        if(image.src == ""){
            return;
        }

        objects[objects.length] = new object(first_X, first_Y, its_width, its_height, ctx.strokeStyle, ctx.linSize);

        DrawRect();
    }

    function drawClear(e) {
    }
    
    $('#btn_reset').on('click',function() {
        $("#reset").resetCanvas();
        DrawRect();
    });

    $('#btn_back').click(function(){
        objects.pop();
        DrawRect();
    });

    $('#btn_alert').click(function(){
        alert( parseInt(objects.length));
    });


    $(function(){
    $.fn.resetCanvas = function(e){
        objects.length = 0;
        its_width = "";
        its_height = ""; 
    }
    });

    $('#btn_generate').click(function(){
        var _result = generateCode();
        var _decision = "";
        for(var i = 0;i < _result.length;i++){
            _decision += _result[i];
        }

        $('#generate').val(_decision);
    });
});

function GetObjects(){
  return objects;
}

function object(X, Y, WIDTH, HEIGHT, COL, SIZE/*, TYPE*/) {
    this.X = X;
    this.Y = Y;
    this.WIDTH = WIDTH;
    this.HEIGHT = HEIGHT;
    this.COL = COL;
    this.SIZE = SIZE;
//    this.TYPE = TYPE;
}
