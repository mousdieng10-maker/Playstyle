// script.js


import {show, showFlex, hide } from "./manageCard.js";

function select(selector) {
    return document.querySelector(selector);
}

const loginScreen = select("#loginScreen");
const homeScreen = select("#homeScreen");
const pressOn = select("#pressOn");
const musicPlayerBtn = select("#musicPlayerBtn");
const pressOnLogin = select("#pressOnLogin");
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
const playerCard = select("#playerCard");
const play = select("#play");
const audioSource = select("#audioSource"); 
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

const audioPlayer = select("#audioPlayer");


pressOnLogin.onclick = function(){
    hide(signupScreen);
    showFlex(loginScreen);
}

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


async function prepArchetype(name){
    hide(archetypeScreen);
    await window.pywebview.api.setPlaystyle(name)
    await initHomeScreen();
    showFlex(homeScreen);
    

}

defender.onclick = async function(){
    prepArchetype("defender");
    musicPlayer.style.position = "fixed";
}
tekkers.onclick = async function(){
    prepArchetype("tekkers");
    musicPlayer.style.position = "fixed";


}
allRounder.onclick = async function(){
    prepArchetype("all_rounder");
    musicPlayer.style.position = "fixed";

    

}
playmaker.onclick = async function(){
    prepArchetype("playmaker");
    musicPlayer.style.position = "fixed";


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
// start music
play.onclick = async function(){
    
}
// full size the card 
async function initCardScreen(){
    show(logInfoScreen);
    logInfoScreen.innerHTML = "";
    logInfoScreen.style.opacity = "0";
    logInfoScreen.className = "logScreenAni";
    setTimeout(() => {
        const logInput = document.createElement("textarea"); 
        logInput.className = "logInput";
        logInput.style.padding = "2em";
        logInput.style.color = "white";
        logInput.style.fontSize = "1.5em";
        logInput.placeholder = "type info about the task here:";
        const submitLog = document.createElement("button");
        submitLog.textContent = "log for Today";
        submitLog.style.height = "3em";
        const logDiv = document.createElement("div");
        logDiv.style.opacity = "0";
        
        logDiv.style.display = "flex"; 
        logDiv.style.flexDirection = "column";
        logDiv.style.gap = "1em";
        const logTitle = document.createElement("div"); 
        logTitle.style.opacity = "0";
        const insideLogTitle = document.createElement("h1");
        insideLogTitle.style.fontSize = "3em";
        insideLogTitle.style.color = "white";
        logDiv.className = "downAni";
        logTitle.className = "downAni";
        insideLogTitle.textContent = "Don't slack off lol, really describe it."; 
        logTitle.appendChild(insideLogTitle); 
        logInfoScreen.appendChild(logTitle); 
        logInfoScreen.appendChild(logDiv);
        
        logDiv.appendChild(logInput);
        logDiv.appendChild(submitLog);
            submitLog.onclick = async function(){
                if(logInput.value === ""){
                    return 
                }
                else{
                    const confirmMsg = await window.pywebview.api.save_log(logInput.value);
                    hide(logDiv);
                    hide(logTitle);
                    playerCard.classList.add("initAni");

                    playerCard.addEventListener("transitionend", () =>{playerCard.classList.add("initShake");}, {once:true});
                    insideLogTitle.textContent = "The card is unstable! Press it to level up!" 
                    show(logTitle);
                    

                    const rewardTask = await window.pywebview.api.reward_task();
                    console.log(rewardTask)
                    playerCard.onclick = async function(){
                        playerCard.classList.remove("initShake");
                        const statList = {"pace":paceHolder, "acceleration":accHolder, "vision":visionHolder, "meta":metaHolder, "physical":physicalHolder};
                        const dataToChange = statList[rewardTask]; 
                        console.log(dataToChange)
                        for(const node of dataToChange){
                            node.classList.add("stat-gold");
                            node.classList.add("shakeStat"); 
                        }
                        
                        setTimeout(async () => {
                            await initHomeScreen();         
                            
                            setTimeout(() => {               
                                playerCard.classList.remove("initAni");
                                for (const node of dataToChange) {
                                    node.classList.remove("stat-gold");
                                    node.classList.remove("statShake");
                                }
                                hide(logInfoScreen);
                            }, 1500);   

                        }, 500);
                            
                    }
                    
                }
            
            
        }
    },2000)
    logInfoScreen.style.background = `rgba(0,0,0,.9)`;
    logInfoScreen.style.width = "100%";
    logInfoScreen.style.height = "100%";
    logInfoScreen.style.position = "fixed";
    
    let questDetails = await window.pywebview.api.showQuests()
    
    

}
musicPlayerBtn.onclick = async function(){
    showFlex(musicPlayer)    
}
// make the home page a full size screen instead of a widget 
async function initHomeScreen(){
    body.style.display = "block"; 
    body.style.background = "white"; 
    await greetUser()
    const cardSrc = await window.pywebview.api.assign_card()
    playerCard.style.backgroundImage = `url(${cardSrc})`
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
// hide all initial screens

hide(musicPlayer);
hide(signupScreen);
hide(archetypeScreen); 
hide(homeScreen);
hide(logScreen);
hide(logInfoScreen); 
showFlex(loadLoginScreen)
hide(audioPlayer)
hide(loginScreen);

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
            const selectMusic = await window.pywebview.api.music()
            audioSource.src = selectMusic;
            //audioPlayer.load();
            //audioPlayer.play();
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
                showFlex(musicPlayer);
                musicPlayer.style.position = "relative";

                const selectMusic = await window.pywebview.api.music()
                audioSource.src = selectMusic;
                //audioPlayer.load();
                //audioPlayer.play();
                showFlex(archetypeScreen); 
                await window.pywebview.api.populate_quests();
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
