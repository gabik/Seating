//v.3.0 build 110707

/*
Copyright DHTMLX LTD. http://www.dhtmlx.com
You allowed to use this component or parts of it under GPL terms
To use it on other terms or get Professional edition of the component please contact us at sales@dhtmlx.com
*/
dhtmlXGridObject.prototype.enableDragAndDrop=function(a){a=="temporary_disabled"?(this.dADTempOff=!1,a=!0):this.dADTempOff=!0;this.dragAndDropOff=convertStringToBoolean(a);this._drag_validate=!0;if(a)this.objBox.ondragstart=function(a){(a||event).cancelBubble=!0;return!1}};
dhtmlXGridObject.prototype.setDragBehavior=function(a){this.dadmodec=this.dadmodefix=0;switch(a){case "child":this.dadmode=0;this._sbmod=!1;break;case "sibling":this.dadmode=1;this._sbmod=!1;break;case "sibling-next":this.dadmode=1;this._sbmod=!0;break;case "complex":this.dadmode=2;this._sbmod=!1;break;case "complex-next":this.dadmode=2,this._sbmod=!0}};dhtmlXGridObject.prototype.enableDragOrder=function(a){this._dndorder=convertStringToBoolean(a)};
dhtmlXGridObject.prototype._checkParent=function(a,c){var f=this._h2.get[a.idd].parent;if(f.parent){for(var d=0;d<c.length;d++)if(c[d]==f.id)return!0;return this._checkParent(this.rowsAr[f.id],c)}};
dhtmlXGridObject.prototype._createDragNode=function(a,c){this.editStop();if(window.dhtmlDragAndDrop.dragNode)return null;if(!this.dADTempOff)return null;a.parentObject={};a.parentObject.treeNod=this;var f=this.callEvent("onBeforeDrag",[a.parentNode.idd,a._cellIndex]);if(!f)return null;var d=[];d[this.selMultiRows?d.length:0]=a.parentNode.idd;if(this.isTreeGrid())for(var g=d.length-1;g>=0;g--)this._checkParent(this.rowsAr[d[g]],d)&&d.splice(g,1);var h=this;d.length&&this._dndorder&&d.sort(function(a,
b){return h.rowsAr[a].rowIndex>h.rowsAr[b].rowIndex?1:-1});var e=this.getFirstParentOfType(_isIE?c.srcElement:c.target,"TD");if(e)this._dndExtra=e._cellIndex;this._dragged=[];for(g=0;g<d.length;g++)if(this.rowsAr[d[g]])this._dragged[this._dragged.length]=this.rowsAr[d[g]],this.rowsAr[d[g]].treeNod=this;a.parentObject.parentNode=a.parentNode;var b=document.createElement("div");b.innerHTML=f!==!0?f:this.rowToDragElement(a.parentNode.idd);b.style.position="absolute";b.className="dragSpanDiv";return b};
dhtmlXGridObject.prototype._createSdrgc=function(){this._sdrgc=document.createElement("DIV");this._sdrgc.innerHTML="&nbsp;";this._sdrgc.className="gridDragLine";this.objBox.appendChild(this._sdrgc)};function dragContext(a,c,f,d,g,h,e,b,i,k){this.source=a||"grid";this.target=c||"grid";this.mode=f||"move";this.dropmode=d||"child";this.sid=g||0;this.tid=h;this.sobj=e||null;this.tobj=b||null;this.sExtra=i||null;this.tExtra=k||null;return this}
dragContext.prototype.valid=function(){if(this.sobj!=this.tobj)return!0;if(this.sid==this.tid)return!1;if(this.target=="treeGrid")for(var a=this.tid;a=this.tobj.getParentId(a);)if(this.sid==a)return!1;return!0};dragContext.prototype.close=function(){this.tobj=this.sobj=null};dragContext.prototype.copy=function(){return new dragContext(this.source,this.target,this.mode,this.dropmode,this.sid,this.tid,this.sobj,this.tobj,this.sExtra,this.tExtra)};dragContext.prototype.set=function(a,c){this[a]=c;return this};
dragContext.prototype.uid=function(){for(this.nid=this.sid;this.tobj.rowsAr[this.nid];)this.nid+=(new Date).valueOf();return this};dragContext.prototype.data=function(){return this.sobj==this.tobj?this.sobj._getRowArray(this.sobj.rowsAr[this.sid]):this.source=="tree"?this.tobj.treeToGridElement(this.sobj,this.sid,this.tid):this.tobj.gridToGrid(this.sid,this.sobj,this.tobj)};
dragContext.prototype.childs=function(){return this.source=="treeGrid"?this.sobj._h2.get[this.sid]._xml_await?this.sobj._h2.get[this.sid].has_kids:null:null};
dragContext.prototype.pid=function(){if(!this.tid)return 0;if(!this.tobj._h2)return 0;if(this.target=="treeGrid")if(this.dropmode=="child")return this.tid;else{var a=this.tobj.rowsAr[this.tid],c=this.tobj._h2.get[a.idd].parent.id;if(this.alfa&&this.tobj._sbmod&&a.nextSibling){var f=this.tobj._h2.get[a.nextSibling.idd].parent.id;if(f==this.tid)return this.tid;if(f!=c)return f}return c}};
dragContext.prototype.ind=function(){if(this.tid==window.unknown)return 0;this.target=="treeGrid"&&(this.dropmode=="child"?this.tobj.openItem(this.tid):this.tobj.openItem(this.tobj.getParentId(this.tid)));var a=this.tobj.rowsBuffer._dhx_find(this.tobj.rowsAr[this.tid]);if(this.alfa&&this.tobj._sbmod&&this.dropmode=="sibling"){var c=this.tobj.rowsAr[this.tid];if(c.nextSibling&&this._h2.get[c.nextSibling.idd].parent.id==this.tid)return a+1}return a+1+(this.target=="treeGrid"&&a>=0&&this.tobj._h2.get[this.tobj.rowsBuffer[a].idd].state==
"minus"?this.tobj._getOpenLenght(this.tobj.rowsBuffer[a].idd,0):0)};dragContext.prototype.img=function(){return this.target!="grid"&&this.sobj._h2?this.sobj.getItemImage(this.sid):null};dragContext.prototype.slist=function(){for(var a=[],c=0;c<this.sid.length;c++)a[a.length]=this.sid[c][this.source=="tree"?"id":"idd"];return a.join(",")};
dhtmlXGridObject.prototype._drag=function(a,c,f,d){if(this._realfake)return this._fake._drag();var g=this.lastLanding;this._autoOpenTimer&&window.clearTimeout(this._autoOpenTimer);var h=f.parentNode,e=a.parentObject;if(!h.idd)h.grid=this,this.dadmodefix=0;var b=new dragContext(0,0,0,h.grid.dadmode==1||h.grid.dadmodec?"sibling":"child");if(e&&e.childNodes)b.set("source","tree").set("sobj",e.treeNod).set("sid",b.sobj._dragged);else{if(!e)return!0;e.treeNod.isTreeGrid&&e.treeNod.isTreeGrid()&&b.set("source",
"treeGrid");b.set("sobj",e.treeNod).set("sid",b.sobj._dragged)}h.grid.isTreeGrid()?b.set("target","treeGrid"):b.set("dropmode","sibling");b.set("tobj",h.grid).set("tid",h.idd);var i=this.getFirstParentOfType(d,"TD");i&&b.set("tExtra",i._cellIndex);i&&b.set("sExtra",b.sobj._dndExtra);b.sobj.dpcpy&&b.set("mode","copy");if(b.tobj._realfake)b.tobj=b.tobj._fake;if(b.sobj._realfake)b.sobj=b.sobj._fake;b.tobj._clearMove();if(e&&e.treeNod&&e.treeNod._nonTrivialRow)e.treeNod._nonTrivialRow(this,b.tid,b.dropmode,
e);else{b.tobj.dragContext=b;if(!b.tobj.callEvent("onDrag",[b.slist(),b.tid,b.sobj,b.tobj,b.sExtra,b.tExtra]))return b.tobj.dragContext=null;var k=[];if(typeof b.sid=="object"){for(var j=b.copy(),l=0;l<b.sid.length;l++)if(j.set("alfa",!l).set("sid",b.sid[l][b.source=="tree"?"id":"idd"]).valid())j.tobj._dragRoutine(j),j.target=="treeGrid"&&j.dropmode=="child"&&j.tobj.openItem(j.tid),k[k.length]=j.nid,j.set("dropmode","sibling").set("tid",j.nid);j.close()}else b.tobj._dragRoutine(b);b.tobj.laterLink&&
b.tobj.laterLink();b.tobj.callEvent("onDrop",[b.slist(),b.tid,k.join(","),b.sobj,b.tobj,b.sExtra,b.tExtra])}b.tobj.dragContext=null;b.close()};
dhtmlXGridObject.prototype._dragRoutine=function(a){if(a.sobj==a.tobj&&a.source=="grid"&&a.mode=="move"&&!this._fake){if(!a.sobj._dndProblematic){var c=a.sobj.rowsAr[a.sid],f=a.sobj.rowsCol._dhx_find(c);a.sobj.rowsCol._dhx_removeAt(a.sobj.rowsCol._dhx_find(c));a.sobj.rowsBuffer._dhx_removeAt(a.sobj.rowsBuffer._dhx_find(c));a.sobj.rowsBuffer._dhx_insertAt(a.ind(),c);if(a.tobj._fake){a.tobj._fake.rowsCol._dhx_removeAt(f);var d=a.tobj._fake.rowsAr[a.sid];d.parentNode.removeChild(d)}a.sobj._insertRowAt(c,
a.ind());a.nid=a.sid;a.sobj.callEvent("onGridReconstructed",[])}}else{var g;this._h2&&typeof a.tid!="undefined"&&a.dropmode=="sibling"&&(this._sbmod||a.tid)?a.alfa&&this._sbmod&&this._h2.get[a.tid].childs.length?(this.openItem(a.tid),g=a.uid().tobj.addRowBefore(a.nid,a.data(),this._h2.get[a.tid].childs[0].id,a.img(),a.childs())):g=a.uid().tobj.addRowAfter(a.nid,a.data(),a.tid,a.img(),a.childs()):g=a.uid().tobj.addRow(a.nid,a.data(),a.ind(),a.pid(),a.img(),a.childs());if(a.source=="tree"){this.callEvent("onRowAdded",
[a.nid]);var h=a.sobj._globalIdStorageFind(a.sid);if(h.childsCount){for(var e=a.copy().set("tid",a.nid).set("dropmode",a.target=="grid"?"sibling":"child"),b=0;b<h.childsCount;b++)a.tobj._dragRoutine(e.set("sid",h.childNodes[b].id)),a.mode=="move"&&b--;e.close()}}else if(a.tobj._copyUserData(a),this.callEvent("onRowAdded",[a.nid]),a.source=="treeGrid"){if(a.sobj==a.tobj)g._xml=a.sobj.rowsAr[a.sid]._xml;var i=a.sobj._h2.get[a.sid];if(i&&i.childs.length){e=a.copy().set("tid",a.nid);a.target=="grid"?
e.set("dropmode","sibling"):(e.tobj.openItem(a.tid),e.set("dropmode","child"));for(var k=i.childs.length,b=0;b<k;b++)if(a.sobj.render_row_tree(null,i.childs[b].id),a.tobj._dragRoutine(e.set("sid",i.childs[b].id)),k!=i.childs.length)b--,k=i.childs.length;e.close()}}if(a.mode=="move"&&(a.sobj[a.source=="tree"?"deleteItem":"deleteRow"](a.sid),a.sobj==a.tobj&&!a.tobj.rowsAr[a.sid]))a.tobj.changeRowId(a.nid,a.sid),a.nid=a.sid}};
dhtmlXGridObject.prototype.gridToGrid=function(a,c){for(var f=[],d=0;d<c.hdr.rows[0].cells.length;d++)f[d]=c.cells(a,d).getValue();return f};dhtmlXGridObject.prototype.checkParentLine=function(a,c){return!this._h2||!c||!a?!1:a.id==c?!0:this.checkParentLine(a.parent,c)};
dhtmlXGridObject.prototype._dragIn=function(a,c,f,d){if(!this.dADTempOff)return 0;var g=this.isTreeGrid(),h=c.parentNode.idd?c.parentNode:c.parentObject;if(this._drag_validate){if(a.parentNode==c.parentNode)return 0;if(g&&this==h.grid&&this.checkParentLine(this._h2.get[a.parentNode.idd],c.parentNode.idd))return 0}if(!this.callEvent("onDragIn",[h.idd||h.id,a.parentNode.idd,h.grid||h.treeNod,a.grid||a.parentNode.grid]))return this._setMove(a,f,d,!0);this._setMove(a,f,d);g&&a.parentNode.expand!=""?(this._autoOpenTimer=
window.setTimeout(new callerFunction(this._autoOpenItem,this),1E3),this._autoOpenId=a.parentNode.idd):this._autoOpenTimer&&window.clearTimeout(this._autoOpenTimer);return a};dhtmlXGridObject.prototype._autoOpenItem=function(a,c){c.openItem(c._autoOpenId)};dhtmlXGridObject.prototype._dragOut=function(a){this._clearMove();var c=a.parentNode.parentObject?a.parentObject.id:a.parentNode.idd;this.callEvent("onDragOut",[c]);this._autoOpenTimer&&window.clearTimeout(this._autoOpenTimer)};
dhtmlXGridObject.prototype._setMove=function(a,c,f,d){if(a.parentNode.idd){var g=getAbsoluteTop(a),h=getAbsoluteTop(this.objBox);if(g-h>parseInt(this.objBox.offsetHeight)-50)this.objBox.scrollTop=parseInt(this.objBox.scrollTop)+20;if(g-h+parseInt(this.objBox.scrollTop)<parseInt(this.objBox.scrollTop)+30)this.objBox.scrollTop=parseInt(this.objBox.scrollTop)-20;if(d)return 0;if(this.dadmode==2){var e=f-g+(document.body.scrollTop||document.documentElement.scrollTop)-2-a.offsetHeight/2;Math.abs(e)-a.offsetHeight/
6>0?(this.dadmodec=1,this.dadmodefix=e<0?-1:1):this.dadmodec=0}else this.dadmodec=this.dadmode;if(this.dadmodec)this._sdrgc||this._createSdrgc(),this._sdrgc.style.display="block",this._sdrgc.style.top=g-h+parseInt(this.objBox.scrollTop)+(this.dadmodefix>=0?a.offsetHeight:0)+"px";else if(this._llSelD=a,a.parentNode.tagName=="TR")for(var b=0;b<a.parentNode.childNodes.length;b++)e=a.parentNode.childNodes[b],e._bgCol=e.style.backgroundColor,e.style.backgroundColor="#FFCCCC"}};
dhtmlXGridObject.prototype._clearMove=function(){if(this._sdrgc)this._sdrgc.style.display="none";if(this._llSelD&&this._llSelD.parentNode.tagName=="TR")for(var a=this._llSelD.parentNode.childNodes,c=0;c<a.length;c++)a[c].style.backgroundColor=a[c]._bgCol;this._llSelD=null};dhtmlXGridObject.prototype.rowToDragElement=function(a){var c=this.cells(a,0).getValue();return c};
dhtmlXGridObject.prototype._copyUserData=function(a){if(!a.tobj.UserData[a.nid]||a.tobj!=a.sobj){a.tobj.UserData[a.nid]=new Hashtable;var c=a.sobj.UserData[a.sid],f=a.tobj.UserData[a.nid];if(c)f.keys=f.keys.concat(c.keys),f.values=f.values.concat(c.values)}};dhtmlXGridObject.prototype.moveRow=function(a,c,f,d){switch(c){case "row_sibling":this.moveRowTo(a,f,"move","sibling",this,d);break;case "up":this.moveRowUp(a);break;case "down":this.moveRowDown(a)}};

//v.3.0 build 110707

/*
Copyright DHTMLX LTD. http://www.dhtmlx.com
You allowed to use this component or parts of it under GPL terms
To use it on other terms or get Professional edition of the component please contact us at sales@dhtmlx.com
*/