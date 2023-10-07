// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { 
   getDatabase,
   ref,
   set,
   push,
   onChildAdded,
   update,
   remove
 } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCiF1me48yXjyV_qlaO3ApbLTSVKR-i1tU",
  authDomain: "todo-app-dd8d9.firebaseapp.com",
  projectId: "todo-app-dd8d9",
  storageBucket: "todo-app-dd8d9.appspot.com",
  messagingSenderId: "851793741592",
  appId: "1:851793741592:web:b41661442fdd74d7b3c06d",
  measurementId: "G-RCVP7SPTRC"
};

// Initialize Firebase
var app = initializeApp(firebaseConfig);
var auth = getAuth(app);
var DATABASE = getDatabase(app);



 var email = document.getElementById("email");
 var password = document.getElementById("password"); 
 var confirmPassword = document.getElementById("confirmPassword");
 window.signUp = function(){
     var user = {
         email : email.value,
         password : password.value
     }
if(password.value != confirmPassword.value){
  document.getElementById("error1").innerHTML = "password and confirm password must be same";
}else{
  createUserWithEmailAndPassword(auth,email.value,password.value)
  .then(function(success){
     // var userUid = success.user.uid;
     // user.id = userUid;
     var refLog = ref(DATABASE);
     var refLogData = push(refLog).key;
     user.id = refLogData;
     var refer = ref(DATABASE, `todoUsers/${user.id}`);
     set(refer, user)   
      .then(function () {
        //  console.log("User data saved in the database");
         email.value = "";
         password.value = "";
         confirmPassword.value = "";
         document.getElementById("error1").innerHTML = "";
         window.location.replace("./todo.html");
       })
     })
  .catch(function(error){
      console.log(error.code);
      if(error.code === "auth/weak-password"){
      // console.log("Password should be atleast 8 characters");
      document.getElementById("error").innerHTML = "Password should be atleast 8 characters";
  }else if(error.code == "auth/email-already-in-use"){
   document.getElementById("error2").innerHTML = "Email already in use........";
  }
  else{
      document.getElementById("error").style.display = "none";
      document.getElementById("error2").style.display = "none";
  }
  })
}  
}; 




 //=============== signIn===================
 window.signIn = function(){
     signInWithEmailAndPassword(auth,email.value,password.value)
     .then(function(success){
        //  console.log(success);
         window.location.replace("./todo.html")
     })
     .catch(function(error){
      if(error.code == "auth/invalid-login-credentials"){
        document.getElementById("error3").innerHTML = "Invalid Email.........";
      }
        //  console.log(error);
     })
 };
     
 
     
var text = document.getElementById("text");
var todoList = document.getElementById("todoList");
var todoData = [];
window.addData = function(){
  var todoText = {
    text : text.value
  }
  if(text.value == ""){
    alert("please enter something");
  }
  else{
    var referId = ref(DATABASE);
    var ID = push(referId).key;
    todoText.id = ID;
    var refer = ref(DATABASE,`todo/${todoText.id}`);
    set(refer,todoText);
    text.value= "";
  }
}

 function getDataFromDatabase(){
  var reference = ref(DATABASE,'todo');
  onChildAdded(reference,function(data){
    render(data.val());
  })
}

function render(data){
  if(data){
    todoData.push(data);
  }
  todoList.innerHTML = "";

  for(var i=0; i<todoData.length;i++){ 
    todoList.innerHTML += `<li>  ${todoData[i].text}  <button class="btnEdit" onclick="editData(${i})"> Edit  </button>    <button    class="btnDel" onclick="deleteData(${i})"> Delete </button>   </li>`
  }

}

window.editData= function(index){
  var a = prompt('enter text in replacement:');
  todoData[index].text = a;
  if(todoData[index].text == ""){
    alert("please enter something");
  }else{
    var reference = ref(DATABASE,`todo/${todoData[index].id}`)
    update(reference,{
      text: a
    })
    render();
  }
}

window.deleteData = function(index){
  var id = todoData[index].id;
  todoData.splice(index,1)
  var refer = ref(DATABASE,`todo/${id}`)
  remove(refer);
render();
}
window.deleteAllTodo = function(){
    todoData = [];
    todoList.innerHTML = "";
  var delRef = ref(DATABASE,`todo`);
  remove(delRef);
}

window.logOut = function(){
window.location.replace("./signUp.html")
}
window.onload = getDataFromDatabase;

