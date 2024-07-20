import { Transition } from "./Transition.js";
import { FiniteAutomate } from "./FiniteAutomate.js";
import { NFAGenerator } from "./NFAGenerator.js";
import { DFAGenerator } from "./DFAGenerator.js";
import { DFAMinimizer } from "./DFAMinimizer.js";
import * as go from "./node_modules/gojs/release/go-module.js";

const myDiagram =
new go.Diagram("myDiagramDiv",  // create a Diagram for the HTML Div element
  { "undoManager.isEnabled": true });  // enable undo & redo

// define a simple Node template
myDiagram.nodeTemplate =
new go.Node("Auto")  // the Shape will automatically surround the TextBlock
.add(new go.Panel("Spot")
  // add a Shape and a TextBlock to this "Auto" Panel
  .add(new go.Shape("Circle",
      { strokeWidth: 2, fill: "lightblue", stroke: "white", width: 44, height: 44})  // no border; default fill is white
      .bind("fill", "color")
      .bind("stroke", "border"))
  .add(new go.Shape("Circle",
    { strokeWidth: 2, fill: "transparent", stroke: "white", width: 48, height: 48})  // no border; default fill is white
    .bind("fill", "color"))
  .add(new go.Shape("Circle",
    { strokeWidth: 2, fill: "transparent", stroke: "white", width: 52, height: 52})  // no border; default fill is white
    .bind("fill", "color")
    .bind("stroke", "border"))
  .add(new go.TextBlock({ margin: 5, stroke: "black" })  // some room around the text
      .bind("text", "key"))  // TextBlock.text is bound to Node.data.key
); 

// Define a link template with a TextBlock to display weight
myDiagram.linkTemplate =
new go.Link({ curve: go.Link.Bezier })
.add(new go.Shape())  // the link shape
.add(new go.Shape({ toArrow: "Standard"}) ) // the arrowhead
.add(new go.TextBlock({ segmentIndex:-2, segmentFraction: 0.5, alignment: go.Spot.Bottom })
  .bind("text", "weight"));

  
function displayAutomate(automate){
    let nodes = [];
    nodes.push({ key: "", color: "white", border: "white"});
    for(let state of automate.states){
        nodes.push({ key: state });
    }
    for(let node of nodes){
        if(automate.finalStates.includes(node.key)){
            node.border = "black";
        }
    }
    let links = [];
    let trs = [];
    links.push( { from: "", to: automate.startState, weight: "" });
    for(let t of automate.transitions){
        if(trs.includes(t.toString())){
            continue;
        }
        let symbols = automate.findSymbols(t.fromState, t.toState);
        if(symbols.lenght === 1){
            links.push({ from: t.fromState, to: t.toState, weight: t.withSymbol === "" ? "ε" : t.withSymbol });
        }
        else{
            links.push({ from: t.fromState, to: t.toState, weight: symbols.toString().replace("[", "").replace("]", "") });
        }
        for(let s of symbols){
            trs.push(new Transition(t.fromState, t.toState, s).toString());
        }
    }
    myDiagram.model = new go.GraphLinksModel(nodes, links);
}

  document.getElementById("display-enfa").addEventListener("click", (e) => {
  
    e.preventDefault();
    let file = document.getElementById("e-nfa").files[0];

    file.type.includes("json") ?
    fetch(file.name)
    .then((response) => response.json())
    .then((data) => {
        let nfa_btn = document.getElementById("convert-to-nfa");
        let dfa_btn = document.getElementById("convert-to-dfa");
        let minimize_btn = document.getElementById("minimize");

        nfa_btn.disabled = true;
        dfa_btn.disabled = true;
        minimize_btn.disabled = true;

        let e_nfa = new FiniteAutomate(data.alphabet, data.states, data.transitions, data.startState, data.finalStates);
        displayAutomate(e_nfa);
        
        nfa_btn.disabled = false;
        nfa_btn.addEventListener("click", (e) => {
            e.preventDefault();

            let nfaGenerator = new NFAGenerator(e_nfa);
            nfaGenerator.generateNFA();
            let nfa = nfaGenerator.getNFA();
            displayAutomate(nfa);

            dfa_btn.disabled = false;
            dfa_btn.addEventListener("click", (e) => {
                e.preventDefault();
    
                let dfaGenerator = new DFAGenerator(nfa);
                dfaGenerator.generateDFA();
                let dfa = dfaGenerator.getDFA();
                displayAutomate(dfa);

                minimize_btn.disabled = false;
                minimize_btn.addEventListener("click", (e) => {
                    e.preventDefault();
        
                    let minimizer = new DFAMinimizer(dfa);
                    minimizer.minimize();
                    let minimized_dfa = minimizer.getDFA();
                    displayAutomate(minimized_dfa);
                });
            });
    
        });

    }) : alert("Please enter a json file as the E-NFA input!");

  });
  