export type InvoiceStatus =
  | 'DRAFT'
  | 'ISSUED'
  | 'PAID'
  | 'PARTIALLY_PAID'
  | 'CANCELLED'

export type PaymentMethod = 'CASH' | 'CARD'

export interface InvoiceItem {
  id: number
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface Invoice {
  id: number
  invoiceNumber: string
  patientId: number
  patientFullName: string
  doctorId: number
  doctorFullName: string
  appointmentId: number | null
  items: InvoiceItem[]
  totalAmount: number
  discount: number
  tax: number
  netAmount: number
  amountPaid: number
  balanceDue: number
  status: InvoiceStatus
  dueDate: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface InvoiceItemRequest {
  description: string
  quantity: number
  unitPrice: number
}

export interface InvoiceRequest {
  patientId: number
  doctorId?: number | null
  appointmentId?: number | null
  items: InvoiceItemRequest[]
  discount?: number | null
  tax?: number | null
  dueDate?: string | null
  notes?: string | null
}

export interface InvoicesQueryParams {
  page?: number
  size?: number
  status?: InvoiceStatus | ''
}

export interface Payment {
  id: number
  invoiceId: number
  invoiceNumber: string
  patientId: number
  patientFullName: string
  amount: number
  paymentMethod: PaymentMethod
  referenceNumber: string | null
  paidAt: string
  notes: string | null
  createdAt: string
}

export interface PaymentRequest {
  invoiceId: number
  patientId: number
  amount: number
  paymentMethod: PaymentMethod
  referenceNumber?: string | null
  paidAt?: string | null
  notes?: string | null
}
