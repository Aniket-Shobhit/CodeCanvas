import React, { useState } from "react";
import "./Swatch.css";
import {
    Eraser,
    Circle,
    Rectangle,
    Line,
    Pencil,
    ClearIcon,
} from "./icons_svg.jsx";

const Swatch = ({
    tool,
    setToolType,
    lineWidth,
    setLineWidth,
    color,
    setColor,
    clearBoard,
}) => {
    const handleColorChange = (e) => {
        setColor(e.target.value);
    };

    const handleWidthIncrease = () => {
        setLineWidth((prevWidth) => Math.min(30, prevWidth + 3));
    };

    const handleWidthDecrease = () => {
        setLineWidth((prevWidth) => Math.max(1, prevWidth - 3));
    };

    return (
        <div className="row">
            <div className="col-md-12">
                <button
                    title="Pencil"
                    onClick={() => {
                        setToolType("pencil");
                    }}
                    style={{
                        backgroundColor:
                            tool === "pencil" ? "grey" : "transparent",
                    }}
                >
                    <Pencil fillColor={color} />
                </button>
                <button
                    title="Line"
                    onClick={() => {
                        setToolType("line");
                    }}
                    style={{
                        backgroundColor:
                            tool === "line" ? "grey" : "transparent",
                    }}
                >
                    <Line fillColor={color} />
                </button>
                <button
                    title="Rectangle"
                    onClick={() => {
                        setToolType("rectangle");
                    }}
                    style={{
                        backgroundColor:
                            tool === "rectangle" ? "grey" : "transparent",
                    }}
                >
                    <Rectangle fillColor={color} />
                </button>
                <button
                    title="Circle"
                    onClick={() => {
                        setToolType("circle");
                    }}
                    style={{
                        backgroundColor:
                            tool === "circle" ? "grey" : "transparent",
                    }}
                >
                    <Circle fillColor={color} />
                </button>
                <button
                    title="Eraser"
                    onClick={() => {
                        setToolType("eraser");
                    }}
                    style={{
                        backgroundColor:
                            tool === "eraser" ? "grey" : "transparent",
                    }}
                >
                    <Eraser />
                </button>
                <input
                    type="color"
                    value={color}
                    onChange={handleColorChange}
                    title="Color Picker"
                />
                <button
                    title="Increase Width"
                    onClick={handleWidthIncrease}
                    className="add"
                >
                    +
                </button>
                <button
                    title="Decrease Width"
                    onClick={handleWidthDecrease}
                    className="subtract"
                >
                    -
                </button>
                <button
                    title="Clear Board"
                    onClick={clearBoard}
                    className="clear-board"
                >
                    <ClearIcon />
                </button>
            </div>
        </div>
    );
};

export default Swatch;
