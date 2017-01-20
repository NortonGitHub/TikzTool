$(function(){
    $('#upload').change(function() {

        if (!this.files.length){
            alert('ファイルが選択されていません');
            return;
        }

       var file = this.files[0];

       var canvas = $('#draw');

	   var ctx = canvas[0].getContext('2d');

        if ( !canvas || !canvas[0].getContext ) { return; }

	   var image = new Image();
       var reader = new FileReader();

	   reader.onload = function(evt){
            image.onload = function(){
                // (3) プレビュー(Cnavas)のサイズを指定
                var cnvsH = 240;
                var cnvsW = image.naturalWidth*cnvsH/image.naturalHeight;
                // (4) Cnavasにサイズアトリビュートを設定する
                canvas.attr('width', cnvsW);
                canvas.attr('height', cnvsH);
                ctx.drawImage(image, 0, 0,cnvsW,cnvsH); //canvasに画像を転写
            }
            image.src = evt.target.result;
        }
        reader.readAsDataURL(file);
    })
})