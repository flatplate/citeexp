import React from "react";
import Graph from "vis-react";
import RightBar from "./components/RightBar";
import DoiNumberInput from "./components/DoiNumberInput";
import { doiMetadata } from "./services/CrossRefAPI";
import {
    getOutgoingCitations,
    getIncomingCitations,
} from "./services/OpenCitationsAPI";
import { ContextMenu, ContextMenuElement } from "./components/ContextMenu";
import './App.css'




class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            citations: [],
            publications: {},
            graph: { nodes: [], edges: [] },
            dois: {},
            selectedNode: null,
            currentInputDoi: "",
            network: null,
            contextData: null
        };

        this.addCitation = this.addCitation.bind(this);
        this.extendCitationsOut = this.extendCitationsOut.bind(this);
        this.reconstructGraph = this.reconstructGraph.bind(this);
        this.updateMetadata = this.updateMetadata.bind(this);
        this.updateAllMetadata = this.updateAllMetadata.bind(this);
        this.updateMetadata = this.updateMetadata.bind(this);
        this.extendCitationsOut = this.extendCitationsOut.bind(this);
        this.extendCitationsIn = this.extendCitationsIn.bind(this);
        this.deleteNode = this.deleteNode.bind(this);
    }

    addCitation(newCitation) {
        for (let i = 0; i < this.state.citations.length; i++)
            if (this.state.citations[i].citing === newCitation.citing
                && this.state.citations[i].cited === newCitation.cited)
                return;


        this.state.citations.push(newCitation);
        this.addDoi(newCitation.citing);
        this.addDoi(newCitation.cited);
        this.setState({}, this.reconstructGraph);
    }

    addDoi(doi) {
        if (this.state.publications[doi]) {
            console.log("Doi is already in the list of current dois");
            return; // TODO alert / message service to say, this doi is already in the list, title is ...
        }
        console.log(doi);
        this.updateMetadata(doi)
        // this.setState({ publications: { ...this.state.publications, [doi]: { id: doi } } }, this.reconstructGraph);
    }

    deleteNodeFromCitations(nodeId) {
        let newCitations = this.state.citations.filter(
            (citation) => citation.citing !== nodeId && citation.cited !== nodeId
        );
        this.setState({ citations: newCitations });
    }

    getTitleFromMetadata(metadata) {
        if (!metadata || !metadata.title || metadata.title.length < 1) {
            return null;
        }
        const title = metadata.title.join(" ");
        return this.breakTextIntoLines(title, 25);
    }

    breakTextIntoLines(text, maxLength) {
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

    reconstructGraph() {
        let allDois = [];
        this.state.citations.forEach((element) => {
            allDois.push(element.citing);
            allDois.push(element.cited);
        });
        for (const key of Object.keys(this.state.publications)) {
            allDois.push(key);
        }
        let uniqueDois = allDois.filter(
            (item, i, ar) => ar.indexOf(item) === i
        );
        let nodes = uniqueDois.map((d, i) => {
            return {
                id: d,
                label: this.getTitleFromMetadata(this.state.publications[d]) || d,
                name: this.getTitleFromMetadata(this.state.publications[d]) || null,
                font: {
                    // background: "rgba(54, 79, 107, 0.1)",
                    strokeWidth: 2,
                    size: 18,
                },
                metadata: this.state.publications[d],
            };
        });
        let edges = this.state.citations.map((element, i) => {
            return {
                from: element.citing,
                to: element.cited,
            };
        });
        let g = {
            nodes: nodes,
            edges: edges,
            rand: Math.random().toString(),
        };
        this.setState({ graph: g });
    }

    extendCitationsOut(doi) {
        getOutgoingCitations(doi)
            .then((citations) => citations.forEach(this.addCitation))
            .catch((error) => {
                console.error("Error extending citations out " + error);
            });

        if (!this.state.publications[doi] || !this.state.publications[doi].reference)
            return;

        this.state.publications[doi].reference.forEach(obj => {
            obj.DOI && this.addCitation({ citing: doi, cited: obj.DOI });
        })
    }

    extendCitationsIn(doi) {
        getIncomingCitations(doi)
            .then((citations) => citations.forEach(this.addCitation))
            .catch((error) => {
                console.error("Error extending citations in " + error);
            });
    }

    updateMetadata(doi) {
        if (this.state.publications[doi] && this.state.publications[doi].metadata) {
            return;
        }
        doiMetadata(doi)
            .then((metadata) => {
                this.setState({
                    publications: { ...this.state.publications, [doi]: metadata }
                }, this.reconstructGraph)
            })
            .catch((error) => {
                console.error("Error fetching metadata for doi " + doi + " " + error);
                this.setState({ publications: { ...this.state.publications, [doi]: {} } })
            })
    }

    updateAllMetadata() {
        for (let node of this.state.graph.nodes) {
            this.updateMetadata(node.id);
        }
    }

    deleteNode(nodeId) {
        this.deleteNodeFromCitations(nodeId);
        let newPublications = { ...this.state.publications };
        delete newPublications[nodeId];
        this.setState({ publications: newPublications }, this.reconstructGraph);
    }

    getSelectedNode() {
        if (this.state.selectedNode === null) {
            return {};
        }
        return {
            ...this.state.publications[this.state.selectedNode],
            id: this.state.selectedNode
        }
    }

    render() {
        var options = {
            layout: {
                hierarchical: {
                    direction: "UD",
                    sortMethod: "hubsize",
                    levelSeparation: 200,
                    nodeSpacing: 250,
                },
            },
            interaction: { dragNodes: true },
            physics: {
                enabled: false,
            },
            edges: {
                color: "#364f6b",
            },
            nodes: {
                shape: "dot",
                color: "#fc5185"
            },
        };

        var events = {
            click: (event) => {
                var { nodes } = event;
                console.log(nodes);
                if (nodes.length > 0) {
                    this.setState({ selectedNode: nodes[0] })
                } else {
                    this.setState({ selectedNode: null });
                }
            },
            oncontext: (event) => {
                let { nodes, pointer } = event;
                console.log(event)
                if (nodes && nodes.length > 0) {
                    this.setState({
                        contextData: {
                            nodes: nodes,
                            pointer: pointer.DOM
                        }
                    });
                }
            }
        };
        return (
            <div className="App" onContextMenu={(e) => e.preventDefault()} onClick={(e) => { this.setState({ contextData: null }) }}>
                <Graph
                    graph={this.state.graph}
                    options={options}
                    events={events}
                    style={{ height: "100vh" }}
                    getNetwork={(network) => this.setState({ network: network })}
                    key={this.state.graph.rand}
                />
                {this.state.selectedNode && (
                    <RightBar
                        node={this.getSelectedNode()}
                        deleteNode={this.deleteNode}
                        updateMetadata={this.updateAllMetadata}
                        extend={this.extendCitationsOut}
                    />
                )}

                {this.state.contextData && (
                    <ContextMenu x={this.state.contextData.pointer.x} y={this.state.contextData.pointer.y}>
                        <ContextMenuElement onClick={() => this.extendCitationsOut(this.state.contextData.nodes[0])}>Extend outgoing</ContextMenuElement>
                        <ContextMenuElement onClick={() => this.extendCitationsIn(this.state.contextData.nodes[0])}>Extend incoming</ContextMenuElement>
                        <ContextMenuElement onClick={() => this.deleteNode(this.state.contextData.nodes[0])}>Delete</ContextMenuElement>
                    </ContextMenu>
                )}
                <DoiNumberInput
                    onChange={(e) => {
                        this.setState({ currentInputDoi: e.target.value });
                    }}
                    onClick={(e) => {
                        this.addDoi(this.state.currentInputDoi);
                    }}
                />
            </div>
        );
    }
}

export default App;