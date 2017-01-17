
$('#upload').change(function() {
	var canvas = $('#draw').get(0);

    if ( ! canvas || ! canvas.getContext ) { return false; }

	var ctx = canvas.getContext('2d');

	var file = this.files[0];

	var image = new Image();
	var reader = new FileReader();

/*
    $('#draw').addEventListeneraddEventListener('mousedown', onClick, false);
    $('#draw').addEventListener('mousemove', onMove, false);
    $('#draw').addEventListener('mouseup', drawEnd, false);
    $('#draw').addEventListener('mouseout', drawClear, false);
*/
	reader.onload = function(evt){

		image.onload = function(){
			ctx.drawImage(image,0,0);
		}

		image.src = evt.target.result;
	}

	reader.readAsDataURL(file);

}
);