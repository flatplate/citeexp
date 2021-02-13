import React from "react";

class DoiNumberInput extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div
                style={{
                    position: "fixed",
                    bottom: 0,
                    padding: "20px",
                    backgroundColor: "gray",
                    left: "50%",
                    width: "10vw",
                    marginLeft: "-5vw"
                }}
            >
                <input
                    placeholder="doi number"
                    onChange={this.props.onChange}
                ></input>
                <button
                    onClick={this.props.onClick}
                >
                    GO
                </button>
            </div>
        );
    }
}

export default DoiNumberInput;