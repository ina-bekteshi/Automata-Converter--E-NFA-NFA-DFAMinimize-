import { FiniteAutomate } from "./FiniteAutomate.js";
import { Transition } from "./Transition.js";

/**
 * Nje obj NFAGenerator krijohet ne baze te nje E-NFA te dhene si input 
 * dhe nepermjet metodes kryesore generateNFA() behet konvertimi i NE-FA te vendosur ne NFA perkatese
 **/

class NFAGenerator {

    constructor(e_nfa){
        this.e_nfa = e_nfa;
        this.nfa = new FiniteAutomate(e_nfa.alphabet, e_nfa.states, [], e_nfa.startState, []);
    }

    generateNFA(){
        for(let state of this.e_nfa.states){
            let epsCl =  this.findEpsClosuer(state); //gjejm per cdo gjendje epsilon mbylljen e saj
            for(let symbol of this.e_nfa.alphabet){
                let result = [];
                let states = [];
                for(let e of epsCl){ //gjejm per cdo gjendje te epsilon mbylljes gjendjet ku kalohet me cdo simbol
                    states = states.concat(this.e_nfa.findToStatesOf(e, symbol).split(" "));
                }
                for(let s of states){ //dhe per secilen nga kto gjendje te gjetura gjejme epsilon mbylljen e tyre
                    result = result.concat(this.findEpsClosuer(s));
                }
                let set = new Set();
                for(let res of result){
                    set.add(res);
                }
                for(let toState of set){
                    if(toState){ //jo falsey (undefined null or empty)
                        this.nfa.transitions.push(new Transition(state, toState, symbol));//krijojme transitions e rinj te nfa 
                    }
                }
            }
        }
        //final states per nfa do jene te gjitha ato gjendje qe pjese te epsClouser te tyre kane gjendje fundore te e-nfa
        for(let state of this.nfa.states){
            let epsCl = this.findEpsClosuer(state);
            for(let fState of this.e_nfa.finalStates){
                if(epsCl.includes(fState)){
                    this.nfa.finalStates.push(state);
                    break;
                }
            }
        }
    }

    findEpsClosuer(state){
        let  e = [];
        e.push(state); // shtojm vet gjendjen qe arrihet gjithmon me epsilon
        let states = [];

        states = states.concat(this.e_nfa.findToStatesOf(state, "").split(" ")); //ruajm gjendjet qe arrihen me epsilon (kalimet me 1 epsilon)
        states = states.filter(ele => ele !== "");
        while(states.length > 0){
            let tmp = [];
            for(let s of states){
                e.push(s);
                tmp = tmp.concat(this.e_nfa.findToStatesOf(s, "").split(" ").toString()); //nga kto gjendje te te cilat kaluam me epsilon gjejme gjendjet qe arrihen perseri me epsilon (kalimet me 2 ose me shume epsilona rresht) 
            }
            states = tmp;
            states = states.filter(ele => ele !== "");
        }
        return e;
    }

    getNFA(){
        return this.nfa;
    }

}

export { NFAGenerator}
