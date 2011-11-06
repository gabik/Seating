//-----------------------------------------------------------------------------------
//GRID DEFINITION
//-----------------------------------------------------------------------------------
var gridDef = {
	useExportBar 	 : 0,
	useMultiSort	 : 1,
	useColTitle 	 : 1,
	amountPerPage : 25,
	//datatype 0-array, 1-csv string, 2-xml file, 3 - cvs file, 4 - xml string
	datatype : 0, data : [["1", "Alina Johnson", "01.01.2002", "10"], ["2", "Alexander Jacklynn", "12.05.2003", "2"], ["3", "Martin Barney", "01.01.2002", "2"], ["4", "Gelinas Patricia", "18.07.2003", "2"], ["5", "Cooke Dee", "02.05.2002", "2"], ["6", "Greiner Andrew", "08.01.2003", "2"], ["7", "Maillet Chad", "01.01.2002", "2"], ["8", "Batson Alecia", "01.01.2002", "2"], ["9", "Gato Timothy", "01.01.2002", "2"], ["10", "Wheeler Skip", "01.01.2002", "2"], ["11", "Davis Mackenzie", "01.01.2002", "2"], ["12", "Hatch Jennie", "01.01.2002", "2"], ["13", "picano anthony", "06.01.2003", "2"], ["14", "Bernard Ashley", "11.10.2003", "2"], ["15", "Masabny Rob", "01.01.2002", "2"], ["16", "Philbrick John", "01.01.2002", "2"],
	["17", "Tella Bob", "01.01.2002", "2"], ["18", "Keister Jennifer", "07.10.2002", "2"], ["19", "Doherty Jr. Billy", "30.08.2003", "2"], ["20", "Lozeau Danielle", "27.08.2003", "2"], ["21", "Barnes Anastasia", "01.01.2002", "2"], ["22", "Zanidakis Zoe", "12.08.2003", "2"], ["23", "Price Dennis", "26.08.2003", "2"], ["24", "Morrison Christine", "17.08.2003", "2"], ["25", "Ann Rachael", "13.08.2003", "2"], ["26", "Brodsky Jason", "21.08.2003", "2"], ["27", "Dow Scott", "18.12.2002", "2"], ["28", "Perillo Andy", "01.01.2002", "2"], ["29", "Burgess Terry", "01.01.2002", "2"], ["30", "Vallory Amanda", "23.08.2003", "2"], ["31", "wentworth brendan", "02.01.2004", "2"], ["32", "Ziobro Peter", "27.10.2003", "2"],
	["33", "Winters Scott", "01.01.2002", "2"], ["34", "Shea Kevin", "03.11.2003", "2"], ["35", "Bowring Tina", "07.08.2003", "2"], ["36", "Roosevelt Maura", "06.08.2003", "2"], ["37", "Payne Christopher", "07.01.2003", "2"], ["38", "peterson william", "06.08.2003", "2"], ["39", "Childers Eva", "03.01.2004", "2"], ["40", "Meyer Richard", "16.09.2002", "2"], ["41", "Berkrot Peter", "19.09.2002", "2"], ["42", "Currier Justine/Janelle", "01.01.2002", "2"], ["43", "Perry Kevin", "01.01.2002", "2"], ["44", "LOMBARDI TOM", "04.08.2003", "2"], ["45", "Steele William", "01.01.2002", "2"], ["46", "Smith-Lycette Monique", "01.01.2002", "2"], ["47", "Boiros Ashleigh", "06.06.2002", "2"], ["48", "Peters Ellen", "28.04.2003", "2"], ["49", "Gorgone Dan", "13.08.2002", "2"], ["50", "Barclay Roberta", "27.07.2002", "2"], ["51", "Sawyer John", "01.01.2002", "2"], ["52", "Donlan Melanie", "28.08.2002", "2"], ["53", "Messier Michael", "05.08.2002", "2"], ["54", "Allen Candice", "01.08.2003", "2"], ["55", "Hadlock Nathan", "01.08.2003", "2"], ["56", "Coltart Austin", "12.10.2003", "2"], ["57", "Monkiewicz Nicole", "23.08.2002", "2"], ["58", "Kiedrowski Meg", "15.08.2002", "2"], ["59", "Paulin Amy", "18.08.2002", "2"], ["60", "Corlin Laura", "15.08.2002", "2"], ["61", "Parks Suzanne", "16.08.2002", "2"], ["62", "Davila Maria", "16.08.2002", "2"], ["63", "malone kyra", "18.08.2002", "2"], ["64", "Himeon stacey", "19.08.2002", "2"], ["65", "Lamphier Susan", "01.01.2003", "2"], ["66", "Faucher Troy", "01.01.2003", "2"], ["67", "Stuart Ned", "03.09.2002", "2"], ["68", "Lee Fiona", "07.09.2002", "2"], ["69", "DeStefano Bruce", "02.11.2003", "2"], ["70", "Davis Isaiah", "26.09.2002", "2"], ["71", "Buckley Ryan", "09.07.2003", "2"], ["72", "Feign Wendy", "04.10.2002", "2"], ["73", "deyeva ilona", "18.11.2003", "2"], ["74", "Dundas IV Everett", "18.11.2003", "2"], ["75", "Shanahan John", "19.03.2003", "2"], ["76", "Nietsche Michelle", "01.01.2004", "2"], ["77", "Veto David", "17.01.2003", "2"], ["78", "Andrews Victor", "08.10.2002", "2"], ["79", "Harris Andrew", "05.08.2003", "2"], ["80", "Lepizzera Lou", "14.10.2002", "2"], ["81", "McDonough Karen", "05.01.2004", "2"], ["82", "Lavoie Paul", "05.01.2004", "2"], ["83", "Tankanow Ron", "08.06.2003", "2"], ["84", "Laux Walter", "18.12.2002", "2"], ["85", "Clayburg Christine", "20.10.2002", "2"], ["86", "Edmonds Megan", "04.11.2003", "2"], ["87", "Hebert Scott", "13.11.2003", "2"], ["88", "Macfarlane JD", "07.03.2003", "2"], ["89", "Romano Jay", "12.02.2004", "2"], ["90", "Armstrong Hadley", "04.11.2002", "2"], ["91", "Sacks Paul", "12.11.2002", "2"], ["92", "DeCoff William", "09.05.2003", "2"], ["93", "Molidor CJ", "25.01.2004", "2"], ["94", "Hassinger Norm", "19.11.2002", "2"], ["95", "Hayward Lauren", "03.06.2003", "2"], ["96", "Bourland Elissa", "10.01.2003", "2"], ["97", "Barron Dick", "08.06.2003", "2"]
	],
	colDef : [
	{
		title : "ID",
		titleClass : "",
		type : "Number",
		width : 40, //auto
		alignment : "center",
		compareFunction : compare,
		isVisible : true,
		useAutoIndex : false,
		useAutoFilter : false
	},
	{
		title : "Name",
		titleClass : "",
		type : "String",
		width : 200, //auto
		alignment : "right",
		compareFunction : compare,
		isVisible : true,
		useAutoIndex : false,
		useAutoFilter : false,
		isReadOnly : 0
	},
	{
		title : "Reg. date",
		titleClass : "", //default for th
		type : "Date",
		width : 100, //auto
		alignment : "center",
		compareFunction : compare,
		isVisible : true,
		useAutoIndex : false,
		useAutoFilter : 0
	},
	{
		title : "Account",
		titleClass : "", //default for th
		type : "Currency",
		width : 40, //auto
		alignment : "center",
		compareFunction : compare,
		isVisible : true,
		useAutoIndex : 0,
		useAutoFilter : 0
	} ],
	tableStyle : {
		tableClass : {
			borderwidth : "2", borderstyle : "solid", bordercolor : "#ffffff"
		},
		thClass : {
			fontfamily : "Verdana", fontsize : "12px", color : "#000000", borderwidth : "1", borderstyle : "solid", bordercolor : "#cfcfcf", backgroundcolor : "#ececec"
		},
		tdClass : {
			fontfamily : "Verdana", fontsize : "12px", color : "#000000"
		},
		bgcolor : "#ffffff",
		x : 0,
		y : 0,
		width : 500,
		height : 400,
		overflow : 'auto'
	},
	rowStyle : {
		defaultClass : {
			fontfamily : "Verdana", fontsize : "12px", backgroundcolor : "#cccccc", borderwidth : "1", borderstyle : "outset", bordercolor : "#cccccc"
		},
		markClass : {
			backgroundcolor : "#ccccff", fontsize : "12px", borderwidth : "1", borderstyle : "outset", bordercolor : "#cccccc"
		},
		resizeClass : {
			cursor : "row-resize", borderwidth : "0"
		},
		dragClass : {
			cursor : "move", borderwidth : "0"
		},
		width : 20,
		height : 20
	},
	colStyle : {
		defaultClass : {
			fontfamily : "Verdana", fontsize : "12px", backgroundcolor : "#cccccc", borderwidth : "1", borderstyle : "outset", bordercolor : "#cccccc"
		},
		markClass : {
			backgroundcolor : "#ccccff", fontsize : "12px", borderwidth : "1", borderstyle : "outset", bordercolor : "#cccccc"
		},
		resizeClass : {
			cursor : "col-resize", borderwidth : "0"
		},
		dragClass : {
			cursor : "move", borderwidth : "0"
		},
		width : 100,
		height : 20
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
	}
};
//hide selected rows
function hideMarkRows(g) {
	for (var i = 0; i < g.rows.length; i++) {
		g.rows[i].isVisible = ((!g.rows[i].isMark) ? 1 : 0);
	};
	g.vr.length = 0;
	g.paint();
};
//change css parameters (currClass, defaultClass, markClass) of cell and set cell handler
//change css parameters (defaultClass) of cell.row and set row handler
//change css parameters (defaultClass) of cell.col and set col handler
function changeCss(cell) {
	if (Undef(cell)) {
		alert("Choose cell"); return;
	}
	cell.currClass = 'curr';
	cell.defaultClass = 'def';
	cell.markClass = 'mark';
	cell.handler = cellHandler;
	cell.row.defaultClass = 'def';
	cell.row.handler = rowHandler;
	cell.col.defaultClass = 'def';
	cell.col.handler = colHandler;
	cell.paint();
};
//-------------------------------------------
//e._e - Object window.Event, e._e.type = ["click", "dblclick", "mouseup", "mousedown"]
//e._o - source Object that call handler (CGCol, CGRow or CGCell)
//-------------------------------------------
function cellHandler(e) {
	var g = e._o.row.grid;
	g.msg = e._o + " Event " + e._e.type + "!";
	g.paintBar("sb");
};

function rowHandler(e) {
	var g = e._o.grid;
	g.msg = "Row " + (e._o._id + 1) + " Event " + e._e.type + "!";
	g.paintBar("sb");
};

function colHandler(e) {
	var g = e._o.grid;
	g.msg = "Column " + e._o.title + " Event " + e._e.type + "!";
	g.paintBar("sb");
};

function setBarVisibility(g, bar) {
	var o = CT_fe(g.getID(bar));
	if (Def(o)) {
		if (o.style.visibility == "hidden") {
			o.style.visibility = "visible"
			o.style.display = "block";
		}
		else {
			o.style.visibility = "hidden";
			o.style.display = "none";
		};
	};
};