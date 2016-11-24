(function() {
    var setFileInput = $('.imgInput');

    setFileInput.each(function() {
        var selfFile = $(this),
            selfInput = $(this).find('input[type=file]');

        selfInput.change(function() {
            var file = $(this).prop('files')[0],
                fileRdr = new FileReader(),
                selfImg = selfFile.find('.imgView');

            if (!this.files.length) {
                if (0 < selfImg.size()) {
                    selfImg.remove();
                    return;
                }
            } else {
                if (file.type.match('image.*')) {
                    if (!(0 < selfImg.size())) {
                        selfFile.append('<img alt="" class="imgView">');
                    }
                    var prevElm = selfFile.find('.imgView');
                    fileRdr.onload = function() {
                        prevElm.attr('src', fileRdr.result);
                    }
                    fileRdr.readAsDataURL(file);
                } else {
                    if (0 < selfImg.size()) {
                        selfImg.remove();
                        return;
                    }
                }
            }
        });
    });
});
