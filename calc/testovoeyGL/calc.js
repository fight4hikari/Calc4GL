
//var operators= new Set (["-","+","*","/","."]);
var operators=["-","+","*","/",".","(",")"]; //using object allows us to add some new operators if u need to
var buttonsToPress=["0","1","2","3","4","5","6","7","8","9"];
var last="0"; //last inputed symbol by user
var current; //current inputed symbol by user
var count=0; //counting error alerts
var numberOver=0;

$("document").ready(function(){

  $("input").on("keypress", checkTyped);
  $(".opsButtons").on("click", setBtnValue);
  $(".numberButtons").on("click", setBtnValue);
});

function checkInputError(current){//checking input string for errors, returns true if find any so setBtnValue or checkTyped doesnt need to do anything
  let inner=getInnerInput();
  if(inner=="0"&&(buttonsToPress.includes(current)||current=="("||current==")")){//replacing default 0 for first inputed symbol with number
    setInnerInput(current);
    console.log("first")
    return true;
  };
  if((inner=="0"&&current==".")){ //setting first inputed "." as 0.
    setInnerInput("0.");
    console.log("second")
    return true;
  };
  if(last=="/"&&(current=="-"||current==".")){ //so the input item can contain "4/-5" or 4/.5 in input text
	console.log("third")
  if(current==".") {setInnerInput(inner+"0."); return true;};
    return false;
  };
  if((last=="+"||last=="*"||last=="/"||last=="-")&&current=="."){ //so the input item can contain "5/0.", "6*0."
    setInnerInput(inner+"0.");
    console.log("forth")
    return true;
    };
  operators.forEach(function (item){//checking non double operators in input text
	for(var key of operators){
		if(last==key&&current==item){// last and current inputed symbol are operators
			c();
			console.log("fivth")
            return false;
		}
	};
  });
};

function checkTyped () { //checking inputed key by user within keyboard, dont let to use "A-z", could also be used atr "pattern" for input element
  let inner=getInnerInput();
  let charOfBtn=getChar(event); //cross-browser function to get char of the pressed button
  if(!(operators.includes(charOfBtn)||buttonsToPress.includes(charOfBtn))){ //checking if were pressed buttons that not allowed, when using set instead of obj u need to use operators.has(charOfBtn)
	return false;
  };
  if(isFinite(charOfBtn)&&charOfBtn=="9")
  {
    numberOver++;
  };
 if(checkInputError(charOfBtn)){//checking for input errors (double ops, first symbol etc)
  last=charOfBtn;//setting last inputed symbol for next call checkInputError
  return false;
  };
  last=charOfBtn;
  console.log(last);
};

function setBtnValue(){ //for onclick buttons event to add text into input item
	current=$(this).text(); //u can use class or atr to get properly value of the button, currently using innerText
  if(isFinite(current)&&current=="9")
  {
    numberOver++;
  };
  if(!checkInputError(current)){
		setInnerInput((getInnerInput()+current));
	};
	last=current;
	console.log(last);
};
//set and get functions for unput item
function setInnerInput(value){
	$("input")[0].value=`${value}`;
};

function getInnerInput(){
	let innerInput=$("input")[0].value;
	return innerInput;
};
//for onclick event of buttons to clear text in the input item
/*
function reset(){
if(event.target.innerText=="c"){
let innerText=getInnerInput();
let newForm= Array.prototype.slice.call(innerText);
newForm.pop();
if(innerText.length=="1")
  {setInnerInput("0");
  } else
    setInnerInput(newForm.join(""));
} else {
	setInnerInput("0");
};
};
*/
function ce(){
	setInnerInput("0");
};
function c(){
	let innerText=getInnerInput();
	let newForm= Array.prototype.slice.call(innerText);
	newForm.pop();
	if(event.currentTarget.innerText=="<" && innerText.length==1){ //checking that function was called by button "<", it could be called by checkInputError
			ce();
			}else {
		setInnerInput(newForm.join(""));}
	if(event.currentTarget.innerText=="<"){
		last="c";
	};
	console.log(last);
};
function onError(message){ //checking result when button "=" was pressed
  var alertMsg=$("<div></div>").text(`${message}`); //creating alert block
  alertMsg.addClass("alert");
  if(count==5){count=0; return;}// dont allow more then 9 messages at one time on the screen
	if(count>=1){
	   newHeight=parseInt($(".alert").css("margin-top"))+115;
     alertMsg.css("margin-top",`+=${newHeight}`);
	};
	$(".wrapper").prepend(alertMsg);
  alertMsg.effect( "shake", {direction: "up", times:2}, 700 );
	setTimeout(
		function(){
      alertMsg.fadeOut(5000);
		},5000);
	setTimeout(
		function (){
      alertMsg.remove();
		},10001);
		count++;//to let us know if we have more then 1 alert on the page
};

function result(){//onclik function for button "="
	try{
	  let resulted =eval(getInnerInput());//making eval not evil
	  if(resulted!==resulted){//checking for NaN
		  onError("Зачем делить 0 на 0, если получишь ошибку?");
		  setInnerInput("0"); return;
	  };
    if(numberOver==16)
    {
      onError("Прости, но твое вычисление будет неверным. Number overflow :)")
    };
	  setInnerInput(resulted);
	} catch (err){
		onError(`Проверьте выражение.
      Вероятно, в нем ошибка :)`);
	  };
  };
