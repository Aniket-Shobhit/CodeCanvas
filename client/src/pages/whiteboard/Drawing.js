import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swatch from "../../components/Swatch";
import rough from "roughjs/bundled/rough.esm";
import previous from "../../previous.svg";
import "./Drawing.css";

const gen = rough.generator();

const createElement = (id, x1, y1, x2, y2, type, width, color) => {
    let roughEle = null;
    if (type === "rectangle") {
        roughEle = gen.rectangle(x1, y1, x2 - x1, y2 - y1, {
            fillStyle: "hollow",
            strokeWidth: width,
            stroke: color,
        });
    } else if (type === "circle") {
        const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        const centerX = (x1 + x2) / 2;
        const centerY = (y1 + y2) / 2;
        roughEle = gen.circle(centerX, centerY, radius, {
            fillStyle: "hollow",
            strokeWidth: width,
            stroke: color,
        });
    } else {
        roughEle = gen.line(x1, y1, x2, y2, {
            stroke: color,
            strokeWidth: width,
        });
    }
    return { id, x1, y1, x2, y2, type, roughEle, color, strokeWidth: width };
};

const calculateControlPoint = (p1, p2) => {
    const distance = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
    const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    const controlDistance = distance * 0.3; // Adjust as needed

    return {
        x: p1.x + controlDistance * Math.cos(angle),
        y: p1.y + controlDistance * Math.sin(angle),
    };
};

