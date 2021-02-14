import React from "react";

class RightBar extends React.Component {
    getAuthorString(authorData) {
        if (!authorData || authorData.length === 0) return "No authors found";
        if (authorData.length === 1) return authorData[0].family;
        if (authorData.length === 2) return authorData[0].family + " and " + authorData[1].family;
        else return authorData[0].family + " et. al";
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
                    backgroundColor: "#364f6b",
                    color: "white",
                    overflowY: "scroll",
                    overflowX: "hidden",
                }}
            >
                <div
                    style={{
                        padding: "20px",
                        fontSize: "24px",
                        fontWeight: "bold",
                        textDecoration: null,
                    }}
                >
                    <a href={"https://doi.org/" + this.props.node.id} style={{ textDecoration: "none", color: "white" }}>
                        {this.props.node.title || "No Title Found"}
                    </a>
                </div>
                <div
                    style={{
                        padding: "0",
                        paddingLeft: "20px",
                        fontSize: "16px",
                        fontWeight: "light",
                    }}
                >
                   {this.getAuthorString(this.props.node.author)}   
                </div>
                <hr style={{margin: "20px", border: "none", borderTop: "1px solid #677687", }}></hr>
                <div
                    style={{
                        padding: "20px",
                        fontSize: "14px",
                        paddingTop: "0"
                    }}
                >
                    {this.props.node.abstract || "No abstract found"}
                </div>
            </div>
        );
    }
}

export default RightBar;
