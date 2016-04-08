/*
* GDate v0.1.2 
* Author by EchoSoar
* WebSite:http://iwenku.net 
*/
(function(obj,undefined){
	if(obj.gdate){
		return;
	}
	/* Lunar */
	(function(O){
		/* 
		此数据为1900~2050年的农历数据 以五位16进制数也就是20位2进制数组成
		比如第一个也就是1900年的数据是0x04bd8
		相当于 0000 0100 1011 1101 1000 
		从前往后记开始为第0位 第16-19位代表 是否是闰月，如果全为0代表不闰月，否则代表闰月的月份。
		第4-15位代表从1月到12月是大月还是小月，大月30天，小月29天。
		前4位代表的是闰月是大月还是小月 0为小1为大。
		*/
		/* 2033年的数据网上流传的是0x04bd7 其实应该是0x04afb */
		var gdateLunarData=new Array( 
		 0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2, 
		 0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977, 
		 0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970, 
		 0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950, 
		 0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557, 
		 0x06ca0,0x0b550,0x15355,0x04da0,0x0a5d0,0x14573,0x052d0,0x0a9a8,0x0e950,0x06aa0, 
		 0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0, 
		 0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b5a0,0x195a6, 
		 0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570, 
		 0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0, 
		 0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5, 
		 0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930, 
		 0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530, 
		 0x05aa0,0x076a3,0x096d0,0x04afb,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45, 
		 0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0) 
		 
		var dayStrFirst = new Array('初','十','廿','卅','　') 
		var dayStrLast = new Array('日','一','二','三','四','五','六','七','八','九','十') 
		var monthStr =["正","二","三","四","五","六","七","八","九","十","十一","腊"];
		var lunarFestival={
			"1-1":"春节",
			"1-15":"元宵节",
			"5-5":"端午节",
			"7-7":"乞巧节",
			"8-15":"中秋节",
			"9-9":"重阳节",
			"12-8":"腊八节"
		};
		var gregorianFestival={
			"1-1":"元旦",
			"3-8":"妇女节",
			"3-12":"植树节",
			"5-1":"劳动节",
			"5-4":"青年节",
			"6-1":"儿童节",
			"7-1":"建党节",
			"8-1":"建军节",
			"9-10":"教师节",
			"10-1":"国庆节"
		};

		/*获取农历一年的日数*/
		function gdateLunarYearDays(y) { 
			var i, sum = 348;
			for(i=0x8000; i>0x8; i>>=1){sum += (gdateLunarData[y-1900] & i)? 1: 0;}
			return(sum+gdateLunarDays(y)); 
		} 

		function gdateLunarDays(y) { 
			if(gdateLunarMonth(y)) return((gdateLunarData[y-1900] & 0x10000)? 30: 29); 
			else return(0); 
		} 

		function gdateLunarMonth(y){ 
			return(gdateLunarData[y-1900] & 0xf);
		} 

		function monthDays(y,m){ 
			return( (gdateLunarData[y-1900] & (0x10000>>m))? 30: 29 );
		} 

		function gdateLunar(objDate) { 
			var i, leap=0, temp=0;
			var baseDate = new Date(1900,0,31);
			var offset = (objDate - baseDate)/86400000;
			for(i=1900;i<2050&&offset>0;i++){
				temp = gdateLunarYearDays(i);
				offset -= temp;
			} 
			if(offset<0) { 
				offset += temp; 
				i--; 
			} 
			this.year = i;
			leap = gdateLunarMonth(i); //闰哪个月 
			this.isLeap = false;
			for(i=1; i<13 && offset>0; i++){ 
				if(leap>0 && i==(leap+1) && this.isLeap==false){
					--i;
					this.isLeap = true;
					temp = gdateLunarDays(this.year);
				}else{
					temp = monthDays(this.year, i);
				} 
				//解除闰月 
				if(this.isLeap==true && i==(leap+1)){
					this.isLeap = false;
				} 
				offset -= temp 
			} 
			if(offset==0 && leap>0 && i==leap+1){
				if(this.isLeap){
					this.isLeap = false;
				}else{
					this.isLeap = true;
					--i;
				} 
			}
			if(offset<0){
				offset += temp;
				--i;
			} 
			this.month = i 
			this.day = offset + 1 
		} 
		function gdateLunarExec(gmonth,gday,month,day){
			var temGStr=[gmonth,"-",gday].join("");
			var temStr=[month,"-",day].join("");
			var resStr;
			if(lunarFestival[temStr])return lunarFestival[temStr];
			if(gregorianFestival[temGStr])return gregorianFestival[temGStr];
			switch(day){
				case 1:resStr=[monthStr[month-1],"月"].join("");break;
				case 10:resStr='初十';break;   
				case 20:resStr='二十';break;   
				case 30:resStr='三十';break;   
				default:resStr=[dayStrFirst[Math.floor(day/10)],dayStrLast[day%10]].join("");  
			}
			return resStr;
		}
		function GetgdateLunarDay(year,month,day){ 
			var sDObj=new Date(parseInt(year),parseInt(month)-1,parseInt(day));
			var lDObj=new gdateLunar(sDObj); //农历 
			var re=gdateLunarExec(sDObj.getMonth()+1,sDObj.getDate(),lDObj.month,lDObj.day);
			if(re==""){
				console.log(year+","+month+","+day)
			}
			return re;
		}
		O.Lunar=GetgdateLunarDay;
	})(this);
	
	var gdate=function(selection,callback){
		callback=callback||function(dateStr){alert(dateStr);};
		return gdate.pro.init(selection,callback);
	},tYear=(new Date).getFullYear(),tMonth=(new Date).getMonth()+1,tDay=(new Date).getDate(),comD=new Date,nowPage=0,formatToNum=0,isOn=false;
	gdate.config={
		containName:'gdate_contain',
		topName:'gdate_top',
		topLeft:'gdate_top_left',
		topMiddle:'gdate_top_middle',
		topRight:'gdate_top_right',
		contentName:'gdate_content',
		yearBtn:'gdate_btn_year',
		yearBtnNow:'gdate_btn_year_now',
		monthBtn:'gdate_btn_month',
		monthBtnNow:'gdate_btn_month_now',
		dayBtn:'gdate_btn_day',
		dayBtnNow:'gdate_btn_day_now',
		dayBtnNot:'gdate_btn_day_not',
		dayDate:'gdate_day_date',
		marginTop:10,
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
		gdateVersion:"GDate v0.1.2",
		init:function(selection,callback){
			this.gObj=query(selection);
			if(!this.gObj)return false;
			initial(this.gObj,callback);
			return this;
		}
	}
	/* Get Object by Selection String*/
	function query(selection){
			if(selection.nodeType&&selection.nodeType==1){
				return selection;
			}
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
			var temTop=createDiv(gdate.config.topName);
			temTop.appendChild(createDiv(gdate.config.topLeft));
			temTop.appendChild(createDiv(gdate.config.topMiddle));
			temTop.appendChild(createDiv(gdate.config.topRight));
			contain.appendChild(temTop);
			contain.appendChild(createDiv(gdate.config.contentName));
			obj.parentNode.insertBefore(contain,obj);
			containObj=query("#"+gdate.config.containName);
		}
		formatToNum=extFormat(gdate.config.format);
		firstPage();
		setCss(containObj,{top:obj.offsetTop+obj.offsetHeight+gdate.config.marginTop+'px',left:obj.offsetLeft+'px',display:'block'});
		query("#"+gdate.config.contentName).onclick=function(e){
			e=e||window.event;
			var target=e.srcElement||e.target;
			if(target.nodeName.toLowerCase()=="i"){
				target=target.parentNode;
			}
			datatype=target.getAttribute("gdate-type");
			
			if(datatype){
				if(datatype=='year'){
					tYear=parseInt(target.getAttribute("data"));
					comD.setFullYear(tYear);
					if(formatToNum==3||formatToNum==7){
						createMonthPage();
					}else{
						callback.call(gdate.pro.gObj,comD.format(gdate.config.format));
						endPage();
					}
				}else if(datatype=='month'){
					tMonth=parseInt(target.getAttribute("data"));
					comD.setMonth(tMonth-1);comD.setDate(1);
					if(formatToNum==6||formatToNum==7){
						createDayPage();
					}else{
						callback.call(gdate.pro.gObj,comD.format(gdate.config.format));
						endPage();
					}
				}else if(datatype=='day'){
					tDay=parseInt(target.getAttribute("data"));
					comD.setDate(tDay);
					callback.call(gdate.pro.gObj,comD.format(gdate.config.format));
					endPage();
				}else if(datatype=='day-front'){
					tDay=parseInt(target.getAttribute("data"));
					if(tMonth==1){tYear-=1;tMonth=12;}else{tMonth-=1;}
					comD.setFullYear(tYear);
					comD.setMonth(tMonth-1);
					comD.setDate(tDay);
					callback.call(gdate.pro.gObj,comD.format(gdate.config.format));
					endPage();
				}else if(datatype=='day-next'){
					tDay=parseInt(target.getAttribute("data"));
					if(tMonth==12){tYear+=1;tMonth=1;}else{tMonth+=1;}
					comD.setFullYear(tYear);
					comD.setMonth(tMonth-1);
					comD.setDate(tDay);
					callback.call(gdate.pro.gObj,comD.format(gdate.config.format));
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
		query("#"+gdate.config.containName).onmouseover=function(){
			isOn=true;
		}
		query("#"+gdate.config.containName).onmouseout=function(){
			isOn=false;
		}
		
		gevent(document,"click",function(e){
			e=e||window.event;
			var target=e.srcElement||e.target;
			if(target!=gdate.pro.gObj&&!isOn){endPage();}
		});
	}
	/*common event*/
	function gevent(ele,event,func){
		if(window.addEventListener){
			ele.addEventListener(event,func,false);
		}else if(window.attachEvent){
			ele.attachEvent("on"+event,func);
		}else{
			ele["on"+event]=func;
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
		comD.setDate("1");
		var xq=(comD.getDay()==7)?0:comD.getDay();
		comD.setDate(tDay);
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
				temHt='<div class="'+gdate.config.dayBtn+' '+gdate.config.dayBtnNot+'" gdate-type="day-front" data="'+daynum+'">'+daynum+'<i class="gdate_lunar">'+Lunar(temYear,temMonth,daynum)+'</i></div>'+temHt;
				daynum--;
			}
			ht+=temHt;
		}
		var thisMonthDayNum=getMonthNum(tYear,tMonth);
		
		for(var i=1;i<=thisMonthDayNum;i++){
				ht+='<div class="'+gdate.config.dayBtn+(i==tDay?' '+gdate.config.dayBtnNow:'')+'" gdate-type="day" data="'+i+'">'+i+'<i class="gdate_lunar">'+Lunar(tYear,tMonth,i)+'</i></div>';	
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
				temHt+='<div class="'+gdate.config.dayBtn+' '+gdate.config.dayBtnNot+'" gdate-type="day-next" data="'+daynum+'">'+daynum+'<i class="gdate_lunar">'+Lunar(temYear,temMonth,daynum)+'</i></div>';
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

	obj.gdate=gdate;
})(this);