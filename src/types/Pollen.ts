
export interface Pollen {
  id: string;
  latinName: string;
  arabicName?: string; // Added Arabic name field
  species: string;
  family: string;
  plantOrigin: string;
  measurement: {
    polar: string;
    equatorial: string;
  };
  dispersal: string;
  aperture: string;
  morphType: string;
  pattern: string;
  images: string[];
  createdAt: Date;
  featured?: boolean;
}

// Sample data
export const samplePollens: Pollen[] = [
  {
    id: '1',
    latinName: 'Helianthus annuus',
    arabicName: 'عباد الشمس',
    species: 'Sunflower',
    family: 'Asteraceae',
    plantOrigin: 'North America',
    measurement: {
      polar: '25-30 µm',
      equatorial: '28-32 µm'
    },
    dispersal: 'Zoophilous',
    aperture: 'Tricolporate',
    morphType: 'Prolate spheroidal',
    pattern: 'Echinate',
    images: ['https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9'],
    createdAt: new Date('2023-01-15'),
    featured: true
  },
  {
    id: '2',
    latinName: 'Pinus sylvestris',
    arabicName: 'الصنوبر الاسكتلندي',
    species: 'Scots pine',
    family: 'Pinaceae',
    plantOrigin: 'Eurasia',
    measurement: {
      polar: '40-50 µm',
      equatorial: '60-70 µm'
    },
    dispersal: 'Anemophilous',
    aperture: 'Saccate',
    morphType: 'Bisaccate',
    pattern: 'Verrucate',
    images: ['https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07'],
    createdAt: new Date('2023-02-10')
  },
  {
    id: '3',
    latinName: 'Betula pendula',
    arabicName: 'البتولا الفضية',
    species: 'Silver birch',
    family: 'Betulaceae',
    plantOrigin: 'Europe',
    measurement: {
      polar: '18-22 µm',
      equatorial: '22-25 µm'
    },
    dispersal: 'Anemophilous',
    aperture: 'Triporate',
    morphType: 'Oblate spheroidal',
    pattern: 'Scabrate',
    images: ['https://images.unsplash.com/photo-1493962853295-0fd70327578a'],
    createdAt: new Date('2023-03-05'),
    featured: true
  }
];
