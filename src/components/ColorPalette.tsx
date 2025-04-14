import React from 'react';
import styled from 'styled-components';

const PaletteContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
  padding: 10px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
`;

const ColorButton = styled.button<{ color: string; isSelected: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid ${props => props.isSelected ? '#333' : '#ddd'};
  background-color: ${props => props.color};
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  }
`;

const colors = [
  '#FF0000', // Red
  '#FFA500', // Orange
  '#FFFF00', // Yellow
  '#008000', // Green
  '#0000FF', // Blue
  '#4B0082', // Indigo
  '#800080', // Purple
  '#FFC0CB', // Pink
  '#8B4513', // Brown
  '#000000', // Black
];

interface ColorPaletteProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ selectedColor, onSelectColor }) => {
  return (
    <PaletteContainer>
      {colors.map((color) => (
        <ColorButton
          key={color}
          color={color}
          isSelected={selectedColor === color}
          onClick={() => onSelectColor(color)}
          aria-label={`Select ${color} color`}
        />
      ))}
    </PaletteContainer>
  );
};

export default ColorPalette; 