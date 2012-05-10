// R = 0xFF
// G = 0x74
// B = 0x65
// 0x74 / 30 = 4.63 -> rounded to 5
// 0x65 / 30 = 5.13 -> rounded to 5
var output = 'var colorGradient = [';
var gradNum = 30;
var maxG = 0x74;
var maxB = 0x65;
var stepG = (0xff - maxG) / (gradNum);
var stepB = (0xff - maxB) / (gradNum);
for (var i=0; i <= gradNum; i++) {
  var numG = Math.round((maxG+(stepG*i))).toString(16);
  var numB = Math.round((maxB+(stepB*i))).toString(16);
  if (numG.length == 1) { numG = "0"+numG; }
  if (numB.length == 1) { numB = "0"+numB; }
  output += '"#ff'+numG+numB+'", ';
}
output = output.substring(0, (output.length-2));
output += '];';
console.log(output);
console.log("var gradientLen = "+(gradNum+1)+";");
