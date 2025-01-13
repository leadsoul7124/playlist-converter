import React from "react";
import { Link } from "react-router-dom";

function Home() {
    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Welcome to Playlist Converter!</h1>
            <p>Select a page to navigate:</p>
            <div style={{ marginTop: "20px" }}>
                <Link to="/converter" style={{ margin: "10px", textDecoration: "none", color: "blue" }}>
                    Go to Converter
                </Link>
                <br />
                <Link to="/about" style={{ margin: "10px", textDecoration: "none", color: "blue" }}>
                    Learn About Us
                </Link>
            </div>
        </div>
    );
}

export default Home;