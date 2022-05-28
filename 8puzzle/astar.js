
class aStarNode{
    constructor(){
        this.configuration = [], this.fStar, this.gStar, this.hStar, this.next, this.parent;
    }
    printNode(){
        let tmpStr = '';
        for(let i=0;i<9;i++){
            if( (i) % 3 == 0) tmpStr += '\n';
            tmpStr += this.configuration[i]+' ';
        }

        console.log(tmpStr, "::", this.fStar, this.gStar, this.hStar);
    }
}
class aStar{
    constructor(){
        this.startNode = new aStarNode;
        this.goalNode = new aStarNode;
        
        this.open = new aStarNode;
        this.open.gStar = this.open.fStar = "dummy";
        
        this.close = new aStarNode;
        this.close.gStar = this.close.fStar = "dummy";
    }

    //methods
    computeGStar(node){
        return node.parent.gStar + 1;
    }
    computeHStar(node){
        let hstar = 0;
        for (let i = 1; i < 9; ++i)
        {
            hstar += findDis(node.configuration.indexOf(i), this.goalNode.configuration.indexOf(i));
           /*hstar1(easier here)
                if(node.configuration[i] != this.goalNode.configuration[i]){
                        hstar++;
                }
            */
        }
        // console.log();
        return hstar;
    }
    isGoalNode(node){
        return node.configuration+this.goalNode.configuration === this.goalNode.configuration+node.configuration; 
    }
    openInsert(node){
        // p("received in openInsert: ", node, "------  ")
        let dNode = this.open;
        while(dNode.next != null && dNode.next.fStar < node.fStar){
            dNode = dNode.next;
        }
        node.next = dNode.next;
        dNode.next = node;
    }
    closeInsert(node){
        let dNode = this.close;
        while(dNode.next != null/* && dNode.next.fStar < node.fStar*/){
            dNode = dNode.next;
        }
        node.next = dNode.next;
        dNode.next = node;
    }
    remove(list){
        let temp = list.next;
        list.next = list.next.next;
        return temp;
    }
    match(c1, c2){
        // console.log("comparing",c1,c2,"\n",c1+c2 === c2+c1)
        return (c1+c2 === c2+c1) && c1.length != 0 && c2.length != 0;
    }
    checkAncestors(currNode){
        // let temp = currNode.parent;
        // let matchFlag = false;
        // while(temp != null){
        //  if(this.match(currNode.configuration, temp.configuration)){
        //      matchFlag = true;
        //      break;
        //  }else{
        //      matchFlag = false;
        //  }
        //  temp = temp.parent;
        // }
        // return (matchFlag == true);

        let temp = this.close;
        let tempo = this.open;
        while (temp != null){
            if(this.match(temp.configuration, currNode.configuration)){ 
                return true;
            }
            temp = temp.next;
        }
        while(tempo != null){
            if(this.match(tempo.configuration, currNode.configuration)){
                return true;
            }
            tempo = tempo.next;
        }
        return false;
    }
    findZero(config){
        for (let i = 0; i < 9; ++i)
            if(config[i] == 0) return i;
        return 9999;
    }
    childInsert(node, childList){
        // p("received in openInsert: ", node, "------  ")
        let dNode = childList;
        while(dNode.next != null /*&& dNode.next.fStar < node.fStar*/){
            dNode = dNode.next;
        }
        node.next = dNode.next;
        dNode.next = node;
    }
    printList(head){
        let head1 = head;
        while(head1 != null){
            head1.printNode();
            // console.log();
            head1 = head1.next;
        }
        // p("end of prinList ----- ");
    }
    reverse(node){
        let revArr = [];

        let temp = node;
        while(temp != null){
            // console.log("inserting", temp.configuration.toString());
            revArr.push(temp.configuration);
            temp = temp.parent;
        }
        return revArr.reverse();
    }
    constructChildList(c){
        // p(c);
        let zeroPos = this.findZero(c.configuration); // 1
        let oneInx;
        let childList = new aStarNode;
        childList.fStar = 999;

        let table = createTable(c.configuration);
        for(let i=0;i<9;i++){
            if(table[0][i] == 1){ //  
                // p(i);
                oneInx = i;
                let newNode = new aStarNode;
                // p(newNode, c);
                for(let j=0;j<9;j++){ //copy the current parent
                    newNode.configuration[j] = c.configuration[j];
                }
                let tmp = newNode.configuration[newNode.configuration.indexOf(oneInx)] 
                newNode.configuration[newNode.configuration.indexOf(oneInx)] = newNode.configuration[zeroPos];
                newNode.configuration[zeroPos] = tmp;
                newNode.parent = c;

                //checkAncestor - true if newNode matches any ancestors
                if(!this.checkAncestors(newNode)){
                    newNode.gStar = as.computeGStar(newNode);
                    newNode.hStar = as.computeHStar(newNode);
                    newNode.fStar = newNode.gStar + newNode.hStar;
                    this.childInsert(newNode, childList);
                }
            }
        }
        // p(childList, " childNode");
    return childList;
    }
}

