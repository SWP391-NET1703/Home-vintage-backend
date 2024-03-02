export interface CreateStaffReqBody {
  full_name: string
  phone_number: string
  email: string
  password: string
  confirm_password: string
  cccd: string
  day_on: number
  day_off: number
  salary: number
}
