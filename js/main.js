var gta = new Vue({
  
	el: '#app',
	data: {
		title: 'Aena GTA',

		//parser
		input: '',
		content: '',
		//REG EXP  MES/AÑO [A-Z]+/[0-9]{4}
		regex :  /[A-Z]+\/[0-9]{4}/,
		selectb: true,
		workers:[],
		worker:'',
		tworker: '',
		turnos:[],
		fecha: '',
		any: '',
		mes: '',
		days: '',
		lines: '',
		tlines: '',
		items: '',
		



		//calendar
		output: '',
		selectedw:'',
		selectdate:'',
		tipo:'',
		
		sTime: '',
		eTime: '',
		sTimet: '',
		eTimet: '',
		download: false,
		workerDownload:'',
		
		
		
	},
	methods:{

		getFecha: function(meses){
			switch (meses){
				case 'ENERO': return '01'; break;
				case 'FEBRERO': return '02'; break;
				case 'MARZO': return '03'; break;
				case 'ABRIL':return '04'; break;
				case 'MAYO': return '05'; break;
				case 'JUNIO': return '06'; break;
				case 'JULIO': return '07'; break;
				case 'AGOSTO': return '08'; break;
				case 'SEPTIEMBRE': return '09'; break;
				case 'OCTUBRE': return '10'; break;
				case 'NOVIEMBRE': return '11'; break;
				case 'DICIEMBRE': return '12'; break;
			}
		},

		parser: function (){
			//Get all content
			this.input = document.getElementById('out').innerHTML;
			this.input = this.input.split("SHEET: Sheet1");
			//alert(this.input[1]);
			
			//Get each file
			for (var i = 1; i<this.input.length; i++){
				
				//Get Content
				this.content = this.input[i].split(",OCU,GRP,PTR,");
				
				//Get Date
				this.fecha = this.regex.exec(this.content[0]);
				this.fecha = this.fecha[0].split("/");
				
				//Get month and year
				this.any = this.fecha[1];
				this.mes = this.getFecha(this.fecha[0]);
				
				//alert("Paso1: "+this.mes);
				//alert(this.content[1]);
				
				//Split lines
				//if (this.content[1].includes('<br>'))
				//	alert("hay br");
				this.lines = this.content[1].split('<br>');
				
				//Get month days
				this.days = this.lines[0];
				//alert(this.days);
				this.days = this.days.split(',');
				
				//Adjust lines
				this.tlines = this.lines.length;
				if (typeof this.lines[this.tlines] == 'undefined')
					this.tlines--;

				//Each Line (worker)
				for (var j=1; j < this.tlines; j++){
					
					this.items=this.lines[j].split('"');
					this.worker=this.items[1];
						
					//Type of worker
					if (typeof this.items[2]!== 'undefined'){	
						this.tworker = this.items[2].split(',');
						
						//IE NOT SUPPORTED if (!this.workers.includes(this.worker))
						if (this.workers.indexOf(this.worker)<0)
							this.workers.push(this.worker);
							/* OLD OBJECT this.workers.push({
								name: this.worker,
								type: this.tworker[1]
							})*/
						
						for (var k=0; k<this.days.length; k++){
							
							if (this.days[k].length==1)
								this.days[k]='0'+this.days[k];

							switch(this.tworker[k+4]){
								case 'D': 
								this.turnos.push({
									name: this.worker,
									tname: this.tworker[1],
									date: this.days[k]+'/'+this.mes+'/'+this.any,
									tdate: 'D'
								});
								break;
								
								case 'N': 
								this.turnos.push({
									name: this.worker,
									tname: this.tworker[1],
									date: this.days[k]+'/'+this.mes+'/'+this.any,
									tdate: 'N'
								});
								break;
								
								case 'M': 
								this.turnos.push({
									name: this.worker,
									tname: this.tworker[1],
									date: this.days[k]+'/'+this.mes+'/'+this.any,
									tdate: 'M'
								});
								break;

								case 'T': 
								this.turnos.push({
									name: this.worker,
									tname: this.tworker[1],
									date: this.days[k]+'/'+this.mes+'/'+this.any,
									tdate: 'T'
								});
								break;
							}//fin switch
								
						}//end for each day
					
					}//end typeof line

				}//end each line
				
			}//fin each file
			
			this.selectb = false;
			
		},

		whoWorks: function (){

			

			if (this.selectdate == ""){

				alert ("Please, choose a correct date");
				return false;

			}else{
				
				this.selectdate = this.selectdate.substr(8,2)+'/'+this.selectdate.substr(5,2)+'/'+this.selectdate.substr(0,4)
				this.output = this.selectdate+"\n";

				for (var l=0; l<this.turnos.length; l++){

					if (this.selectdate == this.turnos[l].date){
						switch(this.turnos[l].tdate){
							case 'D': this.output += "DIA: "; break;
							case 'N': this.output += "NOCHE: "; break;
							case 'M': this.output += "MAÑANA: "; break;
							case 'T': this.output += "TARDE: "; break;
						}
						this.output += this.turnos[l].name+"\n";
					}
				}
				this.selectdate="";	
			}	
			

		},

		calendar: function (){
			
			/*
			var myDate = new Date();
			var month = ('0' + (myDate.getMonth() + 1)).slice(-2);
			var date = ('0' + myDate.getDate()).slice(-2);
			var year = myDate.getFullYear();
			var formattedDate = year + '/' + month + '/' + date;	

			alert(formattedDate);
			*/
			
			var options = { year: 'numeric', month: '2-digit', day: '2-digit' };
			var startDate = '';
			var endDate= '';
			this.output='Subject, Start Date, Start Time, End Date, End Time, Location, Description\n';
			
			//Worker selected
			//alert("el indice del worker es:"+this.selectedw);
			//alert("el worker es:"+this.workers[this.selectedw]);

			
			var e = document.getElementById ("tipo");
            this.tipo = e.options[e.selectedIndex].value;
			
			//timetable
			if (this.tipo=="9"){
				this.sTime="9:00 AM";
				this.eTime="21:00 PM";
			}else if (this.tipo=="8"){
				this.sTime="8:00 AM";
				this.eTime="20:00 PM";
			}else if (this.tipo=="17"){
				this.sTime="7:00 AM";
				this.eTime="15:30 PM";
				this.sTimet="15:30 AM";
				this.eTimet="23:59 PM";
			}
			
			//For each D and N
			for (var i=0; i<this.turnos.length; i++)
			{
				if (this.turnos[i].name==this.workers[this.selectedw])
				{
					
					startDate = this.turnos[i].date;
					
					endDate = new Date ((this.turnos[i].date).substr(6,4)+'-'+(this.turnos[i].date).substr(3,2)+'-'+(this.turnos[i].date).substr(0,2));
					endDate.setDate(endDate.getDate() + 1);
					//endDate = endDate.toLocaleDateString("es-ES",options);
					endDate = endDate.toISOString();
					endDate = endDate.substr(8,2)+'/'+endDate.substr(5,2)+'/'+endDate.substr(0,4);
					//alert (endDate);

					if (this.turnos[i].tdate=="D")
						this.output += 'T.DIA,'+startDate+','+this.sTime+','+startDate+','+this.eTime+',AIRPORT,\n';
					else if (this.turnos[i].tdate=="N")
						this.output += 'T.NOCHE,'+startDate+','+this.sTime+','+endDate+','+this.eTime+',AIRPORT,\n';
					else if (this.turnos[i].tdate=="M")
						this.output += 'MAÑANA,'+startDate+','+this.sTime+','+startDate+','+this.eTime+',AIRPORT,\n';
					else if (this.turnos[i].tdate=="T")
						this.output += 'MAÑANA,'+startDate+','+this.sTimet+','+startDate+','+this.eTimet+',AIRPORT,\n';		
				}
			}
				
			this.download = true;
		},
		
		downcalendar: function (){
			/*var hiddenElement = document.createElement('a');
			hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(this.output);
			hiddenElement.target = '_blank';
			hiddenElement.download = this.workerDownload+'_'+this.mes+'_'+this.any+'.csv';
			hiddenElement.click();*/
			//FileSaver.js Version to fix problems downloading file in IExplore
			//alert(this.output);

			var blob = new Blob([this.output], { type: 'application/xml' });
			saveAs(blob, this.workers[this.selectedw]+'_calendar_'+this.any+'.csv');
		}
	}
	
  });