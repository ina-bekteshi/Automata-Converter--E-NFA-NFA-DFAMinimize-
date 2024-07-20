
/**
 * Nje automati i fundem (qofte DFA ose NFA ose ENFA) eshte e perber nga 5 perberes:
 * alfabeti, bashkesia e gjendjeve, gjendja fillestare, bashkesia e gjendjeve fundore dhe bashkesia e kalimeve.
 **/

class FiniteAutomate{

    constructor(alphabet, states, transitions, startState, finalStates){
        this.alphabet = alphabet;
        this.states = states;
        this.transitions = transitions;
        this.startState = startState;
        this.finalStates = finalStates;
    }

     /**
     * Metode qe gjen gjendjet ku kalohet me nje simbol te caktuar nga nje gjendje e caktuar (qofte DFA ose NFA ose ENFA)
     */

    findToStatesOf(fromState, withSymbol){
        let res = "";
        let states = fromState.split(" "); 
        for(let t of this.transitions){
            for(let state of states){ 
                if(t.fromState === state && t.withSymbol === withSymbol){
                    if(!res.includes(t.toState)){//nqs eshte shtuar nje here si gjendje (per te eviduar raste te tila q0 q1 q1 q2)
                        res += t.toState + " ";
                    }
                }
            }
        }
       return res.trim(); 
    }

     /**
     * Metode qe gjen se me cfare simbolesh (mund te jene me shume se nje ne rastin e nje NFA)
     * kalohet nga nje fromState i caktuar ne nje toState te caktuar
     */

    findSymbols(fromState, toState){
        let symbols = [];
        for(let t of this.transitions){ 
            if(t.fromState === fromState && t.toState === toState){ 
                t.withSymbol === "" ? symbols.push("ε") : symbols.push(t.withSymbol); 
            }
        }
        return symbols;
    }
}

export { FiniteAutomate }