export interface Criteria {
  id: string
  city: string
  duration: {
    hours: number
    minutes: number
  }
  creationDate: string
}

export interface FormData {
  city: string
  hours: string
  minutes: string
}

export interface FormErrors {
  city?: string
  duration?: string
}
