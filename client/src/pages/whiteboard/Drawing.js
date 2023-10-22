import { useState, useEffect, useMemo } from "react";
import Swatch from "../../components/Swatch";
import rough from "roughjs/bundled/rough.esm";
const gen = rough.generator();

const createElement = (id, x1, y1, x2, y2, type) => {
    let roughEle = null;
    if (type === "rectangle") {
        roughEle = gen.rectangle(x1, y1, x2 - x1, y2 - y1);
    } else if (type === "circle") {
        const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        const centerX = (x1 + x2) / 2;
        const centerY = (y1 + y2) / 2;
        roughEle = gen.circle(centerX, centerY, radius);
    } else {
        roughEle = gen.line(x1, y1, x2, y2);
    }
    return { id, x1, y1, x2, y2, type, roughEle };
};

const midPointBtw = (p1, p2) => {
    return {
        x: p1.canvasX + (p2.canvasX - p1.canvasX) / 2,
        y: p1.canvasY + (p2.canvasY - p1.canvasY) / 2,
    };
};

const Drawing = () => {
    const [elements, setElements] = useState([]); //stores all the shapes for main canvas
    const [tempElement, setTempElement] = useState([]); //stores the temporary shape currently being drawn
    const [isDrawing, setIsDrawing] = useState(false);
    const [isErasing, setIsErasing] = useState(false);

    const [points, setPoints] = useState([]); //stores coordinates of current freestyle path drawing
    const [path, setPath] = useState([]); //stores all the freestyle paths

    const [action, setAction] = useState("none");
    const [toolType, setToolType] = useState("pencil");

    useEffect(() => {
        const canvas = document.getElementById("canvas");
        const context = canvas.getContext("2d");
        context.lineCap = "round";
        context.lineJoin = "round";

        context.save();

        const drawpath = () => {
            path.forEach((stroke, index) => {
                context.beginPath();

                stroke.forEach((point, i) => {
                    var midPoint = {
                        x: point.canvasX,
                        y: point.canvasY,
                    };
                    if (i !== 0) {
                        midPoint = midPointBtw(point, stroke[i - 1]);
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
    }, [path, elements]);

    const updateElement = (index, x1, y1, x2, y2, toolType, strokeWidth) => {
        const updatedElement = createElement(index, x1, y1, x2, y2, toolType);
        const elementsCopy = [...elements];
        elementsCopy[index] = updatedElement;
        setElements(elementsCopy);
        setTempElement(updatedElement);
    };

    const removeElement = (x, y) => {
        if (elements.length > 0) {
            elements.forEach((element, index) => {
                const { x1, y1, x2, y2, type } = element;
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
                stroke.forEach((point, i) => {
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

        const id = elements.length;
        if (toolType === "pencil") {
            setAction("sketching");
            setIsDrawing(true);

            const transparency = "1.0";
            const newEle = {
                canvasX,
                canvasY,
                transparency,
            };
            setPoints((state) => [...state, newEle]);

            context.lineCap = 5;
            context.moveTo(canvasX, canvasY);
            context.beginPath();
        } else if (toolType === "eraser") {
            setAction("erasing");
            setIsErasing(true);
            removeElement(canvasX, canvasY);
        } else {
            setAction("drawing");
            const element = createElement(
                id,
                canvasX,
                canvasY,
                canvasX,
                canvasY
            );

            setTempElement(element);
            setElements((prevState) => [...prevState, element]);
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

            const transparency = points[points.length - 1].transparency;
            const newEle = { canvasX, canvasY, transparency };

            setPoints((state) => [...state, newEle]);
            var midPoint = midPointBtw(newEle, points[points.length - 1]);
            context.quadraticCurveTo(canvasX, canvasY, midPoint.x, midPoint.y);
            context.lineTo(canvasX, canvasY);
            context.stroke();
        } else if (toolType === "eraser") {
            if (!isErasing) return;
            removeElement(canvasX, canvasY);
        } else if (action === "drawing") {
            const index = elements.length - 1;
            const { x1, y1, strokeWidth } = tempElement;

            updateElement(
                index,
                x1,
                y1,
                canvasX,
                canvasY,
                toolType,
                strokeWidth
            );
        }
    };

    // finish Drawing
    const handleMouseUp = () => {
        if (action === "drawing") {
            const index = tempElement.id;
            const { id, x1, y1, x2, y2, type, strokeWidth } = tempElement;
            updateElement(id, x1, y1, x2, y2, type, strokeWidth);
        } else if (action === "sketching") {
            const canvas = document.getElementById("canvas");
            const context = canvas.getContext("2d");
            context.closePath();
            const element = points;
            setPoints([]);
            setPath((prevState) => [...prevState, element]); //tuple
            setIsDrawing(false);
        } else if (action === "erasing") {
            setIsErasing(false);
        }
        setAction("none");
    };

    return (
        <div>
            <div>
                <Swatch setToolType={setToolType} />
            </div>
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
