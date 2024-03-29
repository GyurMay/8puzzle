
const zeroPiece = 9;
var pieceHeight, pieceWidth;
const FINALSTATE_ = `
    <canvas id="canvas1" class="unclickable" onclick="movePiece(1)" style="background-position: 0px 0px;" width="70" height="70"></canvas>
    <canvas id="canvas2" class="unclickable" onclick="movePiece(2)" style="background-position: 140px 0px;" width="70" height="70"></canvas>
    <canvas id="canvas3" class="unclickable" onclick="movePiece(3)" style="background-position: 70px 0px;" width="70" height="70"></canvas><br>
    <canvas id="canvas4" class="unclickable" onclick="movePiece(4)" style="background-position: 0px 140px;" width="70" height="70"></canvas>
    <canvas id="canvas5" class="unclickable" onclick="movePiece(5)" style="background-position: 140px 140px;" width="70" height="70"></canvas>
    <canvas id="canvas6" class="unclickable" onclick="movePiece(6)" style="background-position: 70px 140px;" width="70" height="70"></canvas><br>
    <canvas id="canvas7" class="unclickable" onclick="movePiece(7)" style="background-position: 0px 70px;" width="70" height="70"></canvas>
    <canvas id="canvas8" class="unclickable" onclick="movePiece(8)" style="background-position: 140px 70px;" width="70" height="70"></canvas>
    <canvas id="canvas9" class="unclickable" onclick="" style=" background-position: 70px 70px; background-repeat: repeat !important; background-attachment: scroll !important; background-image: none !important; background-size: auto !important; background-origin: padding-box !important; background-clip: border-box !important;" width="70" height="70"></canvas>
`;
const FINALSTATE = ['dummy'];
for (i = 1; i <= 9;i++)
	FINALSTATE.push("canvas" + i);

var firstMove = true;

window.onload = () => {
	if(!document.location.href.toString().includes("fb") && !document.location.href.toString().includes("facebook") && window.innerWidth < 500){
		document.body.style.marginTop = '25%';
		topMsgBox.style.marginTop = '30%';
	}
	// randBgImg = `imgs/sampleImage${Math.floor(Math.random() * 200 + 1)}.jpg`;	
	// document.querySelector("style").innerHTML = `.unclickable{ background: url(${randBgImg}) }`;

	pieceHeight = canvas1.style.height; //take any canvas as sample
	pieceWidth = canvas1.style.width;
	loadImages();
	/*showComplete.onmousedown = (e) => {
		let tempState = box.innerHTML;
		box.innerHTML = FINALSTATE;
		showComplete.onmouseup = (f) => {
			console.log("mose le");
			box.innerHTML = tempState;
		}
	}*/
	//for mobile versions
	shown = false;
	showComplete.onclick = (e) => {
		if (!shown) {
			tempState = box.innerHTML;
			box.innerHTML = FINALSTATE_.replaceAll(/onclick=.+[0-9]\)"/g, 'onclick=""');
			
			visibleSol.style.display = 'none';
			hiddenSol.style.display = 'block';

			shown = true;
		} else {
			hiddenSol.style.display = 'none';
			visibleSol.style.display = 'block';

			box.innerHTML = tempState;
			shown = false;
        }
    };
    aiSolveBtn.onclick = () => {
		currState = [];
		document.querySelectorAll('.unclickable').forEach(x => {
			currId = parseInt(x.id[x.id.length - 1]);
			if(currId == 9) currId = 0;
			currState.push(currId);
		});
		console.log(currState);
/*
		let level = [];
		level[2] = "Little difficult i see";
		level[3] = "Pretty Difficult";
		level[4] = "Unsolvable :(";
		let tics = 1;
		let timer = setInterval(() => {
			if(tics > 4) clearInterval(timer);
			if(solAry == null){
				topMsgBox.style.visibility = 'visible';
				topMsgBox.innerHTML = `Oof. ${level[tics++]}`;
			}
		}, 1000);

*/

		solAry = solver(currState);
		if(solAry == null){
			topMsgBox.style.visibility = 'visible';
			topMsgBox.innerHTML = `KaTarey AI couldn't find the solution :( <br /> Try another one 
			<button onclick="topMsgBox.style.visibility = 'hidden'"> Close </button>`;
		}
		playArray(solAry);

		// console.log(solAry.toString());
	}
    // aiSolveBtn.onclick = () => 
	// setTimeout(() => randomize(), 1000);
};

