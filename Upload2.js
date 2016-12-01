

(function() {
    $('input[type=file]').after('<span></span>');
var file;
    // アップロードするファイルを選択
    $('input[type=file]').change(function() {
        file = $(this).prop('files')[0];

        var name = $(this).prop('files')[0].name;
        var num = $(this).prop('files')[0].size;

        // png画像以外は処理を停止
        if (!file.type === 'image/png') {
            $(this).val('');
            $('span').html('');
            return;
        }

        // 画像表示
        /*
        var reader = new FileReader();
        reader.onload = function() {
            var img_src = $('<img>').attr('src', reader.result);
            $('span').html(img_src);
        }
        */
        reader.readAsDataURL(file);
    });
});
