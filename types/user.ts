export interface UserDetails {
  _id: string
  fullName: string
  email: string
  phone: string
  district: string
  address: string
  role: 'user' | 'admin' | 'manager'
  createdAt: string
  updatedAt: string
}
