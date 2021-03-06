import React from 'react';

class ContextMenu extends React.Component {
    render() {
        return (
            <div className="context-menu" style={{ top: this.props.y, left: this.props.x }}>
                <ul>
                    {this.props.children}
                </ul>
            </div>
        )
    }
}

class ContextMenuElement extends React.Component {
    render() {
        return (
            <li onClick={this.props.onClick}>
                {this.props.children}
            </li>
        )
    }
}

export { ContextMenu, ContextMenuElement };