
/**
 * Nje objekt Transition eshte i perber nga 3 informacione:
 * gjendja ku ndodhemi (fromState), simboli me te cilin po behet kalimi (withSymbol) dhe gjendja ku kalojme (toState)
 **/

class Transition{

    constructor(fromState, toState, withSymbol){
        this.fromState = fromState;
        this.toState = toState;
        this.withSymbol = withSymbol;
    }

    toString() {
        return "| From: " + this.fromState + " | To: " + this.toState + " | with: " + this.withSymbol + " | \n";
    }

}

export { Transition };