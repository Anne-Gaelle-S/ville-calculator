export interface ICity {
  nom: string
  code: string
  codeDepartement: string
  codeRegion: string
  codesPostaux: string[]
  population: number
}

export interface ICitySearchResponse {
  cities: ICity[]
  total: number
}
