
export type FuelStatus = 'available' | 'limited' | 'none';
export type QueueStatus = 'small' | 'medium' | 'large';

export interface FuelStation {
  id: string;
  name: string;
  division: string;
  district: string;
  area: string;
  latitude: number;
  longitude: number;
  fuelType: string[];
  status: FuelStatus;
  queue: QueueStatus;
  lastUpdated: string;
}

export const DIVISIONS = [
  'ঢাকা',
  'চট্টগ্রাম',
  'রাজশাহী',
  'খুলনা',
  'বরিশাল',
  'সিলেট',
  'রংপুর',
  'ময়মনসিংহ'
];

export const DISTRICTS_BY_DIVISION: Record<string, string[]> = {
  'ঢাকা': ['ঢাকা', 'গাজীপুর', 'নারায়ণগঞ্জ', 'নরসিংদী', 'মানিকগঞ্জ', 'টাঙ্গাইল', 'ফরিদপুর', 'গোপালগঞ্জ', 'মাদারীপুর', 'রাজবাড়ী', 'শরীয়তপুর', 'কিশোরগঞ্জ'],
  'চট্টগ্রাম': ['চট্টগ্রাম', 'কক্সবাজার', 'রাঙ্গামাটি', 'বান্দরবান', 'খাগড়াছড়ি', 'ফেনী', 'লক্ষ্মীপুর', 'কুমিল্লা', 'চাঁদপুর', 'ব্রাহ্মণবাড়িয়া', 'নোয়াখালী'],
  'রাজশাহী': ['রাজশাহী', 'নাটোর', 'পাবনা', 'বগুড়া', 'জয়পুরহাট', 'নওগাঁ', 'সিরাজগঞ্জ', 'চাঁপাইনবাবগঞ্জ'],
  'খুলনা': ['খুলনা', 'বাগেরহাট', 'সাতক্ষীরা', 'যশোর', 'মাগুরা', 'নড়াইল', 'কুষ্টিয়া', 'চুয়াডাঙ্গা', 'মেহেরপুর', 'ঝিনাইদহ'],
  'বরিশাল': ['বরিশাল', 'ভোলা', 'পটুয়াখালী', 'পিরোজপুর', 'বরগুনা', 'ঝালকাঠি'],
  'সিলেট': ['সিলেট', 'মৌলভীবাজার', 'হবিগঞ্জ', 'সুনামগঞ্জ'],
  'রংপুর': ['রংপুর', 'গাইবান্ধা', 'কুড়িগ্রাম', 'নীলফামারী', 'লালমনিরহাট', 'দিনাজপুর', 'ঠাকুরগাঁও', 'পঞ্চগড়'],
  'ময়মনসিংহ': ['ময়মনসিংহ', 'জামালপুর', 'শেরপুর', 'নেত্রকোনা']
};

const STATION_NAMES = [
  'Jamuna Filling Station',
  'Padma Oil Company',
  'Meghna Petroleum',
  'Rupali Filling Station',
  'Sonalika Filling Station',
  'Trust Filling Station',
  'City Filling Station',
  'Highway Filling Station',
  'Metro Filling Station',
  'Green Leaf Fuel',
  'Blue Sky Petroleum',
  'Golden Gate Filling',
  'Riverside Energy',
  'Central Point Fuel',
  'Desh Filling Station',
  'Bangla Petroleum',
  'Standard Filling Station',
  'Popular Fuel Center',
  'Quick Stop Petroleum',
  'Reliable Filling Station'
];

const generateMockStations = (count: number): FuelStation[] => {
  const stations: FuelStation[] = [];
  const divisions = Object.keys(DISTRICTS_BY_DIVISION);
  
  // Bangladesh Bounding Box
  const latMin = 20.6;
  const latMax = 26.4;
  const lngMin = 88.1;
  const lngMax = 92.6;

  for (let i = 0; i < count; i++) {
    const division = divisions[Math.floor(Math.random() * divisions.length)];
    const districts = DISTRICTS_BY_DIVISION[division];
    const district = districts[Math.floor(Math.random() * districts.length)];
    const namePrefix = STATION_NAMES[Math.floor(Math.random() * STATION_NAMES.length)];
    
    // Random status and queue
    const statusRand = Math.random();
    const status: FuelStatus = statusRand > 0.6 ? 'available' : (statusRand > 0.3 ? 'limited' : 'none');
    
    // Most default to large queue as requested
    const queueRand = Math.random();
    const queue: QueueStatus = queueRand > 0.8 ? 'small' : (queueRand > 0.6 ? 'medium' : 'large');

    stations.push({
      id: `${i + 1}`,
      name: `${namePrefix} - ${district}`,
      division,
      district,
      area: 'Main Road',
      latitude: latMin + Math.random() * (latMax - latMin),
      longitude: lngMin + Math.random() * (lngMax - lngMin),
      fuelType: Math.random() > 0.5 ? ['পেট্রোল', 'ডিজেল'] : ['পেট্রোল'],
      status,
      queue,
      lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 100000000)).toISOString()
    });
  }
  return stations;
};

export const MOCK_STATIONS: FuelStation[] = generateMockStations(220);
