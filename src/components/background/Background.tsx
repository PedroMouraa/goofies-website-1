import React, { useState } from "react";
import "./Background.css";

function Background() {

    return (
        <div className="absolute">
            <div className="absolute inset-0 justify-center">
                <div className="bg-shape1 bg-blue opacity-50 bg-blur"></div>
                <div className="bg-shape2 bg-green opacity-50 bg-blur"></div>
                <div className="bg-shape3 bg-orange opacity-50 bg-blur"></div>
                <div className="bg-shape4 bg-yellow opacity-50 bg-blur"></div>
                <div className="bg-shape5 bg-pink opacity-50 bg-blur"></div>
            </div>
        </div>
    );
}

export default Background;
