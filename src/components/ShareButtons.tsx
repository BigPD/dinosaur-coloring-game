import React from 'react';
import styled from 'styled-components';

const ShareContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin: 20px 0;
`;

const ShareButton = styled.button<{ bgColor: string }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  background-color: ${props => props.bgColor};
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  }
`;

interface ShareButtonsProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ canvasRef }) => {
  const shareToSocialMedia = async (platform: string) => {
    if (!canvasRef.current) return;

    try {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      
      switch (platform) {
        case 'pinterest':
          window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&media=${encodeURIComponent(dataUrl)}&description=Check out my colored dinosaur!`, '_blank');
          break;
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
          break;
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out my colored dinosaur!')}&url=${encodeURIComponent(window.location.href)}`, '_blank');
          break;
        case 'instagram':
        case 'tiktok':
          const link = document.createElement('a');
          link.download = 'dinosaur-coloring.png';
          link.href = dataUrl;
          link.click();
          alert(`To share on ${platform}:\n1. The image has been downloaded\n2. Open ${platform}\n3. Create a new post with the downloaded image`);
          break;
      }
    } catch (error) {
      console.error('Error sharing:', error);
      alert('There was an error sharing your image. Try saving it manually.');
    }
  };

  return (
    <ShareContainer>
      <ShareButton 
        bgColor="#E60023" 
        onClick={() => shareToSocialMedia('pinterest')}
      >
        Share to Pinterest
      </ShareButton>
      <ShareButton 
        bgColor="#1877F2" 
        onClick={() => shareToSocialMedia('facebook')}
      >
        Share to Facebook
      </ShareButton>
      <ShareButton 
        bgColor="#1DA1F2" 
        onClick={() => shareToSocialMedia('twitter')}
      >
        Share to Twitter
      </ShareButton>
      <ShareButton 
        bgColor="#E4405F" 
        onClick={() => shareToSocialMedia('instagram')}
      >
        Save for Instagram
      </ShareButton>
      <ShareButton 
        bgColor="#000000" 
        onClick={() => shareToSocialMedia('tiktok')}
      >
        Save for TikTok
      </ShareButton>
    </ShareContainer>
  );
};

export default ShareButtons; 