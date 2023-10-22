import React, { useEffect, useState, useRef } from "react";

const Penciltool = () => {
    const pathRef = useRef([]);
    const [drawing, setDrawing] = useState(false);
    const contextRef = useRef(null);

    useEffect(() => {
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");

        ctx.lineCap = "round";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        contextRef.current = ctx;
    }, []);

    const startDrawing = (event) => {
        setDrawing(true);
        const { clientX, clientY } = event;
        pathRef.current.push({ x: clientX, y: clientY });
    };

    const finishDrawing = () => {
        setDrawing(false);
        pathRef.current = [];
    };

    const draw = (event) => {
        if (!drawing) return;

        const { clientX, clientY } = event;
        pathRef.current.push({ x: clientX, y: clientY });
        contextRef.current.beginPath();
        contextRef.current.moveTo(pathRef.current[0].x, pathRef.current[0].y);

        for (let i = 1; i < pathRef.current.length; i++) {
            const { x, y } = pathRef.current[i];
            contextRef.current.lineTo(x, y);
        }
        contextRef.current.stroke();
    };

    return (
        <canvas
            id="canvas"
            width={window.innerWidth}
            height={window.innerHeight}
            onMouseDown={startDrawing}
            onMouseUp={finishDrawing}
            onMouseMove={draw}
        >
            Canvas
        </canvas>
    );
};

export default Penciltool;
