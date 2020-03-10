function TreeNode(val) {
    this.alhpa = -Infinity
    this.beta = Infinity
    this.child = []
    this.val = val;
}



var str = '((((3 17)(2 12))((15)(25 0)))(((2 5)(3))((2 14))))'
// var str = '((3 17)(14 5))'
var stack = []
var start = 0
function generateTree(){
    while(str[start] == " ") start ++
    let num = parseInt(str.substr(start))
    if(!isNaN(num)){
        return new TreeNode(num)
    }
    let root = new TreeNode()
    let i = 0
    if(str[start] == '(') stack.push('(')
    while(stack.length){
        let tempNum = parseInt(str.substr(start))
        if(!isNaN(tempNum)) start += tempNum.toString().length
        else start ++
        if(str[start] == ')'){
            stack.pop()
            break
        } 
        root.child[i ++] = generateTree()
    }
    return root
}
function minimax(node, isMaximizingPlayer, alpha, beta, depth){
    if(node.child.length == 0) return node.val

    if(isMaximizingPlayer){
        let bestVal = -Infinity
        for(let i = 0; i < node.child.length; i ++){
            let val = minimax(node.child[i], false, alpha, beta, depth + 1)
            bestVal = Math.max(bestVal, val)
            alpha = Math.max(alpha, bestVal)
            if(beta <= alpha){
                break;
            }
        }
        return bestVal
    }
    if(!isMaximizingPlayer){
        let bestVal = Infinity
        for(let i = 0; i < node.child.length; i ++){
            let val = minimax(node.child[i], true, alpha, beta, depth + 1)
            bestVal = Math.min(bestVal, val)
            alpha = Math.min(alpha, bestVal)
            if(beta <= alpha){
                break;
            }
        }
        return bestVal
    }

}
var roots = generateTree()
let vals = minimax(roots, true, -Infinity, Infinity, 1)
console.log(roots)