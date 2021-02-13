import React from "react";

class RightBar extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        console.log(this.props.node);
        return (
            <div
                style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    height: "100vh",
                    width: "20vw",
                    backgroundColor: "#fafafa",
                }}
            >
                <div
                    style={{
                        padding: "20px",
                        fontSize: "36px",
                        fontWeight: "bold",
                        textDecoration: null,
                    }}
                >
                    <a href={"https://doi.org/" + this.props.node.id}>
                        {this.props.node.name || "No Title Found"}
                    </a>
                </div>
                <div
                    style={{
                        padding: "20px",
                        fontSize: "18px",
                    }}
                >
                    Paper abstract Lorem ipsum dolor sit amet, consectetur
                    adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                    commodo consequat. Duis aute irure dolor in reprehenderit in
                    voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.
                </div>
                <div
                    style={{
                        margin: "20px",
                    }}
                >
                    <button
                        style={{
                            backgroundColor: "lightgreen",
                            width: "100%",
                            border: "none",
                            padding: "12px",
                        }}
                        onClick={(e) =>
                            this.props.extend &&
                            this.props.extend(this.props.node)
                        }
                    >
                        Extend
                    </button>
                </div>
                <div
                    style={{
                        margin: "20px",
                    }}
                >
                    <button
                        style={{
                            backgroundColor: "pink",
                            width: "100%",
                            border: "none",
                            padding: "12px",
                        }}
                        onClick={(e) =>
                            this.props.deleteNode &&
                            this.props.deleteNode(this.props.node)
                        }
                    >
                        Delete
                    </button>
                    <button
                        style={{
                            backgroundColor: "#f2a154",
                            width: "100%",
                            border: "none",
                            padding: "12px",
                        }}
                        onClick={(e) =>
                            this.props.updateMetadata &&
                            this.props.updateMetadata()
                        }
                    >
                        Fetch Metadata
                    </button>
                </div>
            </div>
        );
    }
}

export default RightBar;
