$(function(){

    //----- whole init
    var canvas = $('#draw');
    var ctx = canvas[0].getContext('2d');

    var image = new Image();
    var reader = new FileReader();

    var paint_mode = "line";
    var drawing = false;
    var pen_color = "red";

    //----- canvas init
    const PX_96DPI = 0.75;

    var X_DPI = 0;
    var Y_DPI = 0;

    var defosize = 7;
    var defocolor = "red";
    var defoalpha = 1.0;

    var its_width = "";
    var its_height = "";

    var cnvsH = 0.0;
    var cnvsW = 0.0;

    var objects = new Array();
    var code = new Array();

    var rect = "";  //canvasのクライアント領域の位置

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
                cnvsH = image.naturalHeight;
                cnvsW = image.naturalWidth;
                canvas.attr('width', cnvsW);
                canvas.attr('height', cnvsH);
                //ctx.rotate((Math.PI / 180)*180);
                //ctx.translate(0.0,cnvsH);
                //ctx.setTransform(1.0,(Math.PI / 180)*180,1.0,0.0,-0.0,cnvsH);
                //引数の意味は、transform(伸縮x, 傾斜y, 傾斜x, 伸縮y, 移動x, 移動y)
                //ctx.setTransform(1.0,)
            }
            image.src = e.target.result;
            //X_DPI = window.parent.screen.width//screen.logicalXDPI;
            //Y_DPI = window.parent.screen.height;//screen.logicalYDPI;
        }
        reader.readAsDataURL(file);
        f_name = file.name;
    });

    function DrawFigure(){
        ctx.grobalAlpha = defoalpha;

        ctx.lineCap = "butt";
        ctx.lineSize = defosize;

        ctx.drawImage(image, 0, 0);

        for (var i = 0; i < objects.length; i++) {
            var obj = objects[i];
            ctx.strokeStyle = obj.COL;
            if(obj.TYPE == "line"){
                ctx.beginPath();
                ctx.moveTo(obj.X, obj.Y);
                ctx.lineTo(obj.X + obj.WIDTH, obj.Y + obj.HEIGHT);
                ctx.closePath();
                ctx.stroke();
            }
            else if(obj.TYPE == "rect"){
                ctx.strokeRect(obj.X, obj.Y, obj.WIDTH, obj.HEIGHT);
            }
        }
    }


    function NowDrawing(now_X, now_Y) {
        ctx.beginPath();

        ctx.moveTo(first_X, first_Y);

        ctx.strokeStyle = pen_color;

        if(paint_mode == "line"){
            ctx.lineTo(now_X, now_Y);
        }
        else if(paint_mode == "rect"){

            var _fX = first_X, _fY = first_Y;
            var _nX = now_X, _nY = now_Y;

            if(_fX > _nX){
                var temp = _fX;
                _fX = _nX;
                _nX = temp;
            }

            if(_fY > _nY){
                var temp = _fY;
                _fY = _nY;
                _nY = temp;
            }

             var _width = _nX - _fX
            var _height = _nY - _fY;

            ctx.rect(_fX,_fY,_width,_height);

        }

        ctx.closePath();
        ctx.stroke();
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
            var rx = objects[i].TRANS_X2;// + objects[i].WIDTH;
            var ry = objects[i].TRANS_Y2;// + objects[i].HEIGHT;

            var fig_format = GetFigureTypeCode(objects[i].TYPE);

            str = "\\draw[" + objects[i].COL + ",ultra thick] \n";
            str = str + "(" + objects[i].TRANS_X1 + "bp," + objects[i].TRANS_Y1 +
            "bp)" + fig_format +"(" + rx + "bp," + ry + "bp);\n";
            code.push(str);
            str = "";
        }

        code.push(end_tikz);
        code.push(_caption);
        code.push(_lebel);
        code.push(end_figure);

        return code;
    }

    function GetFigureTypeCode(type){
        if(type == "line"){
            return "--";
        }
        else if(type == "rect"){
            return "rectangle";
        }
        return "";
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

            drawing = true;
        }
    }

    function onMove(e) {

        if(image.src == "" || drawing != true){
            return;
        }

        rect = e.target.getBoundingClientRect();
        var X = (e.clientX - rect.left);
        var Y = (e.clientY - rect.top);

        if (e.buttons === 1 || e.witch === 1) {
            its_width = (X - first_X);
            its_height = (Y - first_Y);
        }
        //DrawRect();
        DrawFigure();
        NowDrawing(X, Y);
    }

    function drawEnd(e) {

        if(image.src == ""){
            return;
        }

        rect = e.target.getBoundingClientRect();
        var X = (e.clientX - rect.left);
        var Y = (e.clientY - rect.top);

        if(paint_mode != "line"){
        if(first_X > X){
            var temp = first_X;
            first_X = X;
            X = temp;
        }

        if(first_Y > Y){
            var temp = first_Y;
            first_Y = Y;
            Y = temp;
        }
        }

        its_width = (X - first_X);
        its_height = (Y - first_Y);

        objects[objects.length] = new object(first_X, first_Y, first_X * PX_96DPI, (cnvsH - first_Y) * PX_96DPI, X * PX_96DPI, (cnvsH - Y) * PX_96DPI,
                     its_width, its_height, pen_color, ctx.linSize, paint_mode);

        //DrawRect();
        DrawFigure();

        drawing = false;
    }

    function drawClear(e) {
    }

    $('#btn_reset').on('click',function() {
        $("#reset").resetCanvas();
        DrawFigure();
        //DrawRect();
    });

    $('#btn_back').click(function(){
        objects.pop();
        DrawFigure();
        //DrawRect();
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

    $('#btn_toClipboard').click(function(){
        var clipboard = new Clipboard('.btn_copy');
    });

    $('#paint_mode').change(function(){
        paint_mode = $(this).val();
    }
    );

    $('#select-color').change(function(){
        pen_color = $(this).val();
    });

    function GetObjects(){
        return objects;
    }

    function object(X, Y, TRANS_X1,TRANS_Y1, TRANS_X2, TRANS_Y2, WIDTH, HEIGHT, COL, SIZE, TYPE) {
        this.X = X;
        this.Y = Y;
        this.TRANS_X1 = TRANS_X1;
        this.TRANS_Y1 = TRANS_Y1;
        this.TRANS_X2 = TRANS_X2;
        this.TRANS_Y2 = TRANS_Y2;
        this.WIDTH = WIDTH;
        this.HEIGHT = HEIGHT;
        this.COL = COL;
        this.SIZE = SIZE;
        this.TYPE = TYPE;
    }
});
