/*GDate v0.1.0 / Author by EchoSoar / WebSite:http://iwenku.net */
(function(obj){
	var gdate=function(selection,callback){
		return gdate.pro.init(selection,callback);
	},tYear=(new Date).getFullYear(),setY=tYear,setM=(new Date).getMonth()+1,setD=(new Date).getDate(),comD=new Date;
	var cnMonthStr=["一","二","三","四","五","六","七","八","九","十","十一","十二"];
	var cnDateStr=["日","一","二","三","四","五","六"];
	gdate.pro=gdate.prototype={
		gObj:null,
		gdateVersion:"GDate v0.1.0",
		init:function(selection,callback){
			this.gObj=query(selection);
			if(!this.gObj)return false;
			var _self=this;
			if(!document.getElementById("gdate_contain")){
				var temDiv=createDiv({top:_self.gObj.offsetTop+_self.gObj.offsetHeight+20+'px',left:_self.gObj.offsetLeft+'px'});
				temDiv.setAttribute("id","gdate_contain");
				temDiv.innerHTML='<div id="gdate_other"></div><div id="gdate_top">'+this.gdateVersion+'</div><div id="gdate_content"></div>';
				this.gObj.parentNode.insertBefore(temDiv,this.gObj);
				
				document.getElementById("gdate_content").onclick=function(e){
					e=e||window.event;
					var target=e.srcElement||e.target;
					var datatype=target.getAttribute("data-type");
					if(datatype){
						if(datatype=='yeartopre'){
							commonInitYear(tYear-8);
							tYear-=8;
						}else if(datatype=='yeartonext'){
							commonInitYear(tYear+8);
							tYear+=8;
						}else if(datatype=='year'){
							var year=target.getAttribute("data");
							tYear=setY=parseInt(year);
							document.getElementById("gdate_top").innerHTML='<div id="gdate_top_btn" data-type="year">'+tYear+'年</div>';
							comD.setFullYear(tYear);
							commonInitMonth();
						}else if(datatype=='month'){
							setM=target.getAttribute("data");
							document.getElementById("gdate_top").innerHTML='<div id="gdate_top_btn" data-type="month">'+tYear+'年'+setM+'月</div>';
							comD.setMonth(setM);
							comD.setDate(1);
							commonInitDay();
						}else if(datatype=='day'){
							tYear=setY=parseInt(target.getAttribute("data-year"));
							setM=parseInt(target.getAttribute("data-month"));
							setD=parseInt(target.getAttribute("data-day"));
							comD.setFullYear(tYear);
							comD.setMonth(setM);
							comD.setDate(setD);
							var res={
								year:setY,
								month:setM,
								day:setD
							};
							callback(res);
							document.getElementById("gdate_contain").style.display="none";
						}
					}
				};
				document.getElementById("gdate_top").onclick=function(e){
					e=e||window.event;
					var target=e.srcElement||e.target;
					var datatype=target.getAttribute("data-type");
					if(datatype){
						if(datatype=='year'){
							commonInitYear();
						}else if(datatype=='month'){
							document.getElementById("gdate_top").innerHTML='<div id="gdate_top_btn" data-type="year">'+tYear+'年</div>';
							commonInitMonth();
						}
					}
				};
			}
			document.getElementById("gdate_contain").style.display="block";
			commonInitYear();
			return this;
		}
	}
	
	function query(selection){
			if(document.querySelector){
				return document.querySelector(selection);
			}
			return false;
	}
	function createDiv(css){
		var gdate_contain=document.createElement("div");
		setCss(gdate_contain,css);
		return gdate_contain;
	}
	function setCss(_this, cssOption){
         if ( !_this || _this.nodeType === 3 || _this.nodeType === 8 || !_this.style ) {
             return;
         }
         for(var cs in cssOption){
             _this.style[cs] = cssOption[cs];
         }
        return _this;
    }
	function commonInitYear(year){
		document.getElementById("gdate_top").innerHTML=gdate.prototype.gdateVersion;
		var thisYear=year||tYear;
		var temYearPosi=(thisYear-1)%4;
		var startYear=thisYear-temYearPosi-4;
		var endYear=thisYear+7-temYearPosi;
		var ht='<div id="gdate_btn_year_pre" data-type="yeartopre">向前</div>';
		for(var i=startYear;i<=endYear;i++){
			if(setY==i){
				ht+='<div class="gdate_btn_year gdate_btn_year_now" data-type="year" data="'+i+'">'+i+'</div>';
			}else{
				ht+='<div class="gdate_btn_year" data-type="year" data="'+i+'">'+i+'</div>';
			}
		}
		ht+='<div id="gdate_btn_year_la"  data-type="yeartonext">向后</div>';
		document.getElementById("gdate_content").innerHTML=ht;
	}
	function commonInitMonth(){		
		var ht='';
		for(var i=1;i<=12;i++){
			if(setM==i){
				ht+='<div class="gdate_btn_month gdate_btn_month_now" data-type="month" data="'+i+'">'+cnMonthStr[i-1]+'月</div>';
			}else{
				ht+='<div class="gdate_btn_month" data-type="month" data="'+i+'">'+cnMonthStr[i-1]+'月</div>';
			}
		}
		document.getElementById("gdate_content").innerHTML=ht;
	}
	function commonInitDay(){
		var ht='';
		for(var i=0;i<7;i++){
				ht+='<div class="gdate_day_top">'+cnDateStr[i]+'</div>';
		}
		
		var xq=(comD.getDay()==7)?0:comD.getDay();
		if(xq>0){
			var temYear=setY;
			var temMonth=setM;
			if(setM==1){
				temYear--;
				temMonth=12;
			}else{
				temMonth--;
			}
			var daynum=geMonthNum(temYear,temMonth);
			var temHt='';
			for(var temj=0;temj<xq;temj++){
				temHt='<div class="gdate_day_btn gdate_day_btn_pre" data-type="day" data-year="'+temYear+'" data-month="'+temMonth+'" data-day="'+daynum+'">'+daynum+'</div>'+temHt;
				daynum--;
			}
			ht+=temHt;
		}
		var thisMonthDayNum=geMonthNum(setY,setM);
		for(var i=1;i<=thisMonthDayNum;i++){
			if(i==setD){
				ht+='<div class="gdate_day_btn gdate_day_btn_now" data-type="day" data-year="'+setY+'" data-month="'+setM+'" data-day="'+i+'">'+i+'</div>';
			}else{
				ht+='<div class="gdate_day_btn" data-type="day" data-year="'+setY+'" data-month="'+setM+'" data-day="'+i+'">'+i+'</div>';
			}
			
		}
		var nextDay=(xq+thisMonthDayNum)%7;
		if(nextDay!=0){
			nextDay=7-nextDay;
			
			temYear=setY;
			temMonth=setM;
			if(setM==12){
				temYear++;
				temMonth=1;
			}else{
				temMonth++;
			}
			daynum=1;
			temHt='';
			for(var temj=0;temj<nextDay;temj++){
				temHt+='<div class="gdate_day_btn gdate_day_btn_next" data-type="day" data-year="'+temYear+'" data-month="'+temMonth+'" data-day="'+daynum+'">'+daynum+'</div>';
				daynum++;
			}
			ht+=temHt;
			
		}
		document.getElementById("gdate_content").innerHTML=ht;
	}
	function geMonthNum(Year,Month){
		var d = new Date(Year,Month,0);
		return d.getDate();
	}
	obj.gdate=gdate;
})(window);