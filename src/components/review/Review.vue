
<template>
    <div id="overlay">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header">
              <h1 id = 'reviewTitle'>Add Review</h1>

            </slot>
          </div>
          <div class="modal-body">
            
            <slot name="body" id='writtenBody'>
              <textarea id ='writtenReview' cols=1000 rows=10 placeholder = 'Type your review here'></textarea>
            </slot>
            <slot name="footer">
              <button class="btn" id = 'submitReview' @click="togglePopUp(); submitR();">
                Submit Review
              </button>
            </slot>
            <slot>
                <button type="button" class= "closeReviewBtn" @click="togglePopUp();">Close</button>
            </slot> 
          </div>
        </div>
      </div>




</template>
<script>
import {ref, onMounted } from 'vue';
import { db } from '@/firebase'
import { collection, query, where, getDocs, doc, addDoc } from "firebase/firestore";



export default {

    props : ['togglePopUp'],
    methods: {
        submitR: async function() {
          alert('Review Submitted');
        
          var review = document.getElementById('writtenReview').value;
          var module_code = document.getElementById('mod_title').innerHTML.split(' ')[0];

          console.log("submitted reviews");
          await addDoc(collection(db, "reviews"), {
            module_code: module_code,
            review: review,
          });

          const q = query(collection(db, "reviews"), where("module_code", "==", module_code));

          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
          });
          
        },
    }
}
</script>

<style scoped>


  .modal-container {
    position: fixed;
    top: 0%;
    left: 0%;
    width: 100%;
    height:100%;
    background-color:white;
    justify-content: middle;
  }

  .closeReviewBtn {
    position: absolute;
    top: 5%;
    right: 5px;
    background-color: grey;
    color: black;
    font-size: 20px;
    border: none;
    cursor: pointer;
  }
  #submitReview {
    cursor: pointer;
  }


</style>