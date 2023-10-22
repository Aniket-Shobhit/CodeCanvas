import React from "react";

const Swatch = ({ setToolType }) => {
    return (
        <div>
            <div className="row">
                <div className="col-md-12">
                    <div>
                        <button
                            title="Pencil"
                            onClick={() => {
                                setToolType("pencil");
                            }}
                        >
                            Pencil
                        </button>
                        <button
                            title="Line"
                            onClick={() => {
                                setToolType("line");
                            }}
                        >
                            Line
                        </button>
                        <button
                            title="Rectangle"
                            onClick={() => {
                                setToolType("rectangle");
                            }}
                        >
                            Rectangle
                        </button>
                        <button
                            title="Circle"
                            onClick={() => {
                                setToolType("circle");
                            }}
                        >
                            Circle
                        </button>
                        <button
                            title="Eraser"
                            onClick={() => {
                                setToolType("eraser");
                            }}
                        >
                            Eraser
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Swatch;
