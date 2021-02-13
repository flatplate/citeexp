import logo from "./logo.svg";
import "./App.css";
import { Sigma, RelativeSize, RandomizeNodePositions } from "react-sigma";
import { useState } from "react";
import Graph from "react-d3-graph";
import { DataSet } from "vis-data";
import RightBar from "./components/RightBar";
import DoiNumberInput from "./components/DoiNumberInput";
import { doiMetadata } from "./services/CrossRefAPI";

function App() {
    let [graph, setGraph] = useState({ nodes: [], edges: [] });
    let [currentDoi, setCurrentDoi] = useState("");
    let [selectedNode, setSelectedNode] = useState({});
    let [network, setNetwork] = useState();
    let [nodeData, setNodeData] = useState({});

    let deleteNode = (id) => {
        let newGraph = {
            nodes: graph.nodes.filter((n) => n.id != id),
            edges: graph.edges.filter((e) => e.from.id != id && e.to.id != id),
            rand: Math.random().toString(),
        };
        updateNodeData(graph);
        network.setData(newGraph);
        setGraph(newGraph);
    };

    let updateNodeData = (graph) => {
        let newNodeData = {};
        graph.nodes.forEach((node) => {
            newNodeData[node.id] = node;
        });
        setNodeData(newNodeData);
    };

    let getNodeWithName = (node) => {
        return new Promise((resolve, reject) => {
            if (node.name) {
                console.log("resolving doi " + node.id);
                resolve(node);
            }
            doiMetadata(node.id)
                .then((metadata) => {
                    if (metadata.title[0]) {
                        console.log("resolving doi " + node.id);
                        resolve({
                            ...node,
                            name: metadata.title[0],
                            label: breakTextIntoLines(metadata.title[0], 40),
                            abstract: metadata.abstract || "",
                        });
                    }
                    console.log("resolving doi outside " + node.id);
                    resolve(node);
                })
                .catch((err) => {
                    console.error(
                        "Error when trying to fetch metadata for doi " +
                            node.id +
                            " Error: " +
                            err
                    );
                    console.log("resolving doi " + node.id);
                    resolve(node);
                });
        });
    };

    let updateNodesWithMetadata = () => {
        Promise.all(graph.nodes.map(getNodeWithName)).then((nodes) => {
            let newGraph = {
                ...graph,
                nodes: nodes,
            };
            updateNodeData(newGraph);
            network.setData(newGraph);
            console.log(newGraph);
            setGraph(newGraph);
        });
    };

    let breakTextIntoLines = (text, maxLength) => {
        let words = text.split(" ");
        let lines = [];
        let currentLength = 0;
        let currentLine = [];
        for (let i = 0; i < words.length; i++) {
            if (currentLength + words[i].length > maxLength) {
                lines.push(currentLine.join(" "));
                currentLine = [];
                currentLength = 0;
            }
            currentLine.push(words[i]);
            currentLength += words[i].length;
        }
        if (currentLine.length > 0) {
            lines.push(currentLine.join(" "));
            currentLine = [];
            currentLength = 0;
        }
        return lines.join("\n");
    };

    let getDoiStuff = (doi_number) => {
        console.log("/citing/" + encodeURIComponent(doi_number));
        fetch("/citing/" + doi_number)
            .then((res) => res.json())
            .then((data) => {
                console.log("asdf");
                console.log(data);
                let all_dois = [];
                data.citations.forEach((element) => {
                    all_dois.push(element.citing.doi);
                    all_dois.push(element.cited.doi);
                });

                let unique_dois = all_dois.filter(
                    (item, i, ar) => ar.indexOf(item) === i
                );
                let nodes = unique_dois.map((d, i) => {
                    return { id: d, label: d, name: null };
                });
                let edges = data.citations.map((element, i) => {
                    return {
                        from: element.citing.doi,
                        to: element.cited.doi,
                    };
                });
                console.log("xcv");
                console.log({ nodes: nodes, edges: edges });
                console.log(graph);
                let g = {
                    nodes: nodes,
                    edges: edges,
                    rand: Math.random().toString(),
                };
                updateNodeData(g);
                setGraph(g);
                network.setData(g);
                console.log(JSON.stringify(graph));
            });
    };

    var options = {
        layout: {
            hierarchical: {
                direction: "RL",
                sortMethod: "directed",
                levelSeparation: 500,
                nodeSpacing: 200,
            },
        },
        interaction: { dragNodes: false },
        physics: {
            enabled: false,
        },
        edges: {
            color: "#000000",
        },
        nodes: {
            shape: "dot",
        },
    };

    var events = {
        select: function (event) {
            var { nodes, edges } = event;
        },
        selectNode: (event) => {
            var { nodes } = event;
            if (nodes.length > 0) {
                console.log(nodes[0]);
                console.log(nodeData);
                setSelectedNode(nodeData[nodes[0]]);
            }
        },
    };

    const myConfig = {
        nodeHighlightBehavior: true,
        node: {
            color: "lightgreen",
            size: 120,
            highlightStrokeColor: "blue",
        },
        link: {
            highlightColor: "lightblue",
        },
    };

    return (
        <div className="App">
            <Graph
                id="graph-id" // id is mandatory
                data={data}
                config={myConfig}
                onClickNode={onClickNode}
                onClickLink={onClickLink}
            />
            <Graph
                graph={{ nodes: [], edges: [] }}
                options={options}
                events={events}
                getNetwork={setNetwork}
            />
            <RightBar
                node={selectedNode}
                deleteNode={deleteNode}
                updateMetadata={updateNodesWithMetadata}
            />
            <DoiNumberInput
                onChange={(e) => {
                    setCurrentDoi(e.target.value);
                }}
                onClick={(e) => {
                    getDoiStuff(currentDoi);
                }}
            />
        </div>
    );
}

export default App;
