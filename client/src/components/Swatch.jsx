import "./Swatch.css";
import { Eraser, Circle, Rectangle, Line, Pencil } from "./icons_svg.jsx";

const Swatch = ({ tool, setToolType }) => {
    return (
        <div className="row">
            <div className="col-md-12">
                <div>
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
                        <Pencil fillColor="#000000" />
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
                        <Line fillColor="#000000" />
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
                        <Rectangle fillColor="#000000" />
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
                        <Circle fillColor="#000000" />
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
                </div>
            </div>
        </div>
    );
};

export default Swatch;
