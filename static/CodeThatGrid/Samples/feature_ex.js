//GLOBAL VARS
var DATE_FORMAT = "dd.mm.yyyy", CURRENCY_FORMAT = "$", EMPTY_ROW = "",
DEFAULT_COLDEF = {
	title : "",
	titleClass : "",
	type : "String", //the default type
	width : 80,
	alignment : "",
	compareFunction : compare,
	isVisible : 1,
	isReadOnly : 0,
	useAutoIndex : 0,
	useAutoFilter : 0
};
//-----------------------------------------------------------------------------------
//GRID DEFINITION
//-----------------------------------------------------------------------------------
var gridDef = {
	useExportBar 	 : true,
	useMultiSort	 : true,
	useColTitle 	 : true,
	datatype 		 : 0,
	data : [["1", "Stiles James", "01.01.2002", "7"], ["2", "Alexander Jacklynn", "12.05.2003", "2"], ["3", "Martin Barney", "01.01.2002", "2"], ["4", "Gelinas Patricia", "18.07.2003", "2"], ["5", "Cooke Dee", "02.05.2002", "2"], ["6", "Greiner Andrew", "08.01.2003", "2"], ["7", "Maillet Chad", "01.01.2002", "2"], ["8", "Batson Alecia", "01.01.2002", "2"], ["9", "Gato Timothy", "01.01.2002", "2"], ["10", "Wheeler Skip", "01.01.2002", "2"], ["11", "Davis Mackenzie", "01.01.2002", "2"], ["12", "Hatch Jennie", "01.01.2002", "3"], ["13", "picano anthony", "06.01.2003", "4"], ["14", "Bernard Ashley", "11.10.2003", "7"], ["15", "Masabny Rob", "01.01.2002", "2"], ["16", "Philbrick John", "01.01.2002", "2"], ["17", "Tella Bob", "01.01.2002", "2"], ["18", "Keister Jennifer", "07.10.2002", "2"], ["19", "Doherty Jr. Billy", "30.08.2003", "2"], ["20", "Lozeau Danielle", "27.08.2003", "2"], ["21", "Barnes Anastasia", "01.01.2002", "2"], ["22", "Zanidakis Zoe", "12.08.2003", "2"], ["23", "Price Dennis", "26.08.2003", "2"], ["24", "Morrison Christine", "17.08.2003", "2"], ["25", "Ann Rachael", "13.08.2003", "2"], ["26", "Brodsky Jason", "21.08.2003", "2"], ["27", "Dow Scott", "18.12.2002", "2"], ["28", "Perillo Andy", "01.01.2002", "2"], ["29", "Burgess Terry", "01.01.2002", "2"], ["30", "Vallory Amanda", "23.08.2003", "2"], ["31", "wentworth brendan", "02.01.2004", "4"], ["32", "Ziobro Peter", "27.10.2003", "3"], ["33", "Winters Scott", "01.01.2002", "2"], ["34", "Shea Kevin", "03.11.2003", "2"], ["35", "Bowring Tina", "07.08.2003", "2"], ["36", "Roosevelt Maura", "06.08.2003", "1"], ["37", "Payne Christopher", "07.01.2003", "2"], ["38", "peterson william", "06.08.2003", "2"], ["39", "Childers Eva", "03.01.2004", "2"], ["40", "Meyer Richard", "16.09.2002", "2"], ["41", "Berkrot Peter", "19.09.2002", "2"], ["42", "Currier Justine/Janelle", "01.01.2002", "2"], ["43", "Perry Kevin", "01.01.2002", "2"], ["44", "LOMBARDI TOM", "04.08.2003", "2"], ["45", "Steele William", "01.01.2002", "2"], ["46", "Smith-Lycette Monique", "01.01.2002", "2"], ["47", "Boiros Ashleigh", "06.06.2002", "2"], ["48", "Peters Ellen", "28.04.2003", "2"], ["49", "Gorgone Dan", "13.08.2002", "4"], ["50", "Barclay Roberta", "27.07.2002", "4"]],
	colDef : [
	{
		title : "ID",
		titleClass : "", //default for th
		type : "Number",
		width : 0, //auto
		alignment : "center",
		compareFunction : compare,
		isVisible : false,
		useAutoIndex : true,
		useAutoFilter : false
	},
	{
		title : "Name",
		titleClass : "",
		type : "String",
		width : 200, //auto
		alignment : "",
		compareFunction : compare,
		isVisible : true,
		useAutoIndex : true,
		useAutoFilter : true
	},
	{
		title : "Reg. date",
		titleClass : "", //default for th
		type : "Date",
		width : 100, //auto
		alignment : "center",
		compareFunction : compare,
		isVisible : true,
		useAutoIndex : true,
		useAutoFilter : true
	},
	{
		title : "Kind",
		titleClass : "", //default for th
		type : "Number",
		width : 50, //auto
		alignment : "center",
		compareFunction : compare,
		isVisible : true,
		useAutoIndex : true,
		useAutoFilter : true
	} ],
	tableStyle : {
		tableClass : {
			borderwidth : 1, bordercolor : "#bbbbbb", borderstyle : "solid"
		},
		bgcolor : "#ffffff",
		x : 10,
		y : 10,
		width : 520,
		height : 450
	},
	rowStyle : {
		defaultClass : {
			fontfamily : "Verdana", fontsize : "11px", backgroundcolor : "#D4D0C8", borderwidth : "1", borderstyle : "outset", bordercolor : "#cccccc"
		},
		markClass : {
			fontfamily : "Verdana", fontsize : "11px", backgroundcolor : "#ccccff", borderwidth : "1", borderstyle : "outset", bordercolor : "#cccccc"
		},
		dragClass : {
			cursor : "move", borderwidth : "0"
		},
		width : 20,
		height : 21
	},
	colStyle : {
		defaultClass : {
			fontfamily : "Verdana", fontsize : "12px", backgroundcolor : "#D4D0C8", borderwidth : "1", borderstyle : "outset", bordercolor : "#cccccc"
		},
		markClass : {
			fontfamily : "Verdana", fontsize : "12px", backgroundcolor : "#ccccff", borderwidth : "1", borderstyle : "outset", bordercolor : "#cccccc"
		},
		dragClass : {
			cursor : "move", borderwidth : "0"
		},
		width : 100,
		height : 21
	},
	cellStyle : {
		defaultClass : {
			borderwidth : "1", borderstyle : "solid", bordercolor : "#cfcfcf", fontfamily : "Arial", fontsize : "12px", backgroundcolor : "#ffffff", color : "#000000"
		},
		markClass : {
			borderwidth : "1", borderstyle : "outset", bordercolor : "#D4D0C8", fontfamily : "Arial", fontsize : "12px", backgroundcolor : "#cfcfcf", color : "#000000"
		},
		currClass : {
			borderwidth : "2", borderstyle : "solid", bordercolor : "#000000", fontfamily : "Arial", fontsize : "12px", backgroundcolor : "#ffffff", color : "#000000"
		}
	},
	toolBar : {
		height : 29,
		bgcolor : "#D4D0C8",
		defaultClass : {
			borderwidth : 0
		},
		buttons : [
		{
			name : "addrowto",
			img_on : {
				src : "img/addrowto.gif", width : "16", height : "16"
			},
			img_off : {
				src : "img/addrowto_off.gif", width : "16", height : "16"
			},
			text : "Add row before current one"
		},
		{
			name : "addrowafter",
			img_on : {
				src : "img/addrowafter.gif", width : "16", height : "16"
			},
			img_off : {
				src : "img/addrowafter_off.gif", width : "16", height : "16"
			},
			text : "Add row after current one"
		},
		{
			name : "delrow",
			img_on : {
				src : "img/delrow.gif", width : "16", height : "16"
			},
			img_off : {
				src : "img/delrow_off.gif", width : "16", height : "16"
			},
			text : "Delete row"
		},
		{ }, //separator
		{
			name : "addcolto",
			img_on : {
				src : "img/addcolto.gif", width : "16", height : "16"
			},
			img_off : {
				src : "img/addcolto_off.gif", width : "16", height : "16"
			},
			text : "Add column before current one"
		},
		{
			name : "addcolafter",
			img_on : {
				src : "img/addcolafter.gif", width : "16", height : "16"
			},
			img_off : {
				src : "img/addcolafter_off.gif", width : "16", height : "16"
			},
			text : "Add column after current one"
		},
		{
			name : "delcol",
			img_on : {
				src : "img/delcol.gif", width : "16", height : "16"
			},
			img_off : {
				src : "img/delcol_off.gif", width : "16", height : "16"
			},
			text : "Delete column"
		},
		{ }, //separator
		{
			name : "copy",
			img_on : {
				src : "img/copy.gif", width : "16", height : "16"
			},
			img_off : {
				src : "img/copy_off.gif", width : "16", height : "16"
			},
			text : "Copy"
		},
		{
			name : "paste",
			img_on : {
				src : "img/paste.gif", width : "16", height : "16"
			},
			img_off : {
				src : "img/paste_off.gif", width : "16", height : "16"
			},
			text : "Pasting data from current cell"
		},
		{ },
		{
			name : "sortasc",
			img_on : {
				src : "img/sortasc.gif", width : "16", height : "16"
			},
			img_off : {
				src : "img/sortasc_off.gif", width : "16", height : "16"
			},
			text : "Sort data in current column in ascending order"
		},
		{
			name : "sortdesc",
			img_on : {
				src : "img/sortdesc.gif", width : "16", height : "16"
			},
			img_off : {
				src : "img/sortdesc_off.gif", width : "16", height : "16"
			},
			text : "Sort data in current column in descending order"
		},
		{
			name : "multisortasc",
			img_on : {
				src : "img/multisortasc.gif", width : "16", height : "16"
			},
			img_off : {
				src : "img/multisortasc_off.gif", width : "16", height : "16"
			},
			text : "Keep current order and sort data in current column in ascending order"
		},
		{
			name : "multisortdesc",
			img_on : {
				src : "img/multisortdesc.gif", width : "16", height : "16"
			},
			img_off : {
				src : "img/multisortdesc_off.gif", width : "16", height : "16"
			},
			text : "Keep current order and sort data in current column in descending order"
		},
		{
			name : "resetsort",
			img_on : {
				src : "img/resetsort.gif", width : "16", height : "16"
			},
			img_off : {
				src : "img/resetsort_off.gif", width : "16", height : "16"
			},
			text : "Reset sort"
		},
		{ },
		{
			name : "formatbold",
			img_on : {
				src : "img/formatbold.gif", width : "16", height : "16"
			},
			img_off : {
				src : "img/formatbold_off.gif", width : "16", height : "16"
			},
			text : "Format bold"
		},
		{
			name : "formatitalic",
			img_on : {
				src : "img/formatitalic.gif", width : "16", height : "16"
			},
			img_off : {
				src : "img/formatitalic_off.gif", width : "16", height : "16"
			},
			text : "Format italic"
		},
		{
			name : "formatunderline",
			img_on : {
				src : "img/formatunderline.gif", width : "16", height : "16"
			},
			img_off : {
				src : "img/formatunderline_off.gif", width : "16", height : "16"
			},
			text : "Format underline"
		},
		{ },
		{
			name : "alignleft",
			img_on : {
				src : "img/alignleft.gif", width : "16", height : "16"
			},
			img_off : {
				src : "img/alignleft_off.gif", width : "16", height : "16"
			},
			text : "Align left"
		},
		{
			name : "aligncenter",
			img_on : {
				src : "img/aligncenter.gif", width : "16", height : "16"
			},
			img_off : {
				src : "img/aligncenter_off.gif", width : "16", height : "16"
			},
			text : "Align center"
		},
		{
			name : "alignright",
			img_on : {
				src : "img/alignright.gif", width : "16", height : "16"
			},
			img_off : {
				src : "img/alignright_off.gif", width : "16", height : "16"
			},
			text : "Align right"
		},
		{ },
		{
			name : "setsearch",
			img_on : {
				src : "img/setsearch.gif", width : "16", height : "16"
			},
			text : "Search in grid"
		},
		{
			name : "resetsearch",
			img_on : {
				src : "img/resetsearch.gif", width : "16", height : "16"
			},
			text : "Reset search. Show all records."
		},
		{
			name : "setamount",
			img_on : {
				src : "img/setamount.gif", width : "16", height : "16"
			},
			text : "Set count of records per page"
		} ]
	},
	statusBar : {
		height : 15,
		bgcolor : "#D4D0C8",
		defaultClass : {
			color : "#000000", fontfamily : "Verdana", fontsize : "11px"
		},
		messageClass : {
			color : "#0000ff", fontfamily : "Verdana", fontsize : "11px"
		},
		fieldText : "Field",
		valueText : "Value"
	},
	pageTurnBar : {
		defaultClass : {
			backgroundcolor : "#ffffff", fontsize : "11px", fontfamily : "Verdana,Arial"
		},
		activeClass : {
			backgroundcolor : "#D4D0C8", fontsize : "11px", fontfamily : "Verdana,Arial"
		},
		img_on : {
			src : "img/t_on.gif"
		},
		img_off : {
			src : "img/t_off.gif"
		},
		text : "Page", width : 65, height : 14
	}
}; 