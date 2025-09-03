export type Option = {
  id: string
  text: string
  correct?: boolean
  explanation?: string
}

export type Item = {
  id: string
  text: string
  type: 'single' | 'multi' | 'text'
  options?: Option[]
  explanation?: string
}

export type Pack = {
  title: string
  description?: string
  tags?: string[]
  items: Item[]
  public?: boolean
}