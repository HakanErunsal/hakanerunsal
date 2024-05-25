// components/GameStatusBadge.tsx
import React from 'react';

interface GameStatusBadgeProps {
  status: 'Free to Play' | 'Paid';
}

const GameStatusBadge: React.FC<GameStatusBadgeProps> = ({ status }) => {
  const isFreeToPlay = status === 'Free to Play';
  return (
    <div className={`inline-block px-3 py-1 rounded-none text-sm font-semibold ${
      isFreeToPlay ? 'bg-green-200 text-green-800' : 'bg-purple-500 text-white'
    }`}
    style={{transform: 'rotate(-35deg)'}}>
      {status}
    </div>
  );
};

export default GameStatusBadge;