class DFAMinimizer {

    constructor(dfa){
         this.dfa = dfa;
         this.combinations = [];
         for(let i = 0; i < this.dfa.states.length; i++){ // cdo index i , j perfaqeson indexin qe ka nje state ne arraylisten e states te dfa, pra neper i, j perfaqesojm state te caktuara
            this.combinations[i] = []; 
            for(let j = 0; j < this.dfa.states.length; j++){
                 if(i != j){
                    this.combinations[i][j] = false;
                 }
             }
         }
    }

    firstMark(){ //markojm kombinimet (q, q') ku q eshte final state dhe q' jo ose anasjelltas ( pra njera patjeter te jete nje final state (jo te dyja))
        for(let i = 0; i < this.combinations.length; i++){
            for(let j = i + 1; j < this.combinations[i].length; j++){
                if(this.dfa.finalStates.includes(this.dfa.states[i]) && !this.dfa.finalStates.includes(this.dfa.states[j]) || !this.dfa.finalStates.includes(this.dfa.states[i]) && this.dfa.finalStates.includes(this.dfa.states[j])){
                    this.combinations[i][j] = this.combinations[j][i] = true;
                }
            }
        }
    }

    secondMark(){ // markojm gjithashtu state te cilat me kalime/transitions mund te shkojn ne nje kombinim te markuar deri sa mos ket me markime te mundshme
        let flag = false;
        for(let i = 0; i < this.combinations.length; i++){
            for(let j = i + 1; j < this.combinations[i].length; j++){
                if(this.combinations[i][j] == false){
                    for(let symbol of this.dfa.alphabet){
                        let part_i = this.dfa.findToStatesOf(this.dfa.states[i], symbol);
                        part_i === "" ? part_i = "ERROR" : undefined; 
                        let part_j = this.dfa.findToStatesOf(this.dfa.states[j], symbol);
                        part_j === "" ? part_j = "ERROR" : undefined; 
                        if(this.isMarked(this.dfa.states.indexOf(part_i), this.dfa.states.indexOf(part_j))){
                            this.combinations[i][j] = this.combinations[j][i]  = true;
                            flag = true;
                            break;
                        }
                    }
                }
            }
        }
        return flag;
    }

    isMarked(i, j){
        return this.combinations[i][j] === true;
    }

    getUnmarkedStates(){
        let set = new Set();
        for(let i = 0; i < this.combinations.length; i++){
            for(let j = i + 1; j < this.combinations[i].length; j++){
               if(!this.isMarked(i, j)){
                   set.add(this.dfa.states[i]);
                   set.add(this.dfa.states[j]);
               }
            }
        }
        return set;
    }

    minimize(){
        //sjane marre parasyh gjendjet e paarritshme sps alg i gjenerimit te dfa na siguron qe sdo kemi gjendje te tilla
        this.firstMark(); 

        while(this.secondMark()); 

        let set = this.getUnmarkedStates(); // marrim ato state qe su markuan dot (keto do bashkohen bashke ne nje state te vetem)

        if(set.length < this.dfa.states.length){ // nqs kan te njeten length ska nevoj per minimizim sps asnje state su markua pra dfa momentale eshte ajo me minimalja

            let newState = set.toString().replace("[", "").replace("]", "").replaceAll(",", "");
            this.dfa.states.push(newState); // shtojme state e ri (bashkimi i ter stateve te pa markuar)

            for(let symbol of this.dfa.alphabet){ //krijojm transitions per newState
                this.dfa.transitions.push(new Transition(newState,  this.dfa.findToStatesOf(newState, symbol), symbol));
            }

            this.dfa.states = this.dfa.states.filter(state => !set.includes(state)); // heqim statet qe bejn pjes te unmarked sps sdo ekzistojn me me vete

            if(this.dfa.finalStates.length !== (this.dfa.finalStates = this.dfa.finalStates.filter(state => !set.includes(state))).length){ // heqim statet qe bejn pjes te unmarked nga finalStates nqs marrin pjese
                this.dfa.finalStates.push(newState); // shtojm newState si finalState
            }

            if(set.includes(this.dfa.startState)){ // nqs nje nga state qe hoqem ishte startState ath ndryshojme dhe startState qe te jete newState
                this.dfa.startState = newState;
            }

            this.dfa.transitions = this.dfa.transitions.filter(t => !set.includes(t.fromState)); // heqim transition qe nisin nga statet qe hoqem me larte

            dfa.transitions.forEach(t => { // nderrojme toState (e bejme newState) per transitions qe si toState kishin njeren nga state qe fshim
                if(set.includes(t.toState)){
                    t.toState = newState;
                }
            });
        }

    }

    getDFA() {
        return this.dfa;
    }
}

export { DFAMinimizer }