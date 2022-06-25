<template src = "./ModuleInfo.html"> </template>
<style src = "./ModuleInfo.css"> </style>

<script>
import modules from "../../assets/allmoduleinfo.json";
import * as Treeviz from 'treeviz';
import {db } from '@/firebase'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { mapGetters } from "vuex";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Review from '../review/Review.vue';
import { ref } from 'vue'

var moduleReview = {};

export default {
	
	name: "App",
	display: "Module Information",
	components: {
		FontAwesomeIcon,
		Treeviz,
		Review
	},

	data: function() {
		return {
			popUpTriggers: false,
			search:'',
			mods: Object.values(modules),
			show: true,
			years:[],
		}
	},

	props: ['allmodules'],
	computed: {
		filteredList() {
			return Object.keys(this.allmodules).filter(mod => {
				var query = this.search.toLowerCase();
				return this.allmodules[mod].fullname.toLowerCase().includes(query)
            })
		},
		
	},

	
	methods:{
		reviewForm: function() {
			<Review></Review>
		},
		togglePopups: function() {
			this.popUpTriggers = !this.popUpTriggers;
		},

		close: function() {
			this.popUpTriggers = false;
		},

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
				var col = ["#2C3531","#116466","#D9B08C","#FFCB9A","#D1E8E2"];
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
					{id: 1, text_1: mod.code, father: null, color:"#116466" },
				]
				var count = 2;
				for(var i in lst){
					data_1.push({id: count, text_1: this.allmodules[lst[i]].code, father: 1, color:"#D1E8E2"});
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
					}
				});
				myTree.refresh(data_1);
			}
			res.insertAdjacentHTML('beforeend', '<hr></hr>');
			this.fetchReviews()
		},
		updateAcademicYear: function() {
			var today = new Date();
			var month = today.getMonth() + 1; // +1 since month starts in June
			var year = today.getFullYear() - 2000; // get year number, e.g. 19 for 2019
			var academic_year; 
			if (month < 6) {
				academic_year = String(year-1) + String(year) + "-S2";
			} else {
				academic_year = String(year - 1) + String(year) + "-S1"
			}
			this.current_ay = academic_year;
		},
		submitReview: function(quality, staff, relevance, difficulty, workload, review, year) {
			var userid;
			var user = this.fetchUser();
			if (user != null) {
				userid = user.uid;
			}
			var module_code = document.getElementById('mod_title').innerHTML.split(' ')[0];
			year = year.slice(0,2)+year.slice(3,5)+'s'+year.slice(-1)[0];
			var reviewDict = {};
			reviewDict['userid'] = user.displayName;
			reviewDict['quality'] = parseFloat(quality);
			reviewDict['relevance'] = parseFloat(relevance);
			reviewDict['difficulty'] = parseFloat(difficulty);
			reviewDict['staff'] = parseFloat(staff);
			reviewDict['workload'] = parseFloat(workload);
			reviewDict['review'] = review.value;
			reviewDict['year'] = year;
			
			if (moduleReview == undefined) {
				moduleReview = {};
			}
			moduleReview[userid] = reviewDict;
			document.querySelector('#overlay').style.display = 'none';
			document.querySelector('#userReview').disabled = true;
			console.log("submitted reviews");
			db.collection('reviews').doc(module_code).set({
				"module_reviews": moduleReview,
			},{merge:true}).then(()=>{
				moduleReview = {};

			});
		},
		fetchUser: function() {
			var user = db.auth().currentUser;
			return user;
		},
		
	
		loadReview(modCode, user) {
            //var user = firebase.auth().currentUser;
			let reviewRef = db.collection('reviews').doc(modCode);
			var overlay = document.getElementById('overlay');
			overlay.style.display = 'block';
			var closeReview = document.querySelector('#closeReview');
			closeReview.addEventListener('click',function(){
				overlay.style.display = 'none';
			});
            reviewRef.get()
                .then(doc => {
					var review = document.getElementById('writtenReview');
					review.value = doc.data()['module_reviews'][user]['review'];
					this.quality = doc.data()['module_reviews'][user]['quality'];
					this.relevance = doc.data()['module_reviews'][user]['relevance'];
					this.staff = doc.data()['module_reviews'][user]['staff'];
					this.difficulty = doc.data()['module_reviews'][user]['difficulty'];
					this.workload = doc.data()['module_reviews'][user]['workload'];
					var year = document.getElementById('year');
					var value = doc.data()['module_reviews'][user]['year'];
					var yearString = value.slice(0,2)+"/"+value.slice(2,4)+' Semester '+ value[5];
					year.value = yearString;
                })

        },
		
		fetchReviews: function() {
			var res = document.getElementById("res_review");
			res.insertAdjacentHTML('beforeend','<br></br>')
			res.insertAdjacentHTML('beforeend','<h4 id = "WrittenReviewsTitle">Detailed Reviews <button class = "btn-addreview" id = "userReview">Click to Review</bu></h4>')
			// var module_code = document.getElementById('mod_title').innerHTML.split(' ')[0];
			// let userRef = db.collection('reviews').doc(module_code);
			// var res = document.getElementById("res_review");
			// res.innerHTML = "";
			// var overlay = document.querySelector('#overlay');

			// var module_review = {};
			// var userid = this.fetchUser().uid;

			// res.insertAdjacentHTML('beforeend','<br></br>');
			// res.insertAdjacentHTML('beforeend','<h4 id = "WrittenReviewsTitle">Detailed Reviews <button class = "btn-addreview" id = "userReview">Click to Review</bu></h4>');	
			// var reviewMod = document.querySelector('#userReview');
			// reviewMod.addEventListener('click',function(){
			// 	overlay.style.display = 'block';
			// 	});
			// var closeReview = document.querySelector('#closeReview');
			// closeReview.addEventListener('click',function(){
			// 	overlay.style.display = 'none';
			// });
            // userRef.get().then( doc => {
			// 	if (doc.exists) {
			// 		module_review = doc.data()['module_reviews'];
			// 		moduleReview = module_review;


			// 	}
			// 	if (Object.keys(module_review).includes(userid)) {
			// 		reviewMod.disabled = true;
			// 	}


			// 	var writtenReviews = {};
			// 	if (moduleReview != {}) {
			// 		for (let [id, written] of Object.entries(module_review)) {
			// 			if (written['review'].length > 0) {
			// 				writtenReviews[id] = written;
			// 			}
			// 		}
			// 		if (Object.keys(module_review).includes(userid) && !Object.keys(writtenReviews).includes(userid)) {
			// 			/* add review and delete buttons here */
			// 			res.insertAdjacentHTML('beforeend', '<button id = "editBtn">Edit</button>');
			// 			res.insertAdjacentHTML('beforeend', '<button id = "reviewBtn">Delete</button>');
			// 			document.getElementById("reviewBtn").addEventListener("click", ()=>{
			// 				this.deleteReview(module_code, userid);
			// 			});
			// 			document.getElementById("editBtn").addEventListener("click", ()=>{
			// 				this.loadReview(module_code, userid);
			// 			});
			// 		}
			// 	}
			// 	try {
			// 		var x = document.getElementById("tabody");
			// 		x.innerHTML = "";
			// 	} catch (error) {
			// 		res.insertAdjacentHTML('beforeend','<hr></hr><table><tbody id = "tabody">');
			// 		console.log("No tag found error")
			// 	}
			// 	if (moduleReview != {}) {
			// 		for (let [id, review] of Object.entries(writtenReviews)) {
			// 			var r = document.getElementById("tabody");
			// 			var y = review["year"];
			// 			var d = review['difficulty'];
			// 			var q = review['quality'];
			// 			var re = review['relevance'];
			// 			var s = review['staff'];
			// 			var w = review['workload'];
			// 			var n = review['userid'];
			// 			id;
			// 			var year = y.slice(0,2) + "/" + y.slice(2,4)+ " Sem " + y.slice(5,6);
						
			// 			r.insertAdjacentHTML('beforeend','<tr>');
			// 			if (this.fetchUser().uid == id){
			// 				r.insertAdjacentHTML('beforeend','<td class="rev-small">'+ '<span class="username">' + n + '</span>' + '<br>'+ year + '<br>' 
			// 				+ '<button class="btn-review" id = "editBtn">Edit</button>' + '<button class="btn-review" id = "reviewBtn">Delete</button></td>' +
			// 				'<td class="rev-small"><div id = "quality">Quality of Content: <span id="indivReview">' + q + '/5</span></div>'+ 
			// 				'<div id = "quality">Relevance of Content: <span id="indivReview">' + re +'/5</span></div>'+
			// 				'<div id = "quality">Difficulty of Content: <span id="indivReview">' + d +'/5</span></div>'+
			// 				'<div id = "quality">Heaviness of Workload: <span id="indivReview">' + w +'/5</span></div>'+
			// 				'<div id = "quality">Quality of Teaching Staff: <span id="indivReview">' + s +'/5</span></div></td> <td>'
			// 				+review['review'] + '</td>');
							
			// 				document.getElementById("reviewBtn").addEventListener("click", ()=>{
			// 					this.deleteReview(module_code, id);
			// 					this.updateReviews();
			// 				});
			// 				document.getElementById("editBtn").addEventListener("click", ()=>{
			// 					this.loadReview(module_code, id);
			// 				});						
			// 			} else {
			// 				r.insertAdjacentHTML('beforeend','<td class="rev-small">'+ '<span class="username">' + n + '</span>' + '<br>'+ year +'</td>' +
			// 				'<td class="rev-small"><div id = "quality">Quality of Content: <span id="indivReview">' + q + '/5</span></div>'+ 
			// 				'<div id = "quality">Relevance of Content: <span id="indivReview">' + re +'/5</span></div>'+
			// 				'<div id = "quality">Difficulty of Content: <span id="indivReview">' + d +'/5</span></div>'+
			// 				'<div id = "quality">Heaviness of Workload: <span id="indivReview">' + w +'/5</span></div>'+
			// 				'<div id = "quality">Quality of Teaching Staff: <span id="indivReview">' + s +'/5</span></div></td> <td>'
			// 				+review['review'] + '</td>');
			// 			}
			// 			r.insertAdjacentHTML('beforeend','</tr><br>');
			// 		}
			// 	}
				
			// });
		}
	}
}
</script>