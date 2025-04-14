import React from 'react';
import styled from 'styled-components';

const Gallery = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  gap: 20px;
`;

const DinosaurCard = styled.div`
  width: 300px;
  border: 2px solid #4CAF50;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
  background: white;

  &:hover {
    transform: scale(1.05);
  }
`;

const DinosaurImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const DinosaurName = styled.h3`
  text-align: center;
  padding: 10px;
  margin: 0;
  background: #4CAF50;
  color: white;
`;

interface DinosaurGalleryProps {
  onSelectDinosaur: (dinosaur: string) => void;
}

const DinosaurGallery: React.FC<DinosaurGalleryProps> = ({ onSelectDinosaur }) => {
  const dinosaurs = [
    {
      id: 'trex',
      name: 'T-Rex',
      image: '/dinosaurs/real/coloring-pages-for-children-dinosaurs-73282.jpg'
    }
  ];

  const handleDinosaurClick = (imagePath: string) => {
    console.log('Selected dinosaur image path:', imagePath);
    onSelectDinosaur(imagePath);
  };

  return (
    <Gallery>
      {dinosaurs.map((dino) => (
        <DinosaurCard key={dino.id} onClick={() => handleDinosaurClick(dino.image)}>
          <DinosaurImage 
            src={process.env.PUBLIC_URL + dino.image} 
            alt={dino.name}
            onError={(e) => console.error('Error loading preview image:', e)}
          />
          <DinosaurName>{dino.name}</DinosaurName>
        </DinosaurCard>
      ))}
    </Gallery>
  );
};

export default DinosaurGallery; 