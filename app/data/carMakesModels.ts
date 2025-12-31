// Top 30 car makes with their popular models
export const carMakesModels: Record<string, string[]> = {
  'Honda': ['Accord', 'Civic', 'CR-V', 'Pilot', 'Odyssey', 'HR-V', 'Ridgeline', 'Passport', 'Insight', 'Fit'],
  'Toyota': ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Prius', 'Tacoma', 'Tundra', '4Runner', 'Sienna', 'Avalon'],
  'Ford': ['F-150', 'Escape', 'Explorer', 'Mustang', 'Edge', 'Fusion', 'Expedition', 'Ranger', 'Bronco', 'Maverick'],
  'Chevrolet': ['Silverado', 'Equinox', 'Tahoe', 'Malibu', 'Traverse', 'Suburban', 'Camaro', 'Colorado', 'Blazer', 'Trailblazer'],
  'Nissan': ['Altima', 'Rogue', 'Sentra', 'Pathfinder', 'Frontier', 'Murano', 'Maxima', 'Titan', 'Armada', 'Kicks'],
  'Jeep': ['Grand Cherokee', 'Wrangler', 'Cherokee', 'Compass', 'Renegade', 'Gladiator', 'Wagoneer', 'Grand Wagoneer'],
  'Ram': ['1500', '2500', '3500', '1500 Classic', 'ProMaster', 'ProMaster City'],
  'GMC': ['Sierra', 'Yukon', 'Acadia', 'Terrain', 'Canyon', 'Sierra HD', 'Yukon XL'],
  'Dodge': ['Charger', 'Challenger', 'Durango', 'Ram 1500', 'Journey', 'Grand Caravan'],
  'Hyundai': ['Elantra', 'Tucson', 'Santa Fe', 'Sonata', 'Palisade', 'Kona', 'Venue', 'Ioniq', 'Genesis'],
  'Kia': ['Forte', 'Sorento', 'Sportage', 'Telluride', 'Optima', 'Seltos', 'Soul', 'Rio', 'Carnival'],
  'Subaru': ['Outback', 'Forester', 'Crosstrek', 'Ascent', 'Legacy', 'Impreza', 'WRX', 'BRZ'],
  'Mazda': ['CX-5', 'CX-9', 'Mazda3', 'Mazda6', 'CX-30', 'MX-5 Miata', 'CX-50'],
  'Volkswagen': ['Jetta', 'Tiguan', 'Atlas', 'Passat', 'Golf', 'ID.4', 'Taos', 'Arteon'],
  'BMW': ['3 Series', '5 Series', 'X3', 'X5', 'X1', 'X7', '4 Series', '7 Series'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC', 'GLE', 'S-Class', 'GLA', 'GLB', 'GLS'],
  'Audi': ['A4', 'A6', 'Q5', 'Q7', 'A3', 'Q3', 'Q8', 'e-tron'],
  'Lexus': ['RX', 'ES', 'NX', 'GX', 'LX', 'IS', 'UX', 'LS'],
  'Acura': ['RDX', 'MDX', 'TLX', 'ILX', 'NSX', 'Integra'],
  'Infiniti': ['Q50', 'QX60', 'QX80', 'QX50', 'Q60', 'QX55'],
  'Cadillac': ['XT5', 'Escalade', 'XT4', 'XT6', 'CT5', 'CT4'],
  'Lincoln': ['Navigator', 'Aviator', 'Corsair', 'Nautilus', 'Continental'],
  'Buick': ['Enclave', 'Encore', 'Envision', 'LaCrosse', 'Regal'],
  'Chrysler': ['Pacifica', '300', 'Voyager', 'Aspen'],
  'Mitsubishi': ['Outlander', 'Eclipse Cross', 'Mirage', 'Outlander Sport'],
  'Volvo': ['XC60', 'XC90', 'XC40', 'S60', 'S90', 'V60'],
  'Tesla': ['Model 3', 'Model Y', 'Model S', 'Model X'],
  'Porsche': ['Macan', 'Cayenne', '911', 'Panamera', 'Taycan'],
  'Jaguar': ['F-Pace', 'XE', 'XF', 'E-Pace', 'I-Pace'],
  'Land Rover': ['Range Rover', 'Discovery', 'Range Rover Sport', 'Evoque', 'Defender'],
}

export const years = Array.from({ length: 26 }, (_, i) => 2025 - i) // 2000-2025

export const conditions = ['Excellent', 'Good', 'Fair', 'Poor'] as const

export type Condition = typeof conditions[number]