function playArray(a, i = 0){
	if(i >= a.length) return;
		let zeroInx = a[i].indexOf(0);
		let zeroInxR = a[i+1].indexOf(0);
		console.log("zeroInx:",zeroInx," zeroInxR:", zeroInxR);
		let nextMove;
		if(zeroInx + 1 == zeroInxR){
			console.log("Next Move: Right")
			nextMove = document.querySelector(`#canvas9`).nextElementSibling;
		}
		if(zeroInx - 1 == zeroInxR){
			console.log("Next Move: Left")
			nextMove = document.querySelector(`#canvas9`).previousElementSibling;
		}
		if(zeroInx + 3 == zeroInxR){
			console.log("Next Move: Up")
			nextMove = document.querySelector(`#canvas9`).nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling;
		}
		if(zeroInx - 3 == zeroInxR){
			console.log("Next Move: Down")
nextMove = document.querySelector(`#canvas9`).previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling;
		}
		nextMove.click();
		setTimeout(() => playArray(a, ++	i), 500);
}
function loadImages() {
	c1 = ctx("canvas" + zeroPiece);
	offsets = [0, 140, 70];
	for (i = 0; i < 3; i++) {
		for (j = 0; j < 3; j++) {
			bgp = ` ${offsets[j]}px ${offsets[i]}px`;
			console.log(`canvas${i * 3 + j + 1} = ${bgp}`);
			c1 = document.getElementById(`canvas${i * 3 + j + 1}`);
			c1.style.backgroundPosition = bgp;
		}
	}
	// callback();
}
function ctx(id) {
	return document.getElementById(id).getContext('2d');
}
function movePiece(e) {
	if (firstMove) {
		startTime = (new Date()).getTime();
    }
	//console.log(e);
	ce = e; // client/clicked element ce - current element
	ze = document.getElementById("canvas" + zeroPiece);
	ce = document.getElementById("canvas" + ce);
	//console.log(ce);
	pieceUnder = pieceAbove = ce;
	pieceUnderFlag = pieceAboveFlag = true; //something is below the piece

	pieceUnderTemp = pieceAboveTemp = ce;
	for (i = 1; i <= 4; i++) {
		if (pieceUnderTemp == null) {
			pieceUnderFlag = false;
			//console.log("under is null");
		} else {
			pieceUnderTemp = pieceUnderTemp.nextElementSibling;
			//console.log("next elem: ",pieceUnderTemp);
		}
	}
	for (i = 1; i <= 4; i++) {
		if (pieceAboveTemp == null) {
			pieceAboveFlag = false;
			//console.log("above is null");
		} else {
			pieceAboveTemp = pieceAboveTemp.previousElementSibling;
			//console.log("prev elem: ",pieceAboveTemp);
		}
	}
	possible_moves = [ce.previousElementSibling == ze, ce.nextElementSibling == ze, pieceAboveTemp == ze, pieceUnderTemp == ze]; //lrud
	console.log(possible_moves);
	//console.log("below is ", pieceUnder, "\nabove is", pieceAbove);
	if (ce.nextElementSibling == ze || ce.previousElementSibling == ze) { //move left or right
		swap(ce, ze);
		return true;
	} else if (pieceAboveFlag && pieceAboveFlag) {
		pieceUnder = pieceUnderTemp;
		pieceAbove = pieceAboveTemp;
		if (pieceUnder == ze || pieceAbove == ze) { //move under or above
			swap(ce, ze);
		}
	}
	else if (pieceUnderFlag) {
		pieceUnder = pieceUnderTemp;
		if (pieceUnder == ze) { //move under
			swap(ce, ze);
		}
	} else if (pieceAboveFlag) {
		pieceAbove = pieceAboveTemp;
		if (pieceAbove == ze) { //move above
			swap(ce, ze);
		}
	}
}
function swap(ce, ze) {
	sfx = new Audio('slide.mp3');
	sfx.play();
	moves = "lrud";
	move = moves[possible_moves.findIndex((a) => a == true)];
	anim = [];
	anim["l"] = 'translateX(-70px)';
	anim["r"] = 'translateX(70px)';
	anim['u'] = 'translateY(-70px)';
	anim['d'] = 'translateY(70px)';
	animDuration = 100;
	ce.animate([
		{
			transform: anim[move]
		}
	], {
		duration: animDuration
	});
	setTimeout(() => {
		pieceUnderHTML = ce.outerHTML;
		ze.outerHTML = pieceUnderHTML;
		ce.outerHTML = ze.outerHTML;

		statesMatch = true;
		for (i = 1; i <= 9; i++) {
			if (FINALSTATE[i] !== box.innerHTML.split('id="')[i].split('"')[0].split("class")[0])
				statesMatch = false;
		}

		if (statesMatch) {
			new Audio('won.mp3').play();
			console.log("game won");
			gameWon();
		}
	}, animDuration - 80);

}
function gameWon() {
	topMsgBox.style.visibility = "visible";
	// topMsgBox.style.placeSelf = "center";
	
	finishTime = (new Date()).getTime();
	ttSolve = (finishTime - startTime) / 10;
	ttSolve = ttSolve.toPrecision(3);
	topMsgBox.innerHTML = `Time: ${ttSolve}secs <br /><br /> Lets beat this score <br /><br /> <a href="${document.location.href}">PLAY AGAIN</a>`;
	box.innerHTML = box.innerHTML.replaceAll(/onclick=.+[0-9]\)"/g, 'onclick=""');
}
function findDis(i,j){
    // could use manhattan distance with a nested for loop method here. i chose something else O(N) although doesn't matter anyways
    
    let costAry = [];
    costAry[1] = ['01', '03', '12', '14', '25', '34', '36', '45', '47', '58',  '67', '78'];
    costAry[2] = ['04', '02', '15','13','20','24','35','37', "31",'46','48','57','68'];
    costAry[3] = ['07','05','18','16','27','23','38','56'];
    costAry[4] = ['08','26'];
    
    let g = i > j ? i : j;
    let l = i < j ? i : j;
    let d = [];
    let str = ''
    if(i == j) return 0;
    if(g-l == 6) return 2;
    for(let l=1;l<=4;l++){
            let givenIJ = i+''+j, givenJI = j+''+i;
            if(costAry[l].includes(givenIJ) || costAry[l].includes(givenJI))
                return l;
    }
}
const doable = (currentState) => {
	// find distance to missing piece parity
	let currentBlanksPosition = currentState.findIndex(x => x === 9);
	console.log();
	let initToFinalParity = (findDis(currentBlanksPosition, 8) % 2) == 0; // even if true
	// console.log(currentBlanksPosition, initToFinalParity);
  	
	let permutationCount = 0;
	let finalstate = [1,2,3,4,5,6,7,8,9];
    for(let i=0;i<9;i++){
    	if(currentState[i] !== finalstate[i]){
    		// swap the values
    		let temp = currentState[i];
    		currentState[i] = finalstate[i];
    		currentState[finalstate[i]] = temp;
    		permutationCount++;
    	}
    }
    // console.log(permutationCount, "permutationCount")
    return ((permutationCount %2 === 0) === initToFinalParity); //if both even then only its possible to solve
}
const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

