
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface UAEMapProps {
  region?: string;
  className?: string;
}

const UAEMap: React.FC<UAEMapProps> = ({ region, className }) => {
  // This is a simplified representation of UAE regions
  const uaeRegions = [
    { id: 'dubai', name: 'Dubai', path: "M70,80 L90,70 L120,90 L110,110 L80,100 Z", color: '#e6e6e6' },
    { id: 'abudhabi', name: 'Abu Dhabi', path: "M60,100 L100,120 L50,160 L30,140 Z", color: '#e6e6e6' },
    { id: 'sharjah', name: 'Sharjah', path: "M100,60 L130,70 L120,90 L90,70 Z", color: '#e6e6e6' },
    { id: 'ajman', name: 'Ajman', path: "M100,55 L110,50 L120,60 L100,60 Z", color: '#e6e6e6' },
    { id: 'fujairah', name: 'Fujairah', path: "M140,80 L160,70 L150,110 L130,90 Z", color: '#e6e6e6' },
    { id: 'rak', name: 'Ras Al Khaimah', path: "M110,40 L140,30 L150,60 L120,55 Z", color: '#e6e6e6' },
    { id: 'uaq', name: 'Umm Al Quwain', path: "M110,50 L130,45 L130,60 L110,55 Z", color: '#e6e6e6' }
  ];

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-2">Origin Map</h3>
        <div className="relative">
          <svg viewBox="0 0 200 200" width="100%" height="200" className="border rounded-md">
            <rect x="0" y="0" width="200" height="200" fill="#f0f9ff" />
            {/* Water */}
            <rect x="0" y="0" width="200" height="200" fill="#cce3f0" />
            {/* Land */}
            <path d="M20,20 L180,20 L180,180 L20,180 Z" fill="#f5f5f5" />
            
            {/* UAE Regions */}
            {uaeRegions.map(uaeRegion => (
              <path 
                key={uaeRegion.id}
                d={uaeRegion.path}
                fill={region?.toLowerCase() === uaeRegion.id.toLowerCase() ? '#a7f3d0' : uaeRegion.color}
                stroke={region?.toLowerCase() === uaeRegion.id.toLowerCase() ? '#10b981' : '#d1d5db'}
                strokeWidth="1"
              />
            ))}
            
            {/* Emirates Labels */}
            {uaeRegions.map(uaeRegion => {
              // Calculate centroid of the path's points
              const points = uaeRegion.path
                .replace(/[MLZ]/g, '')
                .split(' ')
                .filter(p => p)
                .map(p => p.split(',').map(Number));
              
              const xs = points.map(p => p[0] || 0);
              const ys = points.map(p => p[1] || 0);
              
              const cx = xs.reduce((a, b) => a + b, 0) / xs.length;
              const cy = ys.reduce((a, b) => a + b, 0) / ys.length;
              
              return (
                <text
                  key={`label-${uaeRegion.id}`}
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  fontSize="8"
                  fontWeight={region?.toLowerCase() === uaeRegion.id.toLowerCase() ? 'bold' : 'normal'}
                  fill={region?.toLowerCase() === uaeRegion.id.toLowerCase() ? '#047857' : '#6b7280'}
                >
                  {uaeRegion.name}
                </text>
              );
            })}
          </svg>
          
          <div className="mt-2 text-sm text-center text-muted-foreground">
            {region ? `Plant origin highlighted: ${region}` : 'Plant origin not specified'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UAEMap;
