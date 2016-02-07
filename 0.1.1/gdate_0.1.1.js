/*
* GDate v0.1.1 
* Author by EchoSoar
* WebSite:http://iwenku.net 
*/
(function(obj){
	var gdate=function(selection,callback){
		callback=callback||function(dateStr){alert(dateStr);};
		return gdate.pro.init(selection,callback);
	},tYear=(new Date).getFullYear(),tMonth=(new Date).getMonth()+1,tDay=(new Date).getDate(),comD=new Date,nowPage=0,formatToNum=0;
	gdate.config={
		containName:'gdate_contain',
		topName:'gdate_top',
		topLeft:'gdate_top_left',
		topMiddle:'gdate_top_middle',
		topRight:'gdate_top_right',
		contentName:'gdate_content',
		otherName:'gdate_other',
		yearBtn:'gdate_btn_year',
		yearBtnNow:'gdate_btn_year_now',
		monthBtn:'gdate_btn_month',
		monthBtnNow:'gdate_btn_month_now',
		dayBtn:'gdate_btn_day',
		dayBtnNow:'gdate_btn_day_now',
		dayBtnNot:'gdate_btn_day_not',
		dayDate:'gdate_day_date',
		marginTop:20,
		format:'yy-mm-dd'
	};
	Date.prototype.format =function(format){
		var thisMonth=this.getMonth()+1+'';
		var thisDay=this.getDate()+'';
		if(/(y+)/.test(format)) format=format.replace(RegExp.$1,(this.getFullYear()+"").substr(4- RegExp.$1.length));
		if(/(m+)/.test(format)) format=format.replace(RegExp.$1,RegExp.$1.length==1?thisMonth:("00"+thisMonth).substr(thisMonth.length,2));
		if(/(d+)/.test(format)) format=format.replace(RegExp.$1,RegExp.$1.length==1?thisDay:("00"+thisDay).substr(thisDay.length,2));
		return format;
	}
	var cnMonthStr=["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];
	var cnDateStr=["日","一","二","三","四","五","六"];
	gdate.pro=gdate.prototype={
		gObj:null,
		gdateVersion:"GDate v0.1.1",
		init:function(selection,callback){
			this.gObj=query(selection);
			if(!this.gObj)return false;
			initial(this.gObj,callback);
			return this;
		}
	}
	/* Get Object by Selection String*/
	function query(selection){
			if(!document.querySelector){
				return document.querySelector(selection);
			}
			var charat=selection.charAt(0);
			if(charat=="#"){
				return document.getElementById(selection.substr(1));
			}else if(charat=="."){
				return getElementByClassName(selection.substr(1));
			}
			return false;
	}
	/*GetElementByClassName*/
	function getElementByClassName(selector){
		var all = document.all ? document.all : document.getElementsByTagName('*');
		for ( var e = 0; e < all.length; e ++ ) {
	      if (all[e].className == selector) {
	        return all[e];
	      }
	    }
		return false;
	}
	/*Create Gdate div or reset Gdate div*/
	function initial(obj,callback){
		var temFormat=obj.getAttribute("gdate-format");
		if(!temFormat||temFormat=='')gdate.config.format='yy-mm-dd';
		else gdate.config.format=temFormat;
		var containObj=query("#"+gdate.config.containName);
		if(!containObj){
			var contain=createDiv(gdate.config.containName);
			obj.parentNode.insertBefore(contain,obj);
			containObj=query("#"+gdate.config.containName);
			containObj.appendChild(createDiv(gdate.config.topName));
			containObj.appendChild(createDiv(gdate.config.contentName));
			var temTopObj=query("#"+gdate.config.topName);
			temTopObj.appendChild(createDiv(gdate.config.topLeft));
			temTopObj.appendChild(createDiv(gdate.config.topMiddle));
			temTopObj.appendChild(createDiv(gdate.config.topRight));
			temTopObj.appendChild(createDiv(gdate.config.otherName));
		}
		formatToNum=extFormat(gdate.config.format);
		firstPage();
		setCss(containObj,{top:obj.offsetTop+obj.offsetHeight+gdate.config.marginTop+'px',left:obj.offsetLeft+'px',display:'block'});
		query("#"+gdate.config.containName).onclick=function(e){
			e=e||window.event;
			var target=e.srcElement||e.target,datatype=target.getAttribute("gdate-type");
			if(datatype){
				if(datatype=='year'){
					tYear=parseInt(target.getAttribute("data"));
					comD.setFullYear(tYear);
					if(formatToNum==3||formatToNum==7){
						createMonthPage();
					}else{
						callback(comD.format(gdate.config.format));
						endPage();
					}
				}else if(datatype=='month'){
					tMonth=parseInt(target.getAttribute("data"));
					comD.setMonth(tMonth-1);comD.setDate(1);
					if(formatToNum==6||formatToNum==7){
						createDayPage();
					}else{
						callback(comD.format(gdate.config.format));
						endPage();
					}
				}else if(datatype=='day'){
					tDay=parseInt(target.getAttribute("data"));
					comD.setDate(tDay);
					callback(comD.format(gdate.config.format));
					endPage();
				}else if(datatype=='day-front'){
					tDay=parseInt(target.getAttribute("data"));
					if(tMonth==1){tYear-=1;tMonth=12;}else{tMonth-=1;}
					comD.setFullYear(tYear);
					comD.setMonth(tMonth-1);
					comD.setDate(tDay);
					callback(comD.format(gdate.config.format));
					endPage();
				}else if(datatype=='day-next'){
					tDay=parseInt(target.getAttribute("data"));
					if(tMonth==12){tYear+=1;tMonth=1;}else{tMonth+=1;}
					comD.setFullYear(tYear);
					comD.setMonth(tMonth-1);
					comD.setDate(tDay);
					callback(comD.format(gdate.config.format));
					endPage();
				}
			}
		}
		query("#"+gdate.config.topLeft).onclick=function(e){
			if(nowPage==1){createYearPage((tYear-=8));}
			else if(nowPage==2){createMonthPage((tYear-=1));}
			else if(nowPage==3){
				if(tMonth==1){
					tYear-=1;
					tMonth=12;
				}else{
					tMonth-=1;
				}
				comD.setFullYear(tYear);
				comD.setMonth(tMonth-1);
				createDayPage(tMonth);
			}
		}
		query("#"+gdate.config.topRight).onclick=function(e){
			if(nowPage==1){createYearPage((tYear+=8));}
			else if(nowPage==2){createMonthPage((tYear+=1));}
			else if(nowPage==3){
				if(tMonth==12){
					tYear+=1;
					tMonth=1;
				}else{
					tMonth+=1;
				}
				comD.setFullYear(tYear);
				comD.setMonth(tMonth-1);
				createDayPage(tMonth);
			}
		}
		query("#"+gdate.config.topMiddle).onclick=function(e){
			if(nowPage==2){
				if(formatToNum==1||formatToNum==3||formatToNum==7){
					createYearPage();
				}
			}else if(nowPage==3){
				if(formatToNum==6||formatToNum==7){
					createMonthPage();
				}
			}
		}
	}
	/*Create div*/
	function createDiv(id){
		var temdiv=document.createElement('div');
		temdiv.setAttribute("id",id);
		temdiv.setAttribute("gdate-version",gdate.pro.gdateVersion);
		return temdiv;
	}
	/*set css*/
	function setCss(_this, cssOption){
         if ( !_this || _this.nodeType === 3 || _this.nodeType === 8 || !_this.style ) {
             return;
         }
         for(var cs in cssOption){
             _this.style[cs] = cssOption[cs];
         }
        return _this;
    }
	/*Ext format*/
	function extFormat(format){
		var fres=0;
		if(/y/.test(format)){fres+=1;}
		if(/m/.test(format)){fres+=2;}
		if(/d/.test(format)){fres+=4;}
		//y-m-d 7;y-m 3;m-d 6;m 2;d 4;y 1
		if(fres==5){fres=7;}//inexistence y-d and autochangeover to y-m-d
		return fres;
	}
	/**/
	function firstPage(){
		if(formatToNum==1||formatToNum==3||formatToNum==7){
			createYearPage();
		}else if(formatToNum==6||formatToNum==2){
			createMonthPage();
		}else if(formatToNum==4){
			createDayPage();
		}
	}
	function createYearPage(year){
		nowPage=1;
		query("#"+gdate.config.topMiddle).innerHTML=gdate.pro.gdateVersion;
		var thisYear=year||tYear,temYearPosi=(thisYear-1)%4,startYear=thisYear-temYearPosi-4,endYear=thisYear+7-temYearPosi,ht='';
		for(var i=startYear;i<=endYear;i++){
			ht+='<div class="'+gdate.config.yearBtn+(tYear==i?' '+gdate.config.yearBtnNow:'')+'" gdate-type="year" data="'+i+'">'+i+'</div>';
		}
		query("#"+gdate.config.contentName).innerHTML=ht;
	}
	function createMonthPage(year){
		nowPage=2;
		var thisYear=year||tYear;
		var ht='';
		for(var i=1;i<=12;i++){
			ht+='<div class="'+gdate.config.monthBtn+(tMonth==i?' '+gdate.config.monthBtnNow:'')+'" gdate-type="month" data="'+i+'">'+cnMonthStr[i-1]+'</div>';
		}
		query("#"+gdate.config.topMiddle).innerHTML=thisYear+"年";
		query("#"+gdate.config.contentName).innerHTML=ht;
	}
	function createDayPage(month){
		nowPage=3;
		var thisMonth=month||tMonth;
		var ht='';
		for(var i=0;i<7;i++){
				ht+='<div class="'+gdate.config.dayDate+'">'+cnDateStr[i]+'</div>';
		}
		
		var xq=(comD.getDay()==7)?0:comD.getDay();
		if(xq>0){
			var temYear=tYear;
			var temMonth=tMonth;
			if(temMonth==1){
				temYear--;
				temMonth=12;
			}else{
				temMonth--;
			}
			var daynum=getMonthNum(temYear,temMonth);
			var temHt='';
			for(var temj=0;temj<xq;temj++){
				temHt='<div class="'+gdate.config.dayBtn+' '+gdate.config.dayBtnNot+'" gdate-type="day-front" data="'+daynum+'">'+daynum+'</div>'+temHt;
				daynum--;
			}
			ht+=temHt;
		}
		var thisMonthDayNum=getMonthNum(tYear,tMonth);
		for(var i=1;i<=thisMonthDayNum;i++){
				ht+='<div class="'+gdate.config.dayBtn+(i==tDay?' '+gdate.config.dayBtnNow:'')+'" gdate-type="day" data="'+i+'">'+i+'</div>';
			
		}
		var nextDay=(xq+thisMonthDayNum)%7;
		if(nextDay!=0){
			nextDay=7-nextDay;
			temYear=tYear;
			temMonth=tMonth;
			if(temMonth==12){
				temYear++;
				temMonth=1;
			}else{
				temMonth++;
			}
			daynum=1;
			temHt='';
			for(var temj=0;temj<nextDay;temj++){
				temHt+='<div class="'+gdate.config.dayBtn+' '+gdate.config.dayBtnNot+'" gdate-type="day-next" data="'+daynum+'">'+daynum+'</div>';
				daynum++;
			}
			ht+=temHt;
		}
		query("#"+gdate.config.topMiddle).innerHTML=tYear+"年"+thisMonth+"月";
		query("#"+gdate.config.contentName).innerHTML=ht;
	}
	function endPage(){
		setCss(query("#"+gdate.config.containName),{display:"none"});
	}
	function getMonthNum(Year,Month){
		var d = new Date(Year,Month,0);
		return d.getDate();
	}
	document.onclick=function(e){
		e=e||window.event;
		var target=e.srcElement||e.target;
		if(target==gdate.pro.gObj||target.getAttribute("gdate-type")||target.getAttribute("gdate-version")){}else{endPage();}
	}
	obj.gdate=gdate;
})(window);