function randomize() {
	// document.getElementById("canvas9").previousElementSibling.click();
	// autoplayLoop(0, r);

	i = 1;
	arr = [];
	arr[i++] = `<canvas id="canvas1" class="unclickable" onclick="movePiece(1)" style="background-position: 0px 0px;" width="70" height="70"></canvas>`;
	arr[i++] = `<canvas id="canvas2" class="unclickable" onclick="movePiece(2)" style="background-position: 140px 0px;" width="70" height="70"></canvas>`;
	arr[i++] = `<canvas id="canvas3" class="unclickable" onclick="movePiece(3)" style="background-position: 70px 0px;" width="70" height="70"></canvas>`;
	arr[i++] = `<canvas id="canvas4" class="unclickable" onclick="movePiece(4)" style="background-position: 0px 140px;" width="70" height="70"></canvas>`;
	arr[i++] = `<canvas id="canvas5" class="unclickable" onclick="movePiece(5)" style="background-position: 140px 140px;" width="70" height="70"></canvas>`;
	arr[i++] = `<canvas id="canvas6" class="unclickable" onclick="movePiece(6)" style="background-position: 70px 140px;" width="70" height="70"></canvas>`;
	arr[i++] = `<canvas id="canvas7" class="unclickable" onclick="movePiece(7)" style="background-position: 0px 70px;" width="70" height="70"></canvas>`;
	arr[i++] = `<canvas id="canvas8" class="unclickable" onclick="movePiece(8)" style="background-position: 140px 70px;" width="70" height="70"></canvas>`;
	arr[i++] = `<canvas id="canvas9" class="unclickable" onclick="" style="background-position: 70px 70px; background-repeat: repeat !important; background-attachment: scroll !important; background-image: none !important; background-size: auto !important; background-origin: padding-box !important; background-clip: border-box !important;" width="70" height="70"></canvas>`;

	boxInnerHTML = '';
	j = 1;
	// let currentState = [1,2,3,4,5,6,7,8,9];
	let found = false;
	let shuffledState = [1,2,3,4,5,6,7,9,8];
	while(true){
		shuffledState.sort((a, b) => 0.5 - Math.random());
		// let shuffledState = shuffleArray(currentState);
		console.log("trying ",shuffledState);
		let copyState = [...shuffledState];
		// isDoable = doable(copyState);
		if(doable(copyState)){
			console.log("current shuffledState is doable:", [...shuffledState]);
			let c = 0;
			[...shuffledState].forEach(x => {
			// for(let thisIndex=0;thisIndex<9; thisIndex++){
				let thisIndex = [...shuffledState].findIndex(y => y === x);
				console.log("x: ",x, "thisIndex:",thisIndex+1)
				// if(c++ < 9){

				boxInnerHTML += arr[x] + '\n';
				if (thisIndex+1 == 3 || thisIndex+1 == 6) {
					boxInnerHTML += '<br />\n';
				}

			// console.log(x, boxInnerHTML);
				// }
			});
			console.log(boxInnerHTML);
			document.querySelector("#box").innerHTML = boxInnerHTML;
			break;
		}
	}
}

function autoplayLoop(i, r) {
	if (i >= r) return;
	rId = Math.floor(Math.random() * 9 + 1);
	rId2 = Math.floor(Math.random() * 9 + 1);

	console.log(rId, rId2, i);
	if (rId != rId2) {
		console.log(rId, rId2, i);
		//console.log(document.getElementById("canvas" + rId), document.getElementById("canvas" + rId2));
		setTimeout(() => {
			move = possible_moves.findIndex((a) => a == true);
			console.log(move);
			movePlay = [];
			movePlay[0] = () => { document.getElementById("canvas9").previousElementSibling.click(); };
			movePlay[1] = () => { document.getElementById("canvas9").nextElementSibling.click(); };
			movePlay[2] = () => { document.getElementById("canvas9").nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.click(); };
			movePlay[3] = () => { document.getElementById("canvas9").nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.click(); };
			movePlay[move]();
			autoplayLoop(i + 1, r);
		}, 1000);
		//	console.log(possible_moves)
	}
}
