import React from 'react';
import styled from 'styled-components';

const SelectorContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 20px;
`;

const DinosaurCard = styled.div<{ isSelected: boolean }>`
  width: 200px;
  border: 3px solid ${props => props.isSelected ? '#4CAF50' : '#ddd'};
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  }
`;

const DinosaurImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: contain;
  background-color: white;
  padding: 10px;
`;

const DinosaurName = styled.div`
  background-color: #4CAF50;
  color: white;
  padding: 10px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
`;

interface DinosaurSelectorProps {
  selectedDinosaur: string;
  onSelectDinosaur: (dinosaur: string) => void;
}

const dinosaurs = [
  {
    id: 'trex',
    name: 'T-Rex',
    image: '/dinosaurs/real/coloring-pages-for-children-dinosaurs-73282.jpg'
  },
  {
    id: 'stegosaurus',
    name: 'Stegosaurus',
    image: '/dinosaurs/real/Stegosaurus.jpg'
  },
  {
    id: 'triceratops',
    name: 'Triceratops',
    image: '/dinosaurs/real/Triceratops.jpg'
  },
  {
    id: 'diplodocus',
    name: 'Diplodocus',
    image: '/dinosaurs/real/Diplodocus.jpg'
  }
];

const DinosaurSelector: React.FC<DinosaurSelectorProps> = ({ selectedDinosaur, onSelectDinosaur }) => {
  return (
    <SelectorContainer>
      {dinosaurs.map((dino) => (
        <DinosaurCard
          key={dino.id}
          isSelected={selectedDinosaur === dino.id}
          onClick={() => onSelectDinosaur(dino.id)}
        >
          <DinosaurImage src={dino.image} alt={dino.name} />
          <DinosaurName>{dino.name}</DinosaurName>
        </DinosaurCard>
      ))}
    </SelectorContainer>
  );
};

export default DinosaurSelector; 