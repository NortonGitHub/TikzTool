
var text;
var _objects = new Array();

function readCanvas(){

    document.write("here is before of read <br>");
    document.write('<script type="text/javascript" language="JavaScript" src="Canvas.js"></script>');

  var temp = GetObjects();

  for(var i=0;i<temp.length;i++){
    _objects[i] = temp[i];
  }
    document.write("here is read<br>");
}

function exports(){
  document.write("<p>");
  document.write("here<br>");
  document.write(_objects[0].X);
  document.write("</p>");
}

function main(){
  document.write("here is main<br>");
  readCanvas();
  exports();
}
