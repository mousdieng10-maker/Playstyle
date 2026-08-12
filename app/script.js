// script.js


import {show, showFlex, hide } from "./manageCard.js";

function select(selector) {
    return document.querySelector(selector);
}

const loginScreen = select("#loginScreen");
const homeScreen = select("#homeScreen");
const pressOn = select("#pressOn");
const musicPlayerBtn = select("#musicPlayerBtn");

const usernameInput = select("#usernameInput");
const passwordInput = select("#passwordInput");
const errorMsg = select("#errorMsg");
const loginBtn = select("#loginBtn");
const welcomeMsg = select("#welcomeMsg");
const musicPlayer = select("#musicPlayer");
const body = select("#body");

// sign up screen
const signupScreen = select("#signupScreen");
const subUsernameInput = select("#subUsernameInput");
const subPasswordInput = select("#subPasswordInput");
const conSubPasswordInput = select("#conSubPasswordInput");
const signupBtn = select("#signupBtn");
const signupErrorMsg = select("#signupErrorMsg");
const logInfoScreen = select("#logInfoScreen"); 



// placeholder login screen
const loadLoginScreen = select("#loadLoginScreen");

// home screen
const musicBackBtn = select("#musicBackBtn"); 
const paceHolder = document.querySelectorAll(".paceHolder");
const paceBar = select("#paceBar");

const accHolder = document.querySelectorAll(".accHolder");
const accBar = select("#accBar");

const physicalHolder = document.querySelectorAll(".physicalHolder");
const physicalBar = select("#physicalBar");

const metaHolder = document.querySelectorAll(".metaHolder");
const metaBar = select("#metaBar");

const visionHolder = document.querySelectorAll(".visionHolder");
const visionBar = select("#visionBar");

const cardOvr = select("#cardOvr");

const cardRole = select("#cardRole");
const quests = select("#quests");
const navUsername = select("#navUsername");
const cardName = select("#cardName");
const logScreen = select("#logScreen"); 



function createTask(title,desc){
    const task = document.createElement("div");
    task.className = "quest-row";
    const taskInfo = document.createElement("div");
    taskInfo.className = 'quest-info';
    const taskTitle = document.createElement("h4");
    taskTitle.textContent = title;
    const taskDesc = document.createElement("p");
    taskDesc.textContent = desc;
    const goBtn = document.createElement("button");
    goBtn.textContent = "Sign";

    task.appendChild(taskInfo);
    taskInfo.appendChild(taskTitle);
    taskInfo.appendChild(taskDesc);
    task.appendChild(goBtn);
    quests.appendChild(task);

    
    goBtn.onclick = async function(){
        hide(homeScreen)
        await window.pywebview.api.rid_task(taskTitle.textContent) 
        await initCardScreen()
    }

}

// archetype screen
const archetypeScreen = select("#archetypeScreen"); 
const defender = select("#defender");
const tekkers = select("#tekkers");
const allRounder = select("#allRounder"); 
const playmaker = select("#playmaker");

// hide all initial screens

hide(musicPlayer);
hide(signupScreen);
hide(archetypeScreen); 
hide(homeScreen);
hide(logScreen);
hide(logInfoScreen); 
showFlex(loadLoginScreen)

setTimeout(() => load(loadLoginScreen, loginScreen), 3000);

async function prepArchetype(name){
    hide(archetypeScreen);
    await window.pywebview.api.setPlaystyle(name)
    await initHomeScreen();
    showFlex(homeScreen);
    

}

defender.onclick = async function(){
    prepArchetype("defender");

}
tekkers.onclick = async function(){
    prepArchetype("tekkers");

}
allRounder.onclick = async function(){
    prepArchetype("all_rounder");
    

}
playmaker.onclick = async function(){
    prepArchetype("playmaker");

}

musicBackBtn.onclick = function(){
    hide(musicPlayer)
}

const notFilledError = "Please fill up all corresponding fields!"

function load(divLoader, div){
    hide(divLoader);
    showFlex(div); 
}
function modifyTextContent(nodeArray, dictRef, what){
    for(const node of nodeArray){
        node.textContent = dictRef[what]; 
    }
}
// full size the card 
async function initCardScreen(){
    body.style.display = "flex";
    hide(homeScreen); 
    show(logInfoScreen);
    logInfoScreen.innerHTML = "";
    body.style.background = 'url("assets/cardRevealBg.png")';
    const logInput = document.createElement("input"); 
    logInput.className = "logInput";
    logInput.placeholder = "type info about the task here:";
    const submitLog = document.createElement("button");
    submitLog.textContent = "log for Today";
    const logDiv = document.createElement("div");
    logDiv.style.display = "flex"; 
    logDiv.style.gap = "1em";
    logInfoScreen.appendChild(logDiv);
    logDiv.appendChild(logInput);
    logDiv.appendChild(submitLog); 
    let questDetails = await window.pywebview.api.showQuests()
    submitLog.onclick = async function(){
        if(logInput.value === ""){
            return 
        }
        else{
            const confirmMsg = await window.pywebview.api.save_log(logInput.value);
            hide(logInfoScreen);
            const rewardTask = await window.pywebview.api.reward_task();
            await initHomeScreen()
            showFlex(homeScreen);
        }
        
        
    }
    

}
musicPlayerBtn.onclick = async function(){
    showFlex(musicPlayer)    
}
// make the home page a full size screen instead of a widget 
async function initHomeScreen(){
    body.style.display = "block"; 
    body.style.background = "white"; 
    await greetUser()
    let player_stats = await window.pywebview.api.getStats();
    modifyTextContent(paceHolder, player_stats, "pace");
    paceBar.style.width = `${player_stats.pace}%`;

    modifyTextContent(accHolder, player_stats, "acceleration");
    accBar.style.width = `${player_stats.acceleration}%`

    modifyTextContent(physicalHolder, player_stats, "physical");
    physicalBar.style.width = `${player_stats.physical}%`

    modifyTextContent(metaHolder, player_stats, "meta");
    metaBar.style.width = `${player_stats.meta}%`

    modifyTextContent(visionHolder, player_stats, "vision");
    visionBar.style.width = `${player_stats.vision}%`

    cardOvr.textContent = player_stats.overall;
    cardRole.textContent = player_stats.playstyle;
    navUsername.textContent = player_stats.username;
    cardName.textContent = player_stats.username; 
    let playstyleDetails = await window.pywebview.api.showQuests()
    quests.innerHTML = "";
    let sections  = ["lower_quests", "medium_quests", "higher_quest","exceptional_quests"]
    let acSections = []
    for(const section of sections){
        if(playstyleDetails[section].length !== 0){
            acSections.push(section)
        }
    }
    for(const playstyle of playstyleDetails[acSections[0]]){
        createTask(playstyle.quest_name,playstyle.description)
    }
}


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
                showFlex(archetypeScreen); 
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
