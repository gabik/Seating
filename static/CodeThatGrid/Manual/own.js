function openWin(w,h,u){
	var nw=window.open(u,'','copyhistory=0,directories=0,location=0,menubar=0,scrollbars=yes,status=0,toolbar=0,width='+w+',height='+h+',resizable=yes');
	//nw.moveTo(0,0);
	return false;
}