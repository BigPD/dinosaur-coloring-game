import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import DinosaurSelector from './components/DinosaurSelector';
import DrawingCanvas from './components/DrawingCanvas';
import ColorPalette from './components/ColorPalette';
import ShareButtons from './components/ShareButtons';

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 15px;
  }
`;

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    gap: 15px;
    margin-bottom: 15px;
  }
`;

function App() {
  const [selectedColor, setSelectedColor] = useState('#FF0000');
  const [selectedDinosaur, setSelectedDinosaur] = useState('trex');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getDinosaurImage = (id: string) => {
    if (id === 'trex') {
      return '/dinosaurs/real/coloring-pages-for-children-dinosaurs-73282.jpg';
    }
    return `/dinosaurs/real/${id}.jpg`;
  };

  return (
    <AppContainer>
      <Title>Dinosaur Coloring Game</Title>
      <ControlsContainer>
        <DinosaurSelector
          selectedDinosaur={selectedDinosaur}
          onSelectDinosaur={setSelectedDinosaur}
        />
        <ColorPalette
          selectedColor={selectedColor}
          onSelectColor={setSelectedColor}
        />
      </ControlsContainer>
      <DrawingCanvas
        ref={canvasRef}
        dinosaurImage={getDinosaurImage(selectedDinosaur)}
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
      />
      <ShareButtons canvasRef={canvasRef} />
    </AppContainer>
  );
}

export default App; 