<template src = "./AcadPlan.html"></template>
<style src="./AcadPlan.css"></style>


<script>
import {draggable} from 'vuedraggable'
/* font awesome icons */
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTimes, faAlignJustify } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faTimes, faAlignJustify)
import carousel from 'vue-owl-carousel';

export default {
    name: "App",
    display: "Academic Planner",
    order: 14,
    components: {
        draggable,
        FontAwesomeIcon,
        carousel
    },
    data() {
        return {
            /* add module data */
            add_module_code: "",
            invalid_module: 0,
            inserted_module: 1,
            unmet_prereq: -1,
            exempted_module: 2,
            /* error message data */
            modal_header: "Default header",
            modal_body: "",
            /* edit module credits */
            add_mc: 1,
            subtract_mc: -1,
            /* statistics */
            statistics: {},
            /* user specific data */
            major: "",
            acadplan: {},
            module_semester_mapping: {},
            acadplan_exemptions: [],
            total_mc: 0,
            num_semester_mapping: [
                "Y1S1",  "Y1S2", "Y2S1", "Y2S2",  "Y3S1",  "Y3S2", "Y4S1",  "Y4S2"
            ],
            matriculated_year: 0,
            index: 1000,
        };
    },
    props: ['allmodules'],
    computed: {
        sorted_sems: function() {
            var result_arr = []
            for (var i in this.acadplan) {
                this.sort_modules(this.acadplan[i], i)
                result_arr = result_arr.concat([this.acadplan[i]]);
            }
            return result_arr
        }
    },
    methods: {
        calculateYear: function(semester_taking) {
            /**
             * Calculates what year the student will be in in that academic year
             */
            return Math.floor(semester_taking / 2);
        },
        calculateAcademicYear: function(semester_taking) {
            /**
             * Calculates the academic year 
             */
            var academic_year = (this.matriculated_year + Math.floor(semester_taking / 2)) % 2000;
            var academic_sem;
            if (semester_taking % 2) {
                academic_sem = 2;
            } else {
                academic_sem = 1;
            }
            return String(academic_year) + String(academic_year + 1) + "-S" + String(academic_sem);
        },
        update_dashboard_add: function(module_code, semester_taking) {
            /**
             * Takes in the updated dashboard data (statistics) and updates the data
             */
            // calculate academic year and semester that user is reading the module
            var reading_ay = this.calculateAcademicYear(semester_taking);
            // calculate year that user will be in
            var reading_year = this.calculateYear(semester_taking);
            if (reading_ay in this.statistics) {
                // update major in this.statistics
                this.statistics[reading_ay]["major"][this.major] += 1;
                // update year in this.statistics
                this.statistics[reading_ay]["year"][reading_year] += 1;
                // update total
                this.statistics[reading_ay]["total"] += 1;
            } else {
                this.statistics[reading_ay] = {
                    major: {},
                    total: 0,
                    year: [0, 0, 0, 0]
                }
                this.statistics[reading_ay]["major"][this.major] = 1;
                this.statistics[reading_ay]["year"][reading_year] += 1;
                this.statistics[reading_ay]["total"] += 1;
            }
        },
        
        add_module_sem: function() {
            console.log("add module called");
            /** 
             * adds module to the earliest possible semester the student can take it 
             */
            // remove whitespace and convert module name to lowercase
            var module_name = this.add_module_code.trim().toLowerCase();
            
            // clear module slot after use
            this.add_module_code = ""; 
            if (module_name !== "") {
                // check valid module
                var module = this.check_valid_module(module_name);
                if (module === this.invalid_module) {
                    this.printError("Attempted to Add Invalid Module", 
                    module_name.toUpperCase() + " cannot be found in our database. This can happen when the module has been discontinued or if the module name is incorrect. Please try a different module instead."
                    );
                } else if (module === this.exempted_module) {
                    this.printError("Attempted to Add Exempted Module",
                    "You are exempted from reading " + module_name.toUpperCase() + ". You do not need to add it into your academic plan."
                    );
                } else if (module === this.inserted_module) {
                    this.printError("Module in Academic Plan", module_name.toUpperCase() + " is already in your academic plan. Please do not add duplicate modules.");
                } else if (this.check_preclu(module.parsepreclu)) {
                    this.printError("Precluded Module in Academic Plan", "A preclusion of " + module_name.toUpperCase() + " is already in your academic plan.");
                } else {
                    // check if all prerequisites have been met
                    // console.log(module);
                    var mod_prerequisites_check = this.check_prerequisites_sem(module.parseprereq);
                    if (mod_prerequisites_check !== this.unmet_prereq) {
                        this.fetch_dashboard(module.code).then(doc => {
                            this.statistics = doc;
                        });
                        this.acadplan[mod_prerequisites_check].push({ mod: module.code, mc: module.mc, move: true, index: this.index }); 
                        this.module_semester_mapping[module.code] = parseInt(mod_prerequisites_check);
                        this.index++;
                        // updte module credits
                        this.update_module_credits(this.add_mc, mod_prerequisites_check, module.mc);
                        this.total_mc += module.mc;
                        
                        // save academic plan and dashboard data
                        this.save_acadplan();
                        // update dashboard
                        setTimeout(() => this.update_dashboard_add(module.code, mod_prerequisites_check), 1000);
                    } else {
                        this.printError("Incomplete Prerequisites", "This module cannot be added to your academic plan because you have yet to add all of its' prerequisites. Please do so first.");
                    }
                }
            } else {
                this.printError("Attempted to Add Blank Module", "Please type the module you wish to add in the textbox before pressing the Add button.");
            }
        },
        update_module_credits: function(add_subtract, sem, mc) {
            console.log("update module credits called");
            for (var module_index in this.acadplan[sem]) {
                // get module
                var module = this.acadplan[sem][module_index];
                // update modular credits
                if (module.mod === "") {
                    module.mc = module.mc + mc * add_subtract;
                    this.save_acadplan();
                    return;
                }
            }
        },
        
    },
}
</script>