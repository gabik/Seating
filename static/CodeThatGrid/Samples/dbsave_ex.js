//GLOBAL VARS
var DATE_FORMAT = "yyyy-mm-dd", CURRENCY_FORMAT = "$", EMPTY_ROW = "",
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
	useExportBar 	 : 0,
	useMultiSort	 : 0,
	useColTitle 	 : 1,
	amountPerPage : 20,
	datatype : 1,
        data : "",
	colDef : [
	{
		title : "ID",
		titleClass : "", //default for th
		type : "Number",
		width : 80, //auto
		alignment : "center",
		compareFunction : compare,
		isVisible : true,
		useAutoIndex : false,
		useAutoFilter : false,
		isReadOnly : true
	},
	{
		title : "Name",
		titleClass : "",
		type : "String",
		width : 0, //auto
		alignment : "",
		compareFunction : compare,
		isVisible : true,
		useAutoIndex : false,
		useAutoFilter : false
	},
	{
		title : "Reg. date",
		titleClass : "", //default for th
		type : "Date",
		width : 0, //auto
		alignment : "center",
		compareFunction : compare,
		isVisible : true,
		useAutoIndex : false,
		useAutoFilter : false
	},
	{
		title : "Kind",
		titleClass : "", //default for th
		type : "Number",
		width : 0, //auto
		alignment : "center",
		compareFunction : compare,
		isVisible : true,
		useAutoIndex : false,
		useAutoFilter : false
	},
	],
	tableStyle : {
		tableClass : {
			borderwidth : 0, bordercolor : "#bbbbbb", borderstyle : "solid"
		},
		bgcolor : "#ffffff",
		x : 0,
		y : 0	,
		width : 410,
		height : 260,
		overflow : "visible"
	},
	rowStyle : {
		defaultClass : {
			fontfamily : "Verdana", fontsize : "11px", backgroundcolor : "#ffffee", borderwidth : "0", borderstyle : "solid", bordercolor : "#ffffee"
		},
		markClass : {
			fontfamily : "Verdana", fontsize : "11px", backgroundcolor : "#ffffcc", borderwidth : "1", borderstyle : "solid", bordercolor : "#cccccc"
		},
		dragClass : {
			cursor : "move", borderwidth : "0"
		},
		width : 20,
		height : 21
	},
	colStyle : {
		defaultClass : {
			fontfamily : "Verdana", fontsize : "12px", backgroundcolor : "#ffffee", borderwidth : "0", borderstyle : "solid", bordercolor : "#ffffee"
		},
		markClass : {
			fontfamily : "Verdana", fontsize : "12px", backgroundcolor : "#ffffcc", borderwidth : "1", borderstyle : "solid", bordercolor : "#cccccc"
		},
		dragClass : {
			cursor : "move", borderwidth : "0"
		},
		width : 100,
		height : 21
	},
	cellStyle : {
		defaultClass : {
			borderwidth : "0", borderstyle : "solid", bordercolor : "#cfcfcf", fontfamily : "Arial", fontsize : "12px", backgroundcolor : "#ffffff", color : "#000000"
		},
		markClass : {
			borderwidth : "0", borderstyle : "solid", bordercolor : "#ffffee", fontfamily : "Arial", fontsize : "12px", backgroundcolor : "#ffffcc", color : "#000000"
		},
		currClass : {
			borderwidth : "1", borderstyle : "solid", bordercolor : "#cccccc", fontfamily : "Arial", fontsize : "12px", backgroundcolor : "#ffffcc", color : "#000000"
		}
	},
	toolBar : {
		height : 29,
		bgcolor : "#ffffff",
		defaultClass : {
			borderwidth : 0, bordercolor : "#bbbbbb", borderstyle : "solid"
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
		bgcolor : "#ffffff",
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