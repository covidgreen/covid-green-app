export interface CountyItem {
  county: string;
  code: string;
  label?: string;
}

export type County =
  | 'Albany'
  | 'Allegany'
  | 'Bronx'
  | 'Broome'
  | 'Cattaraugus'
  | 'Cayuga'
  | 'Chautauqua'
  | 'Chemung'
  | 'Chenango'
  | 'Clinton'
  | 'Columbia'
  | 'Cortland'
  | 'Delaware'
  | 'Dutchess'
  | 'Erie'
  | 'Essex'
  | 'Franklin'
  | 'Fulton'
  | 'Genesee'
  | 'Greene'
  | 'Hamilton'
  | 'Herkimer'
  | 'Jefferson'
  | 'Kings'
  | 'Lewis'
  | 'Livingston'
  | 'Madison'
  | 'Monroe'
  | 'Montgomery'
  | 'Nassau'
  | 'New York'
  | 'Niagara'
  | 'Oneida'
  | 'Onondaga'
  | 'Ontario'
  | 'Orange'
  | 'Orleans'
  | 'Oswego'
  | 'Otsego'
  | 'Putnam'
  | 'Queens'
  | 'Rensselaer'
  | 'Richmond'
  | 'Rockland'
  | 'Saratoga'
  | 'Schenectady'
  | 'Schoharie'
  | 'Schuyler'
  | 'Seneca'
  | 'St. Lawrence'
  | 'Steuben'
  | 'Suffolk'
  | 'Sullivan'
  | 'Tioga'
  | 'Tompkins'
  | 'Ulster'
  | 'Warren'
  | 'Washington'
  | 'Wayne'
  | 'Westchester'
  | 'Wyoming'
  | 'Yates';

export const counties: CountyItem[] = [
  {county: 'Albany', code: 'Albany'},
  {county: 'Allegany', code: 'Allegany'},
  {county: 'Bronx', code: 'Bronx'},
  {county: 'Brooklyn (Kings)', code: 'Kings_Brooklyn'},
  {county: 'Broome', code: 'Broome'},
  {county: 'Cattaraugus', code: 'Cattaraugus'},
  {county: 'Cayuga', code: 'Cayuga'},
  {county: 'Chautauqua', code: 'Chautauqua'},
  {county: 'Chemung', code: 'Chemung'},
  {county: 'Chenango', code: 'Chenango'},
  {county: 'Clinton', code: 'Clinton'},
  {county: 'Columbia', code: 'Columbia'},
  {county: 'Cortland', code: 'Cortland'},
  {county: 'Delaware', code: 'Delaware'},
  {county: 'Dutchess', code: 'Dutchess'},
  {county: 'Erie', code: 'Erie'},
  {county: 'Essex', code: 'Essex'},
  {county: 'Franklin', code: 'Franklin'},
  {county: 'Fulton', code: 'Fulton'},
  {county: 'Genesee', code: 'Genesee'},
  {county: 'Greene', code: 'Greene'},
  {county: 'Hamilton', code: 'Hamilton'},
  {county: 'Herkimer', code: 'Herkimer'},
  {county: 'Jefferson', code: 'Jefferson'},
  {county: 'Kings (Brooklyn)', code: 'Kings'},
  {county: 'Lewis', code: 'Lewis'},
  {county: 'Livingston', code: 'Livingston'},
  {county: 'Madison', code: 'Madison'},
  {county: 'Manhattan (New York)', code: 'New York_Manhattan'},
  {county: 'Monroe', code: 'Monroe'},
  {county: 'Montgomery', code: 'Montgomery'},
  {county: 'Nassau', code: 'Nassau'},
  {county: 'New York (Manhattan)', code: 'New York'},
  {county: 'Niagara', code: 'Niagara'},
  {county: 'Oneida', code: 'Oneida'},
  {county: 'Onondaga', code: 'Onondaga'},
  {county: 'Ontario', code: 'Ontario'},
  {county: 'Orange', code: 'Orange'},
  {county: 'Orleans', code: 'Orleans'},
  {county: 'Oswego', code: 'Oswego'},
  {county: 'Otsego', code: 'Otsego'},
  {county: 'Putnam', code: 'Putnam'},
  {county: 'Queens', code: 'Queens'},
  {county: 'Rensselaer', code: 'Rensselaer'},
  {county: 'Richmond (Staten Island)', code: 'Richmond'},
  {county: 'Rockland', code: 'Rockland'},
  {county: 'Saratoga', code: 'Saratoga'},
  {county: 'Schenectady', code: 'Schenectady'},
  {county: 'Schoharie', code: 'Schoharie'},
  {county: 'Schuyler', code: 'Schuyler'},
  {county: 'Seneca', code: 'Seneca'},
  {county: 'St. Lawrence', code: 'St. Lawrence'},
  {county: 'Staten Island (Richmond)', code: 'Richmond_Staten Island'},
  {county: 'Steuben', code: 'Steuben'},
  {county: 'Suffolk', code: 'Suffolk'},
  {county: 'Sullivan', code: 'Sullivan'},
  {county: 'Tioga', code: 'Tioga'},
  {county: 'Tompkins', code: 'Tompkins'},
  {county: 'Ulster', code: 'Ulster'},
  {county: 'Warren', code: 'Warren'},
  {county: 'Washington', code: 'Washington'},
  {county: 'Wayne', code: 'Wayne'},
  {county: 'Westchester', code: 'Westchester'},
  {county: 'Wyoming', code: 'Wyoming'},
  {county: 'Yates', code: 'Yates'}
];
