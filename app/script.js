// script.js
import {show, showFlex, hide } from "./manageCard.js";

const loginScreen = document.getElementById("loginScreen");
const homeScreen = document.getElementById("homeScreen");
const pressOn = document.getElementById("pressOn");

const usernameInput = document.getElementById("usernameInput");
const passwordInput = document.getElementById("passwordInput");
const errorMsg = document.getElementById("errorMsg");
const loginBtn = document.getElementById("loginBtn");
const welcomeMsg = document.getElementById("welcomeMsg");
const musicPlayer = document.getElementById("musicPlayer"); 
const body = document.getElementById("body"); 
// sign up screen
const signupScreen = document.getElementById("signupScreen");
const subUsernameInput = document.getElementById("subUsernameInput"); 
const subPasswordInput = document.getElementById("subPasswordInput");
const conSubPasswordInput = document.getElementById("conSubPasswordInput");
const signupBtn = document.getElementById("signupBtn"); 
const signupErrorMsg = document.getElementById("signupErrorMsg");

// placeholder login screen
const loadLoginScreen = document.getElementById("loadLoginScreen"); 

// home screen 
const paceHolder = document.getElementById("paceHolder");
const paceBar = document.getElementById("paceBar");

const accHolder = document.getElementById("accHolder");
const accBar = document.getElementById("accBar");

const physicalHolder = document.getElementById("physicalHolder");
const physicalBar = document.getElementById("physicalBar");

const metaHolder = document.getElementById("metaHolder");
const metaBar = document.getElementById("metaBar");

const visionHolder = document.getElementById("visionHolder");
const visionBar = document.getElementById("visionBar");

const cardOvr = document.getElementById("cardOvr");

// hide all initial screens

hide(musicPlayer);
hide(signupScreen);
hide(loginScreen);
hide(homeScreen);

const notFilledError = "Please fill up all corresponding fields!"

function load(divLoader, div){
    hide(divLoader);
    showFlex(div); 
}

// make the home page a full size screen instead of a widget 
async function initHomeScreen(){
    body.style.display = "block"; 
    body.style.background = "white"; 
    await greetUser()
    let player_stats = await window.pywebview.api.getStats();
    paceHolder.textContent = player_stats.pace;
    paceBar.style.width = `${player_stats.pace}%`;

    accHolder.textContent = player_stats.acceleration;
    accBar.style.width = `${player_stats.acceleration}%`

    physicalHolder.textContent = player_stats.physical;
    physicalBar.style.width = `${player_stats.physical}%`

    metaHolder.textContent = player_stats.meta;
    metaBar.style.width = `${player_stats.meta}%`

    visionHolder.textContent = player_stats.vision;
    visionBar.style.width = `${player_stats.vision}%`

    cardOvr.textContent = player_stats.overall;
}

setTimeout(() => load(loadLoginScreen, loginScreen), 3000);

// compare two strings
function compare(string1, string2){
    if(string1.value.trim() == string2.value.trim()){
        return true;
    }
    else{
        return false;

    }
}
// login handler

loginBtn.addEventListener("click", async () =>{
    // login logic checking when clicked
    if(usernameInput.value.trim() === "" || passwordInput.value.trim() === ""){
        errorMsg.textContent = notFilledError;
    }
    else{
        errorMsg.textContent = "";
        let todo = await window.pywebview.api.login(usernameInput.value.trim(),passwordInput.value.trim());
        if(todo != true){
            errorMsg.textContent = todo
        }
        else{
            hide(loginScreen);
            await initHomeScreen()
            showFlex(homeScreen);
        }
    }
})

// sign up text is clicked

pressOn.onclick = function(){
    hide(loginScreen); 
    showFlex(signupScreen)
}

// sign up handler
signupBtn.addEventListener("click", async () => {
    if(subUsernameInput.value.trim() === "" || subPasswordInput.value.trim() === ""){
        signupErrorMsg.textContent = notFilledError
    }
    else{
        let confirm = compare(subPasswordInput, conSubPasswordInput); 
        if(confirm == true){
            let backendSignUp = await window.pywebview.api.signup(subUsernameInput.value.trim(), subPasswordInput.value.trim());
            if(backendSignUp != true ){
                signupErrorMsg.textContent = backendSignUp; 
            }
            else{
                hide(signupScreen);
                await initHomeScreen()
                showFlex(homeScreen); 
            }
        }
        else{
            signupErrorMsg.textContent = "Please type the same password in both fields!"; 
        }
    }
})

// ==============================
// home js

async function greetUser(){
    let greeting = await window.pywebview.api.greetSelf();
    welcomeMsg.textContent = greeting; 
    console.log(greeting)
}