const Drawing = () => {
    const history = useNavigate();
    const [elements, setElements] = useState([]); //stores all the shapes for main canvas
    const [tempElement, setTempElement] = useState([]); //stores the temporary shape currently being drawn
    const [isDrawing, setIsDrawing] = useState(false);
    const [isErasing, setIsErasing] = useState(false);
    const [lineWidth, setLineWidth] = useState(5);
    const [color, setColor] = useState("#000000");

    const [freestyle, setFreestyle] = useState(null); //stores the current drawing freestyle paths
    const [path, setPath] = useState([]); //stores all the freestyle paths

    const [action, setAction] = useState("none");
    const [toolType, setToolType] = useState("pencil");

    // console.log("Re-rendering Drawing.js", freestyle?.coords?.length);
    useEffect(() => {
        console.log("useEffect called");
        const canvas = document.getElementById("canvas");
        const context = canvas.getContext("2d");
        context.lineCap = "round";
        context.lineJoin = "round";

        context.save();

        const drawpath = () => {
            path.forEach((stroke, index) => {
                context.beginPath();

                const color = stroke.color;
                const lineWidth = stroke.lineWidth;

                stroke.coords.forEach((point, i) => {
                    context.strokeStyle = color;
                    context.lineWidth = lineWidth;
                    var midPoint = {
                        x: point.canvasX,
                        y: point.canvasY,
                    };
                    if (i !== 0) {
                        midPoint = calculateControlPoint(
                            point,
                            stroke.coords[i - 1]
                        );
                    }

                    context.quadraticCurveTo(
                        point.canvasX,
                        point.canvasY,
                        midPoint.x,
                        midPoint.y
                    );
                    context.lineTo(point.canvasX, point.canvasY);
                    context.stroke();
                });
                context.closePath();
                context.save();
            });
        };

        if (path !== undefined) drawpath();

        const roughCanvas = rough.canvas(canvas);

        if (elements.length !== 0) {
            elements.forEach(({ roughEle }) => {
                context.globalAlpha = "1";
                roughCanvas.draw(roughEle);
            });
        }

        return () => context.clearRect(0, 0, canvas.width, canvas.height);
    }, [path, elements, tempElement]);

    const removeElement = (x, y) => {
        if (elements.length > 0) {
            elements.forEach((element, index) => {
                let { x1, y1, x2, y2, type } = element;
                if (x1 > x2) {
                    const temp = x1;
                    x1 = x2;
                    x2 = temp;
                }
                if (y1 > y2) {
                    const temp = y1;
                    y1 = y2;
                    y2 = temp;
                }
                if (type == "rectangle" || type == "line") {
                    if (x >= x1 && x <= x2 && y >= y1 && y <= y2) {
                        const elementsCopy = [...elements];
                        elementsCopy.splice(index, 1);
                        setElements(elementsCopy);
                    }
                } else if (type == "circle") {
                    const centerX = (x1 + x2) / 2;
                    const centerY = (y1 + y2) / 2;
                    const radius = Math.sqrt(
                        Math.pow(centerX - x, 2) + Math.pow(centerY - y, 2)
                    );

                    if (radius <= (x2 - x1) / 2) {
                        const elementsCopy = [...elements];
                        elementsCopy.splice(index, 1);
                        setElements(elementsCopy);
                    }
                }
            });
        }
        if (path.length > 0) {
            path.forEach((stroke, index) => {
                stroke.coords.forEach((point, i) => {
                    const { canvasX, canvasY } = point;
                    if (
                        x >= canvasX - 10 &&
                        x <= canvasX + 10 &&
                        y >= canvasY - 10 &&
                        y <= canvasY + 10
                    ) {
                        const pathCopy = [...path];
                        pathCopy.splice(index, 1);
                        setPath(pathCopy);
                    }
                });
            });
        }
    };

    // start Drawing
    const handleMouseDown = (e) => {
        const { clientX, clientY } = e;

        const canvas = document.getElementById("canvas");
        const context = canvas.getContext("2d");

        const rect = canvas.getBoundingClientRect();

        const canvasX = clientX - rect.left;
        const canvasY = clientY - rect.top;

        if (toolType === "pencil") {
            setAction("sketching");
            setIsDrawing(true);

            const transparency = "1.0";
            const newEle = {
                coords: [],
                lineWidth,
                color,
                transparency,
            };
            newEle.coords.push({ canvasX, canvasY });
            setFreestyle(newEle);
            context.moveTo(canvasX, canvasY);
            context.beginPath();
        } else if (toolType === "eraser") {
            setAction("erasing");
            setIsErasing(true);
            removeElement(canvasX, canvasY);
        } else {
            const id = elements.length;
            setAction("drawing");
            const element = createElement(
                id,
                canvasX,
                canvasY,
                canvasX,
                canvasY,
                toolType,
                lineWidth,
                color
            );

            setTempElement(element);

            const roughCanvas = rough.canvas(canvas);
            roughCanvas.draw(element.roughEle);
        }
    };

    // draw
    const handleMouseMove = (e) => {
        const canvas = document.getElementById("canvas");
        const context = canvas.getContext("2d");

        const { clientX, clientY } = e;

        const rect = canvas.getBoundingClientRect();

        const canvasX = clientX - rect.left;
        const canvasY = clientY - rect.top;

        if (action === "sketching") {
            if (!isDrawing) return;

            const coords = freestyle.coords;
            coords.push({ canvasX, canvasY });
            setFreestyle((prevState) => ({
                ...prevState,
                coords,
            }));
            var midPoint = calculateControlPoint(
                coords[coords.length - 2],
                coords[coords.length - 1]
            );
            context.quadraticCurveTo(canvasX, canvasY, midPoint.x, midPoint.y);
            context.lineTo(canvasX, canvasY);
            context.stroke();
            context.lineWidth = lineWidth;
            context.strokeStyle = color;
        } else if (toolType === "eraser") {
            if (!isErasing) return;
            removeElement(canvasX, canvasY);
        } else if (action === "drawing") {
            const id = elements.length - 1;
            const { x1, y1, strokeWidth } = tempElement;

            const updatedElement = createElement(
                id,
                x1,
                y1,
                canvasX,
                canvasY,
                toolType,
                strokeWidth,
                color
            );

            setTempElement(updatedElement);

            const roughCanvas = rough.canvas(canvas);
            roughCanvas.draw(updatedElement.roughEle);
        }
    };

    // finish Drawing
    const handleMouseUp = () => {
        if (action === "drawing") {
            const index = elements.length;
            const { id, x1, y1, x2, y2, type, strokeWidth } = tempElement;
            const finalElement = createElement(
                id,
                x1,
                y1,
                x2,
                y2,
                type,
                strokeWidth,
                color
            );
            setElements((prevState) => [...prevState, finalElement]);
        } else if (action === "sketching") {
            const canvas = document.getElementById("canvas");
            const context = canvas.getContext("2d");
            context.closePath();
            setPath((prevState) => [...prevState, freestyle]);
            setFreestyle(null);
            setIsDrawing(false);
        } else if (action === "erasing") {
            setIsErasing(false);
        }
        setAction("none");
    };

    const handleGoBack = () => {
        history(-1);
    };

    return (
        <div className="container">
            <span className="code">
                <img
                    className="icon"
                    onClick={handleGoBack}
                    src={previous}
                    alt="compiler"
                />
            </span>
            <Swatch
                tool={toolType}
                setToolType={setToolType}
                lineWidth={lineWidth}
                setLineWidth={setLineWidth}
                color={color}
                setColor={setColor}
                clearBoard={() => {
                    setElements([]);
                    setPath([]);
                }}
            />
            <canvas
                id="canvas"
                width={window.innerWidth}
                height={window.innerHeight}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                Canvas
            </canvas>
        </div>
    );
};

export default Drawing;
