var gta = new Vue({
  
	el: '#app',
	data: {
		title: 'Aena GTA',
		input: '',
		output: '',
		
		content: '',
		lines: '',
		days: '',
		
		worker:'',
		workerDownload:'',
		workers:[],
		
		selectedw:'',
		tipo:'',
		get_date: '',
		mes: '',
		any: '',
		sTime: '',
		eTime: '',
		download: false,
		
		selectb: true,
		
		
	},
	methods:{
		parser: function (){
			//Get content
			
			this.input = document.getElementById('out').innerHTML;
			this.content = this.input.split(",OCU,GRP,PTR,");
			
			//REG EXP  MES/AÑO [A-Z]+/[0-9]{4}
			var regex = /[A-Z]+\/[0-9]{4}/;
    		this.get_date = regex.exec(this.content[0]);
			this.get_date = this.get_date[0].split("/");
			this.any=this.get_date[1];

			switch (this.get_date[0]){
				case 'ENERO': this.mes = '01'; break;
				case 'FEBRERO': this.mes = '02'; break;
				case 'MARZO': this.mes = '03'; break;
				case 'ABRIL': this.mes = '04'; break;
				case 'MAYO': this.mes = '05'; break;
				case 'JUNIO': this.mes = '06'; break;
				case 'JULIO': this.mes = '07'; break;
				case 'AGOSTO': this.mes = '08'; break;
				case 'SEPTIEMBRE': this.mes = '09'; break;
				case 'OCTUBRE': this.mes = '10'; break;
				case 'NOVIEMBRE': this.mes = '11'; break;
				case 'DICIEMBRE': this.mes = '12'; break;	
			}

			//Split lines
			this.lines = this.content[1].split('<br>');
			
			//Get month days
			this.days = this.lines[0];
			this.days = this.days.split(',');
			
			//Each Line (worker)
			for (var i=1; i < this.lines.length; i++){
				
				this.worker=this.lines[i].split('"');
				this.workers.push(this.worker[1]);
			}
			
			this.selectb = false;
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
			this.output='Subject, Start Date, Start Time, End Date, End Time, Location, Description\n';
			
			//Worker selected
			this.worker=this.lines[this.selectedw+1].split('"');
			this.workerDownload=this.worker[1];
			this.worker=this.worker[2].split(',');
			
			var e = document.getElementById ("tipo");
            this.tipo = e.options[e.selectedIndex].value;
			
			//timetable
			if (this.tipo=="9"){
				this.sTime="9:00 AM";
				this.eTime="21:00 PM";
			}else if (this.tipo=="8"){
				this.sTime="8:00 AM";
				this.eTime="20:00 PM";
			}
			
			//For each D and N
			for (var j=0; j<this.days.length; j++){
			
				if (this.worker[j+4]=='D'){
					
					var returnDay = this.days[j]+'/'+this.mes+'/'+this.any;
					
					this.output += 'TURNO DE DIA,'+returnDay+','+this.sTime+','+returnDay+','+this.eTime+',PMI AIRPORT,\n';
				}
					
				if (this.worker[j+4]=='N'){
				
					if (this.days[j]<10)
						this.days[j]='0'+this.days[j];		
					var startDate = this.days[j]+'/'+this.mes+'/'+this.any;
					
					var endDate = new Date (this.any+'-'+this.mes+'-'+this.days[j]);
					endDate.setDate(endDate.getDate() + 1);
					
					endDate = endDate.toLocaleDateString("es-ES",options);

					this.output += 'TURNO DE NOCHE,'+startDate+','+this.eTime+','+endDate+','+this.sTime+',PMI AIRPORT,\n';
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
			var blob = new Blob([this.output], { type: 'application/xml' });
			saveAs(blob, this.workerDownload+'_'+this.mes+'_'+this.any+'.csv');
		}
	}
	
  });