function p(...b){
    let a = [...b];
    console.log("\n----------------------------------");
    a.forEach(x => console.log(x));
    console.log("----------------------------------");
}
function findDis(i,j){
    // could use manhattan distance with a nested for loop method here. i chose something else O(N^2) although doesn't matter anyways
    
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
function createTable(sc){
    let table = [999, 999,999,999,999, 999, 999,999,999];
    for(i=0;i<9;i++){
        table[sc[i]] = [999, 999, 999, 999, 999,999, 999, 999];
        for(j=0;j<9;j++){
            let d = findDis(i, j);
            table[sc[i]][sc[j]] = d;
        }
    }
    return table;
}

function solver(srcNodeConfig){
sc = srcNodeConfig;
as = new aStar;
as.startNode.configuration =  sc;
as.goalNode.configuration  =  gc;

as.startNode.gStar = 0;
as.startNode.hStar = as.computeHStar(as.startNode);
as.startNode.fStar = as.startNode.gStar + as.startNode.hStar;
as.openInsert(as.startNode);

let currNode = as.startNode;
let pathNode;
let iterationsLimit = 1500;
for(let i=0;i<iterationsLimit;i++){
    currNode = as.remove(as.open);
    if(currNode != null && as.isGoalNode(currNode)){
        as.closeInsert(currNode);
        pathNode = currNode;
        // animate(currNode);
        console.log("goal found");
        break;
    }
    let childList = as.constructChildList(currNode);

    while(childList.next != null){
        let child = as.remove(childList);
        child.gStar = as.computeGStar(child);
        child.hStar = as.computeHStar(child);
        child.fStar = child.gStar + child.hStar;
        child.parent = currNode;
        as.openInsert(child);
    }
    as.closeInsert(currNode);
}
// animate(as.close);
console.log(pathNode);
if(pathNode === undefined){
    console.clear();
    console.log("no solution found");
    return null;
}

//reset close LL to store the path to final node
as.close = new aStarNode;
as.close.gStar = as.close.fStar = "dummy";

let revArr = as.reverse(pathNode);
if(revArr.length == 1) return revArr;

//last node is ignored for some reason.. putting it here hardcoded
let tmp = new aStarNode;
tmp.configuration = gc;

revArr.forEach(x => {
    let tmp = new aStarNode;
    tmp.configuration = x;
    as.closeInsert(tmp);
});

// animate(as.close); // uncomment if you want to see solution "animating" in JS console.
console.log( "final returning array",revArr);
return revArr;
}


function animate(lh, i = 0){
    if(lh.next == null) return "finished";
    console.clear();
    console.log("\n");
    lh.printNode();
    console.log("enumeration#",i++);
    lh = lh.next;
    setTimeout(() => animate(lh, i), 1000);
}

//solver([state]);
