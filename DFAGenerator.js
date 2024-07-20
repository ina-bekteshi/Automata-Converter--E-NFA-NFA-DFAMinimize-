import { FiniteAutomate } from "./FiniteAutomate.js";
import { Transition } from "./Transition.js";

/**Nje implementim minimalist i nje stive*/
class Stack {
    constructor(){
        this.data = [];
    }
    push(value){
        this.data.unshift(value);
    }
    pop(){
        return this.data.shift();
    }
    isEmpty(){
        return this.data.length === 0;
    }
}

/**
 * Nje obj DFAGenerator krijohet ne baze te nje NFA te dhene si input 
 * dhe nepermjet metodes kryesore generateDFA() behet knvertimi i NFA te vendosur ne DFA perkatese
 **/

class DFAGenerator {

    constructor(nfa){
        this.nfa = nfa;
        this.dfa = new FiniteAutomate(nfa.alphabet, [], [], nfa.startState, []);
    }

    generateDFA(){

        let stack = new Stack();

        //gjeneron gjithe states dhe transitoins te dfa
        stack.push(this.nfa.startState);
        while(!stack.isEmpty()){
            let fromState = stack.pop();
            if(!this.dfa.states.includes(fromState)){
                this.dfa.states.push(fromState);
            }
            for(let symbol of this.nfa.alphabet){
               let toState = this.nfa.findToStatesOf(fromState, symbol);
               if(toState === ""){
                   toState = "ERROR";
               }
               toState = toState.split(" ").sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())).join(" ");
               if(!this.dfa.states.includes(toState)){
                   this.dfa.states.push(toState); //shtojme gjendjen e re te formuar (ERROR ose bashkim i disa gjendjeve ekzistente)
                   stack.push(toState); // e shtojme dhe ne stack per tu shqyrtuar me vone, per te gjetur kalimet qe kjo gjendje e re do kete
               }
               this.dfa.transitions.push(new Transition(fromState, toState, symbol)); //shtojme dhe transition-in e ri te dfa
            }
        }
        //gjeneron listen e final states te dfa
        for(let state of this.dfa.states){
            for(let fs of this.nfa.finalStates){
                if(state.includes(fs)){
                    this.dfa.finalStates.push(state);
                    break;
                }
            }
        }
    }

    getDFA(){
        return this.dfa;
    }
}

export { DFAGenerator }
