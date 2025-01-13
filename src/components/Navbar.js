import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav style={{ textAlign: "center", padding: "10px", backgroundColor: "#f4f4f4" }}>
            <Link to="/" style={{ margin: "0 15px" }}>Home</Link>
            <Link to="/converter" style={{ margin: "0 15px" }}>Converter</Link>
            <Link to="/about" style={{ margin: "0 15px" }}>About</Link>
        </nav>
    );
}

export default Navbar;