const title = document.getElementById("dif");
//const dif = document.getElementById("difficulty")
const config = {
  wait : 1000 ,
  speed : 100,
}
const content = title.textContent.trim();
//const difi = dif.textContent.trim()
//dif.textContent = '';
title.textContent = '';
let count = 0;
setTimeout(() =>{
  const counter = setInterval(() =>{
  
  title.textContent += content[count];
  count++;
   if(count >= content.length) {
    clearInterval(counter)
  }
  

},config.speed);
},config.wait)


//$("#difficulty").css({"display":"flex"});

const selection = ["easy","hard","impossible"]
let index = 0

$("#right").click(function(){
  if (index == 2){
    index = 0;
  } else {
    index++;
  }
  $("#difficulty").text(selection[index]);
})
$("#left").click(function(){
  if (index == 0){
    index = 2;
  } else {
    index--;
  }
  $("#difficulty").text(selection[index]);
})

