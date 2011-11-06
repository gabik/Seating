// CodeThatGrid/Table unit
// Version: 2.1.1 (01.20.05.1)
// Copyright (c) 2003-2005 by CodeThat.Com
// http://www.codethat.com/

var DATE_FORMAT="mm.dd.yyyy",CURRENCY_FORMAT=" $",URL_FORMAT="blank",EMPTY_ROW="...",DEFAULT_RESULT="<br>";var DEFAULT_COLDEF={title:"",titleClass:"",type:"String",width:80,alignment:"center",compareFunction:compare,userFunction:null,isVisible:1,isReadOnly:0,useAutoIndex:0,useAutoFilter:0};function changeCSS(obj,css){if(Def(CodeThat.findElement(obj)))CT_css(obj,css);};function changeStyleParam(obj,p,v){obj=CodeThat.findElement(obj);if(Def(obj))obj.style[p]=v;};function trimStr(str){if(Undef(str)||str=="")
return "";symbol=[" ","\n","\r","\t"];while(symbol.indexOf(str.charAt(0))!=-1)str=str.slice(1);while(symbol.indexOf(str.charAt(str.length-1))!=-1)str=str.slice(0,str.length-1);
return str;};function changeContent(obj,content){obj=CodeThat.findElement(obj);if(Def(obj))obj.innerHTML=content.replace(new RegExp("_STYLE_"),"style=\"width:"+obj.clientWidth+"px;height:"+obj.clientHeight+"px;\"");};function makeNameUnique(name){
return name+CodeThat.newID();};{var a=Array.prototype;a.indexOf=function(element){for(var i=0;i<this.length;i++)if(element.valueOf()==this[i].valueOf())
return i;
return-1;};a.setValue=function(arr){this.length=0;for(var i=0;i<arr.length;i++)this[i]=arr[i];};};function makeCssClass(style){var cssClass="",obj=null,z;if(Def(style)&&style.constructor!=String){var attr=["border-width","border-color","border-style","background-color","background-image","background-repeat","color","font-family","font-style","font-weight","font-size","text-align","text-decoration","vertical-align","padding","cursor"];for(z=0;z<attr.length;z++){obj=eval("style."+attr[z].replace(new RegExp("-"),""));if(Def(obj))cssClass+=attr[z]+":"+obj+";";};};
return cssClass;};function makeControl(control,action_on,action_off,css){var h="",img=null;if(Def(control)&&control.constructor==String){h=control;}else{if(Undef(action_on)&&Undef(action_off))h=((Def(control.img))?makeImgTag(control.img):"")+(Def(control.text)?" "+control.text:"");else{h="&nbsp;<a href=\""+action_on+"\" class="+css+">"+makeImgTag(control.img_on,null,control.text_on)+"</a>"+"&nbsp;<a href=\""+action_off+"\" class="+css+">"+makeImgTag(control.img_off,null,control.text_off)+"</a>";}};
return h;};function makeImgTag(img,id,text){var h="",obj=null,z;if(Def(img)&&Def(img.src)){var a=["src","width","height","border","alt","id"];if(Undef(img.id))img.id=id;if(Undef(img.alt))img.alt=text;if(Undef(img.border))img.border=0;for(z=0;z<a.length;z++){obj=eval("img."+a[z]);if(Def(obj))h+=a[z]+"=\""+obj+"\" ";};obj=new Image();obj.src=img.src;h="<img "+h+" >";}else{h=(Def(text))?text:"";};
return h;};function compare(op1,op2){if(Undef(op1)&&Undef(op2))
return 0;else if(Undef(op1)||typeof(op1)=='unknown')
return 1;else if(Undef(op2)||typeof(op2)=='unknown')
return-1;if(op1.constructor==String&&op2.constructor==String){op1=op1.toLowerCase();op2=op2.toLowerCase();};if(op1>op2)
return 1;else if(op1<op2)
return-1;else return 0;};function compareImage(op1,op2){if(Undef(op1)&&Undef(op2))
return 0;else if(Undef(op1))
return 1;else if(Undef(op2))
return-1;op1=op1.src;op2=op2.src;if(op1>op2)
return 1;else if(op1<op2)
return-1;else return 0;};function parseURL(urlVal){
return urlVal;};function formatURL(urlObj,target){if(Undef(urlObj))
return DEFAULT_RESULT;if(Def(target))
return "<a href=\""+urlObj+"\" target=\""+target+"\">"+urlObj+"</a>";else return "<a href=\""+urlObj+"\">"+urlObj+"</a>";};function parseEmail(emailVal){
return emailVal;};function formatEmail(emailObj){if(Undef(emailObj))
return DEFAULT_RESULT;
return "<a href=\"mailto:"+emailObj+"\">"+emailObj+"</a>";};function parseHTML(htmlVal){
return htmlVal.replace(/script>/ig,">");};function formatHTML(htmlObj){if(Undef(htmlObj))
return DEFAULT_RESULT;
return htmlObj;};function parseImage(imgDef){if(imgDef.constructor==String)eval("imgDef="+imgDef);var img=new Image();if(Def(imgDef)){img.src=imgDef.src;img.width=imgDef.width;img.height=imgDef.height;}else{img.src="";img.width=0;img.height=0;}
return img;};function formatImage(imgObj){if(Undef(imgObj))
return DEFAULT_RESULT;if(imgObj.width>0&&imgObj.height>0)
return "<img src=\""+imgObj.src+"\" width=\""+imgObj.width+"\" height=\""+imgObj.height+"\" border=\"0\">";else return DEFAULT_RESULT;};function parseString(strVal){if(Undef(strVal))
return strVal;if(ua.nn4)strVal=new String(strVal);
return strVal.replace(/<[^>]+>/ig,"")+"";};function formatString(strObj){if(Undef(strObj))
return DEFAULT_RESULT;
return strObj.replace(/\n/g,"<br>");};function parseNumber(numVal){if(Undef(numVal))
return numVal;else numVal=new String(numVal);numVal=numVal.replace(/,/g,'.');
return new Number(numVal);};function formatNumber(numObj){if(Undef(numObj))
return DEFAULT_RESULT;
return new String(numObj);};function parseCurrency(curVal){if(Undef(curVal))
return curVal;curVal=curVal.replace(/,/g,'.');
return new Number(curVal.replace(/[^0-9\-\/.]/g,''));};function formatCurrency(curObj,format){if(Undef(curObj))
return DEFAULT_RESULT;
return curObj+" "+format;};function parseDate(dateVal,format){if(Undef(dateVal))
return dateVal;var dateArr=["","","","","",""];if(dateVal==null)
return null;if(format.length!=dateVal.length)
return null;for(z=0;z<format.length;z++){switch(format.charAt(z)){case "d":dateArr[0]+=dateVal.charAt(z);break;case "m":dateArr[1]+=dateVal.charAt(z);break;case "y":dateArr[2]+=dateVal.charAt(z);break;case "h":dateArr[3]+=dateVal.charAt(z);break;case "i":dateArr[4]+=dateVal.charAt(z);break;case "s":dateArr[5]+=dateVal.charAt(z);break;}};for(z=0;z<dateArr.length;z++){if(isNaN(dateArr[z]))
return null;dateArr[z]=new Number(dateArr[z]);};if(dateArr[0]<1||dateArr[0]>31)
return null;if(dateArr[2]<100){dateArr[2]+=1900;if(dateArr[2]<1950)dateArr[2]+=100;}if(dateArr[3]>24)
return null;if(dateArr[5]>60)
return null;if(dateArr[0]==31&&(dateArr[1]==2||dateArr[1]==4||dateArr[1]==6||dateArr[1]==9||dateArr[1]==11))
return null;if(dateArr[0]==29&&dateArr[1]==2&&dateArr[2]%4!=0)
return null;
return new Date(dateArr[2],dateArr[1]-1,dateArr[0],dateArr[3],dateArr[4],dateArr[5]);};function formatDate(dateObj,format){if(Undef(dateObj))
return DEFAULT_RESULT;if(dateObj.constructor!=Date)
return DEFAULT_RESULT;var dateArr=[new String(dateObj.getDate()),new String(dateObj.getMonth()+1),new String(dateObj.getFullYear()),new String(dateObj.getHours()),new String(dateObj.getMinutes()),new String(dateObj.getSeconds())],formatArr=["","","","","",""];for(z=0;z<format.length;z++){switch(format.charAt(z)){case "d":formatArr[0]+=format.charAt(z);break;case "m":formatArr[1]+=format.charAt(z);break;case "y":formatArr[2]+=format.charAt(z);break;case "h":formatArr[3]+=format.charAt(z);break;case "i":formatArr[4]+=format.charAt(z);break;case "s":formatArr[5]+=format.charAt(z);break;}}for(z=0;z<dateArr.length;z++){if(formatArr[z]!=""){if(formatArr[z].length<dateArr[z].length)dateArr[z]=dateArr[z].slice(dateArr[z].length-formatArr[z].length,dateArr[z].length);while(dateArr[z].length<formatArr[z].length)dateArr[z]="0"+dateArr[z];format=format.replace(new RegExp(formatArr[z]),dateArr[z]);}}
return format;};