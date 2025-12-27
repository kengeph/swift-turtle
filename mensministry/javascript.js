var TableArray = [
    0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,
    0,0,0,0,0,0,0
    ]


function getBackground(cell, i)
{
    var elem = ("#"+cell.id);
    var int = TableArray[i];
    int++;
    int = int%3;
    TableArray[i] = int;
    $(elem).toggleClass("available", int==0);
    $(elem).toggleClass("semiAvailable", int==1);
    $(elem).toggleClass("unavailable", int==2);
//    alert(TableArray);
}

window.onload = function() {
    if(document.getElementById("theform"))
        document.getElementById("theform").addEventListener('submit', JSONFunc);
}

function JSONFunc(){
    document.getElementById("myArray").value = JSON.stringify(TableArray);
};



//$.ajax({ 
//       type: "POST", 
//       url: "insert.php", 
//       data: { kvcArray : TableArray}, 
//       success: function() { 
//              alert("Success"); 
//        } 
//}); 