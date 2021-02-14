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
                    backgroundColor: "#364f6b",
                    left: "50%",
                    width: "20",
                    marginLeft: "-10vw",
                    borderRadius: "10px 10px 0 0",
                }}
            >
                <input
                    className="doi-input"
                    placeholder="doi number"
                    onChange={this.props.onChange}
                ></input>

                <button
                    onClick={this.props.onClick}
                    className="doi-button"
                >
                    GO
                </button>
            </div>
        );
    }
}

export default DoiNumberInput;