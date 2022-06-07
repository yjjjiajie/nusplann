<template src = "./ModuleInfo.html"> </template>
<style src = "./ModuleInfo.css"> </style>

<script>
import modules from "../../assets/allmoduleinfo.json";
import * as Treeviz from 'treeviz';
import { mapGetters } from "vuex";
export default {
	name: "App",
	display: "Module Information",
	components: {
		Treeviz
	},
	data: function() {
		return {
			search:'',
			mods: Object.values(modules),
			show: true,
			years:[],
			/* data required for edit button*/
      form: {
          year: "",
          rating: "",
          learning: "",
          admin: "",
          writtenReview: "",
					userName:"",
					module_code:""
			},
			/* data required for dashboard */
			preprocessed_data: {
                '1819-S1': {
                    total: 204,
                    major: {
                        'Business Analytics': 101,
                        'Computer Science': 103,
                    },
                    year: [0, 198, 5, 1]
                },
                '1819-S2': {
                    total: 201,
                    major: {
                        'Business Analytics': 98,
                        'Computer Science': 87,
                        'Information Systems': 16
                    },
                    year: [2, 197, 3, 0]
                },
                '1920-S1': {
                    total: 197,
                    major: {
                        'Business Analytics': 99,
                        'Computer Science': 88,
                        'Information Systems': 10
                    },
                    year: [0, 195, 3, 0]
                },
                '1920-S2': {
                    total: 204,
                    major: {
                        'Business Analytics': 91,
                        'Computer Science': 87,
                        'Information Systems': 21,
                        'Information Security': 5
                    },
                    year: [0, 198, 5, 1]
                },
                '2021-S1': {
                    total: 180,
                    major: {
                        'Business Analytics': 93,
                        'Computer Science': 82,
                        'Information Systems': 5
                    },
                    year: [1, 177, 2, 0]
                },
                '2021-S2': {
                    total: 151,
                    major: {
                        'Business Analytics': 68,
                        'Computer Science': 77,
                        'Information Systems': 6
                    },
                    year: [0, 150, 1, 0]
                },
			},
			current_ay: "1920-S1",
			show_dashboard: false,
			data_unavailable: -1,
			quality: 5,
			relevance: 5,
			difficulty: 5,
			workload: 5,
			staff: 5,
			update: 0,
		}
	},
	props: ['allmodules'],
	computed: {
		filteredList() {
			if(this.search != ''){
				document.getElementById("res").innerHTML ="";
				document.getElementById("res_review").innerHTML = "";
			}
			
			return Object.keys(this.allmodules).filter(mod => {
				return this.allmodules[mod].fullname.toUpperCase().includes(this.search.toUpperCase())
            })
		},
		// map `this.user` to `this.$store.getters.user`
        ...mapGetters({
            user: "user"
        }),
	},
	
	methods:{
		modInfo: function(mod){
			this.search ='';
			this.show = false;
			var res = document.getElementById("res");
			window.scrollTo(0,0);
			res.innerHTML = "<h1 id='mod_title'>" + mod.code + " " + mod.title + "</h1>";
			res.insertAdjacentHTML('beforeend', '<div id = indicators>' + mod.department + " | " +  mod.mc + " MCs</div><hr></hr>");
			res.insertAdjacentHTML('beforeend', "<p>" + mod.desc + "</p>");
			//PREREQUISITES      
			var arr = [];   
			var arrInd = []   
			if (mod.prereq != ""){
				res.insertAdjacentHTML('beforeend', '<br>');
				document.getElementById('res').insertAdjacentHTML('beforeend',"<h4>Prerequisites</h4><hr></hr>")
				for(let i=0; i <this.mods.length; i++){
					var index = mod.prereq.toUpperCase().indexOf(this.mods[i].code);
					if(index != -1){
						//check for those with modules that have same starting index
						var check = arrInd.indexOf(index);
						if(check != -1){
							if (this.mods[i].code.length > arr[check][1].code.length){
								arr.splice(check, 1);
								arrInd.splice(check, 1);
								arr.push([index,this.mods[i]]);
								arrInd.push(index);
							}
						}else{
							arr.push([index,this.mods[i]]);
							arrInd.push(index);	
						}
					}
				}
			
				var startIndex = 0;
				arr.sort(function(a,b) {return a[0]-b[0]});
				if (arr.length == 0 && mod.prereq.length == 0) {
					res.insertAdjacentHTML('beforeend', "None");
				}
				//joining the substrings to form the necessary output
				for(let i = 0; i<arr.length; i++){ 
					res.insertAdjacentHTML('beforeend',mod.prereq.substring(startIndex, arr[i][0]));        
					var eventname = 'temp'.concat(i);
					res.insertAdjacentHTML('beforeend',"<span id = '"+ eventname + "'>"+ arr[i][1].code+ "</span>");        
					startIndex = arr[i][0] + arr[i][1].code.length;
				}
				document.getElementById("res").insertAdjacentHTML('beforeend', mod.prereq.substring(startIndex, mod.prereq.length) +"</h4>");
			}
			
			
			//PRECLUSIONS	
			var arr_a = [];
			if (mod.preclusion != ""){
				res.insertAdjacentHTML('beforeend', '<br><br>');
				document.getElementById('res').insertAdjacentHTML('beforeend',"<h4>Preclusions</h4><hr></hr>")
				for(let i=0; i <this.mods.length; i++){
					index = mod.preclusion.toUpperCase().indexOf(this.mods[i].code);
					if(index != -1){
						if(this.mods[i].code != mod.code){
							arr_a.push([index,this.mods[i]])
						}
					}
				}
				startIndex = 0;
				arr_a.sort(function(a,b) {return a[0]-b[0]});
				if (arr_a.length == 0 && mod.preclusion.length == 0) {
					res.insertAdjacentHTML('beforeend', "None");
				}
				//joining the substrings to form the necessary output
				for(let i = 0; i<arr_a.length; i++){ 
					res.insertAdjacentHTML('beforeend',mod.preclusion.substring(startIndex, arr_a[i][0]));        
					eventname = 'temp'.concat(i);
					res.insertAdjacentHTML('beforeend',"<span id = '"+ eventname + "'>"+arr_a[i][1].code+ "</span>");
					startIndex = arr_a[i][0] + arr_a[i][1].code.length;
				}
				document.getElementById("res").insertAdjacentHTML('beforeend', mod.preclusion.substring(startIndex, mod.preclusion.length) +"</h4>");
			}
			var arr_all = arr.concat(arr_a).reverse();
			//onclick of the module code, brings you to the module page      
			var matches = document.querySelectorAll("span");
			var x = this;
			for (let j = arr_all.length-1; j >= 0; j--) {
				let button = matches[matches.length-j-1];
				button.addEventListener('click', function() {
						x.modInfo(arr_all[j][1]);
						x.dashboardInfo(arr_all[j][1]["code"]);
					}
				)
			}
			//End Prerequisite/preclusion
			res.insertAdjacentHTML('beforeend', '<br><br>');
			//Workload
			res.insertAdjacentHTML('beforeend', '</p>')
			var workload = modules[mod.code]['workload'].split("-");
			if (modules[mod.code]['workload']!=''){
				var totalHours = workload.map(function(elt) {return parseInt(elt)}).reduce(function(a,b) {return a+b});
				var totalString = totalHours + totalHours > 1 ? ' hours' : ' hour';
				res.insertAdjacentHTML('beforeend', '<h4>Workload (Weekly): '+ totalHours + totalString +'</h4><hr></hr>');
				var col = ["#24305E","#F67280","#8186D5","#96D1C7","#B9CCED"];
				var names = ["Lec","Tut", "Lab","Proj","Prep"];
				for (i = 0; i < 5; i++) {
					for (var j = 0; j < workload[i]; j++){	
						res.insertAdjacentHTML('beforeend', '<svg width="38" height="23"><rect width="37" height="23" fill="' + col[i] + '"/></svg>');
					}
				}
				res.insertAdjacentHTML('beforeend', '<p id = labels></p>');
				var label = document.getElementById("labels");
				for (i = 0; i < 5; i++) {
					if (workload[i] == 1){
						label.insertAdjacentHTML('beforeend', '<span style="color:'+ col[i] + '">' + names[i] + '&nbsp;'.repeat(5) + '</span>');
					}else if (workload[i] >1){			
						label.insertAdjacentHTML('beforeend', '<span style="color:'+ col[i] + '">' + names[i] + '&nbsp;'.repeat((workload[i]-1)*8 + 5) + '</span>');
					}
				}
			}
			res.insertAdjacentHTML('beforeend', '<br>');
			
			
			//TREE
			var lst1 = Object.keys(this.allmodules).filter(module => {
				return this.allmodules[module].prereq.toUpperCase().includes(mod.code)
			});
			var lst = []
			for(i in lst1){
				if (lst1[i] != mod.code){
					lst.push(lst1[i]);
				}
			}
			if(lst.length > 0){
				var data_1 = [
					{id: 1, text_1: mod.code, father: null, color:"#F67280" },
				]
				var count = 2;
				for(var i in lst){
					data_1.push({id: count, text_1: this.allmodules[lst[i]].code, father: 1, color:"#B9CCED"});
					count++;
				}
				res.insertAdjacentHTML('beforeend','<h4>Dependent Modules</h4><hr></hr>');
				var len = lst.length*40;
				if (len != 0){
					res.insertAdjacentHTML('beforeend', '<div id="tree" style="height:' + len + 'px; width:500px"></div> ');
				}else{
					res.insertAdjacentHTML('beforeend', '<div id="tree" style="height: 50px; width:500px"></div> ');
				}
				var myTree = Treeviz.create({
					htmlId: "tree",
					idKey: "id",
					hasPan: false,
					hasZoom:false,
					hasFlatData: true,
					relationnalField: "father",
					nodeWidth:100,
					nodeHeight:30,
					strokeWidth: 1,
					mainAxisNodeSpacing:2,
					isHorizontal:true,
					renderNode: function(node) {
					var result = "<div class='box' style='cursor:pointer;height:"
						+node.settings.nodeHeight+ "px; width:"
						+node.settings.nodeWidth
						+"px;display:flex;flex-direction:column;justify-content:center;align-items:center;background-color:" 
						+node.data.color
						+ ";border-radius:px;'><div><strong>"
					+node.data.text_1+
					"</strong></div></div>";
					return result;
					},
					linkShape:"curve",
					onNodeClick : (nodeData) => {
						x.modInfo(this.allmodules[nodeData.data.text_1]);
						x.dashboardInfo(this.allmodules[nodeData.data.text_1]["code"]);
					}
				});
				myTree.refresh(data_1);
			}
			res.insertAdjacentHTML('beforeend', '<br>');

		}
	}
}
</script>