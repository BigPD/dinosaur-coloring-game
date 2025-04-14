import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

const CanvasContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
`;

const Canvas = styled.canvas`
  border: 2px solid #333;
  image-rendering: pixelated;
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const ResetButton = styled.button`
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #45a049;
  }
`;

const ColorPicker = styled.input`
  width: 50px;
  height: 50px;
  padding: 0;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const SaveButton = styled.button`
  padding: 10px 20px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1976D2;
  }
`;

const ToolButton = styled.button<{ isActive: boolean }>`
  padding: 10px 20px;
  background-color: ${props => props.isActive ? '#4CAF50' : '#f0f0f0'};
  color: ${props => props.isActive ? 'white' : 'black'};
  border: 2px solid ${props => props.isActive ? '#4CAF50' : '#ddd'};
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.isActive ? '#45a049' : '#e0e0e0'};
  }
`;

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 10px;
`;

const Slider = styled.input`
  width: 100px;
`;

const SliderLabel = styled.span`
  min-width: 60px;
  text-align: right;
`;

type DrawingMode = 'fill' | 'brush' | 'eraser';

interface DrawingCanvasProps {
  dinosaurImage: string;
  selectedColor: string;
  onColorChange: (color: string) => void;
}

const DrawingCanvas = React.forwardRef<HTMLCanvasElement, DrawingCanvasProps>(
  ({ dinosaurImage, selectedColor, onColorChange }, forwardedRef) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawingMode, setDrawingMode] = useState<DrawingMode>('fill');
    const [brushSize, setBrushSize] = useState(10);
    const [history, setHistory] = useState<ImageData[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    // Always create a local ref
    const localRef = useRef<HTMLCanvasElement>(null);
    
    // Use the forwarded ref if available, otherwise use local ref
    const canvasRef = (forwardedRef ?? localRef) as React.RefObject<HTMLCanvasElement>;

    // Sync the local ref with the forwarded ref if provided
    useEffect(() => {
      if (forwardedRef && 'current' in forwardedRef && localRef.current) {
        (forwardedRef as React.MutableRefObject<HTMLCanvasElement | null>).current = localRef.current;
      }
    }, [forwardedRef]);

    const hexToRgb = (hex: string) => {
      const bigint = parseInt(hex.slice(1), 16);
      return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
        a: 255
      };
    };

    const isSimilarColor = (c1: { r: number; g: number; b: number }, c2: { r: number; g: number; b: number }, threshold = 40) => {
      return (
        Math.abs(c1.r - c2.r) < threshold &&
        Math.abs(c1.g - c2.g) < threshold &&
        Math.abs(c1.b - c2.b) < threshold
      );
    };

    const isBlack = ({ r, g, b }: { r: number; g: number; b: number }) => {
      return r < 50 && g < 50 && b < 50;
    };

    const floodFill = (x: number, y: number, fillColor: string) => {
      if (!canvasRef.current) return;
      
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
      const data = imageData.data;
      const width = imageData.width;
      const height = imageData.height;

      const offset = (x: number, y: number) => (y * width + x) * 4;

      const startIdx = offset(x, y);
      const startColor = {
        r: data[startIdx],
        g: data[startIdx + 1],
        b: data[startIdx + 2],
        a: data[startIdx + 3],
      };

      if (isBlack(startColor)) return;

      const stack = [{ x, y }];
      const visited = new Set<number>();
      const rgb = hexToRgb(fillColor);

      while (stack.length) {
        const { x, y } = stack.pop()!;
        const i = offset(x, y);

        if (x < 0 || x >= width || y < 0 || y >= height) continue;

        if (visited.has(i)) continue;
        visited.add(i);

        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        if (!isSimilarColor({ r, g, b }, startColor) || isBlack({ r, g, b })) continue;

        data[i] = rgb.r;
        data[i + 1] = rgb.g;
        data[i + 2] = rgb.b;
        data[i + 3] = 255;

        stack.push({ x: x + 1, y });
        stack.push({ x: x - 1, y });
        stack.push({ x, y: y + 1 });
        stack.push({ x, y: y - 1 });
      }

      ctx.putImageData(imageData, 0, 0);
    };

    const saveState = () => {
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      // Get the current canvas state
      const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
      
      // If we're not at the end of history, remove future states
      if (historyIndex < history.length - 1) {
        setHistory(history.slice(0, historyIndex + 1));
      }
      
      // Add the new state
      setHistory([...history, imageData]);
      setHistoryIndex(historyIndex + 1);
    };

    const undo = () => {
      if (historyIndex > 0) {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        
        ctx.putImageData(history[historyIndex - 1], 0, 0);
        setHistoryIndex(historyIndex - 1);
      }
    };

    const redo = () => {
      if (historyIndex < history.length - 1) {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        
        ctx.putImageData(history[historyIndex + 1], 0, 0);
        setHistoryIndex(historyIndex + 1);
      }
    };

    const drawWithBrush = (x: number, y: number) => {
      if (!canvasRef.current) return;
      
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      const color = drawingMode === 'eraser' ? '#FFFFFF' : selectedColor;
      const rgb = hexToRgb(color);
      ctx.fillStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

      // Get the image data for the brush area
      const imageData = ctx.getImageData(
        Math.max(0, x - brushSize),
        Math.max(0, y - brushSize),
        brushSize * 2,
        brushSize * 2
      );
      const data = imageData.data;

      // Create a temporary canvas for the brush
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = brushSize * 2;
      tempCanvas.height = brushSize * 2;
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;

      // Draw the brush circle
      tempCtx.beginPath();
      tempCtx.arc(brushSize, brushSize, brushSize, 0, Math.PI * 2);
      tempCtx.fill();

      // Get the brush mask
      const brushData = tempCtx.getImageData(0, 0, brushSize * 2, brushSize * 2).data;

      // Apply the brush only to non-black pixels
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        const brushAlpha = brushData[i + 3];

        // Only paint if the pixel is not black and the brush is active at this position
        if (!isBlack({ r, g, b }) && brushAlpha > 0) {
          data[i] = rgb.r;
          data[i + 1] = rgb.g;
          data[i + 2] = rgb.b;
          data[i + 3] = 255;
        }
      }

      // Put the modified image data back
      ctx.putImageData(imageData, Math.max(0, x - brushSize), Math.max(0, y - brushSize));
    };

    const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!canvasRef.current) return;
      
      setIsDrawing(true);
      const rect = canvasRef.current.getBoundingClientRect();
      const x = Math.floor(e.clientX - rect.left);
      const y = Math.floor(e.clientY - rect.top);

      if (drawingMode === 'fill') {
        floodFill(x, y, selectedColor);
        saveState();
      } else {
        drawWithBrush(x, y);
      }
    };

    const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing || !canvasRef.current) return;
      
      const rect = canvasRef.current.getBoundingClientRect();
      const x = Math.floor(e.clientX - rect.left);
      const y = Math.floor(e.clientY - rect.top);

      if (drawingMode === 'brush' || drawingMode === 'eraser') {
        drawWithBrush(x, y);
      }
    };

    const handleCanvasMouseUp = () => {
      if (isDrawing && (drawingMode === 'brush' || drawingMode === 'eraser')) {
        saveState();
      }
      setIsDrawing(false);
    };

    const handleCanvasMouseLeave = () => {
      setIsDrawing(false);
    };

    const handleReset = () => {
      if (!canvasRef.current) return;
      
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.src = dinosaurImage;
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvasRef.current!.width, canvasRef.current!.height);
      };
    };

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onColorChange(e.target.value);
    };

    const handleSave = () => {
      if (!canvasRef.current) return;

      // Get current date for default filename
      const now = new Date();
      const defaultFilename = `dinosaur-coloring-${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}.png`;

      // Prompt user for filename
      const filename = prompt('Enter filename (without extension):', defaultFilename.replace('.png', ''));
      
      if (filename) {
        // Create download link
        const link = document.createElement('a');
        link.download = `${filename}.png`;
        link.href = canvasRef.current.toDataURL('image/png');
        link.click();
      }
    };

    useEffect(() => {
      if (!canvasRef.current) return;
      
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = dinosaurImage;
      
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvasRef.current!.width, canvasRef.current!.height);
      };
    }, [dinosaurImage]);

    return (
      <CanvasContainer>
        <ControlsContainer>
          <ColorPicker
            type="color"
            value={selectedColor}
            onChange={handleColorChange}
          />
          <ToolButton
            isActive={drawingMode === 'fill'}
            onClick={() => setDrawingMode('fill')}
          >
            Fill
          </ToolButton>
          <ToolButton
            isActive={drawingMode === 'brush'}
            onClick={() => setDrawingMode('brush')}
          >
            Brush
          </ToolButton>
          <ToolButton
            isActive={drawingMode === 'eraser'}
            onClick={() => setDrawingMode('eraser')}
          >
            Eraser
          </ToolButton>
          <SliderContainer>
            <SliderLabel>Size: {brushSize}</SliderLabel>
            <Slider
              type="range"
              min="1"
              max="50"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
            />
          </SliderContainer>
          <ToolButton
            onClick={undo}
            disabled={historyIndex <= 0}
            isActive={false}
          >
            Undo
          </ToolButton>
          <ToolButton
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            isActive={false}
          >
            Redo
          </ToolButton>
          <ResetButton onClick={handleReset}>
            Reset
          </ResetButton>
          <SaveButton onClick={handleSave}>
            Save
          </SaveButton>
        </ControlsContainer>
        <Canvas
          ref={canvasRef}
          width={800}
          height={600}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseLeave}
        />
      </CanvasContainer>
    );
  }
);

DrawingCanvas.displayName = 'DrawingCanvas';

export default DrawingCanvas; 