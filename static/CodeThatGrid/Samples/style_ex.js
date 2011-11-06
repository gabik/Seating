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
	useColTitle 	 : true,
	useExportBar 	 : false,
	useMultiSort	 : false,
	useRCID 		 : true,
	amountPerPage : 15,
	datatype 		 : 0,
	data 			 : [[{
		src : 'img/addrowto.gif', width : 16, height : 16
	}, 'addrowto', 'Add row before current one', 'Toolbar'],
	[{
		src : 'img/addrowafter.gif', width : 16, height : 16
	}, 'addrowafter', 'Add row after current one', 'Toolbar'],
	[{
		src : 'img/delrow.gif', width : 16, height : 16
	}, 'delrow', 'Delete row', 'Toolbar'],
	[{
		src : 'img/addcolto.gif', width : 16, height : 16
	}, 'addcolto', 'Add column before current one', 'Toolbar'],
	[{
		src : 'img/addcolafter.gif', width : 16, height : 16
	}, 'addcolafter', 'Add column after current one', 'Toolbar'],
	[{
		src : 'img/delcol.gif', width : 16, height : 16
	}, 'delcol', 'Delete column', 'Toolbar'],
	[{
		src : 'img/sortasc.gif', width : 16, height : 16
	}, 'sortasc', 'Sort in ascending order', 'Toolbar'],
	[{
		src : 'img/sortdesc.gif', width : 16, height : 16
	}, 'sortdesc', 'Sort in descending order', 'Toolbar'],
	[{
		src : 'img/multisortasc.gif', width : 16, height : 16
	}, 'multisortasc', 'Multi Sort in ascending order', 'Toolbar'],
	[{
		src : 'img/multisortdesc.gif', width : 16, height : 16
	}, 'multisortdesc', 'Multi Sort in descending order', 'Toolbar'],
	[{
		src : 'img/resetsort.gif', width : 16, height : 16
	}, 'resetsort', 'Reset sort', 'Toolbar'],
	[{
		src : 'img/copy.gif', width : 16, height : 16
	}, 'copy', 'Copy', 'Toolbar'],
	[{
		src : 'img/paste.gif', width : 16, height : 16
	}, 'paste', 'Paste', 'Toolbar'],
	[{
		src : 'img/formatbold.gif', width : 16, height : 16
	}, 'formatbold', 'Format bold', 'Toolbar'],
	[{
		src : 'img/formatitalic.gif', width : 16, height : 16
	}, 'formatitalic', 'Format italic', 'Toolbar'],
	[{
		src : 'img/formatunderline.gif', width : 16, height : 16
	}, 'formatunderline', 'Format underline', 'Toolbar'],
	[{
		src : 'img/alignleft.gif', width : 16, height : 16
	}, 'alignleft', 'Align left', 'Toolbar'],
	[{
		src : 'img/aligncenter.gif', width : 16, height : 16
	}, 'aligncenter', 'Align center', 'Toolbar'],
	[{
		src : 'img/alignright.gif', width : 16, height : 16
	}, 'alignright', 'Align right', 'Toolbar'],
	[{
		src : 'img/setsearch.gif', width : 16, height : 16
	}, 'setsearch', 'Search', 'Toolbar'],
	[{
		src : 'img/resetsearch.gif', width : 16, height : 16
	}, 'resetsearch', 'Reset search', 'Toolbar'],
	[{
		src : 'img/setamount.gif', width : 16, height : 16
	}, 'setamount', 'Set amount', 'Toolbar'],
	[null, 'fieldText', 'Field label', 'Statusbar'],
	[null, 'valueText', 'Value label', 'Statusbar'],
	[null, 'text', 'Page label', 'Pageturnbar']],
	colDef : [
	{
		title : "Icon",
		titleClass : "Icon",
		type : "Image",
		width : 40,
		alignment : "center",
		compareFunction : compareImage,
		isVisible : true
	},
	{
		title : "Param name",
		titleClass : "Name",
		type : "String",
		width : 100,
		alignment : "left",
		compareFunction : compare,
		isVisible : true
	},
	{
		title : "Description",
		titleClass : "Desc",
		type : "String",
		width : 200,
		alignment : "left",
		compareFunction : compare,
		isVisible : true
	},
	{
		title : "Owner",
		titleClass : "",
		type : "String",
		width : 100,
		alignment : "center",
		compareFunction : compare,
		isVisible : true
	} ],
	tableStyle : {
		tableClass : {
			borderwidth : 1, bordercolor : "#bbbbbb", borderstyle : "solid"
		},
		bgcolor : "#ffffff",
		x : 10,
		y : 10,
		width : 467,
		height : 360
	},
	rowStyle : {
		defaultClass : {
			fontfamily : "Verdana", fontsize : "11px", backgroundcolor : "#cccccc", borderwidth : "1", borderstyle : "outset", bordercolor : "#cccccc"
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
			fontfamily : "Verdana", fontsize : "12px", backgroundcolor : "#cccccc", borderwidth : "1", borderstyle : "outset", bordercolor : "#cccccc"
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
			borderwidth : "1", borderstyle : "outset", bordercolor : "#cccccc", fontfamily : "Arial", fontsize : "12px", backgroundcolor : "#cfcfcf", color : "#000000"
		},
		currClass : {
			borderwidth : "2", borderstyle : "solid", bordercolor : "#000000", fontfamily : "Arial", fontsize : "12px", backgroundcolor : "#ffffff", color : "#000000"
		}
	},
	toolBar : {
		height : 29,
		bgcolor : "#ffffff",
		defaultClass : {
			borderwidth : 1, bordercolor : "#bbbbbb", borderstyle : "solid"
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