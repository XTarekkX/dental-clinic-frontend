import { axiosInstance } from './axiosInstance'
import type {
  AppointmentReport,
  ClinicFinancialReport,
  FinancialReport,
  OperationReport,
  PatientReport,
  ReportDateRangeParams,
  ReportsBundle,
} from '../types/report.types'

const reportParams = ({ startDate, endDate }: ReportDateRangeParams) => ({
  startDate,
  endDate,
})

export const getFinancialReport = async (
  params: ReportDateRangeParams,
): Promise<FinancialReport> => {
  const { data } = await axiosInstance.get<FinancialReport>(
    '/api/v1/reports/financial',
    { params: reportParams(params) },
  )
  return data
}

export const getAppointmentReport = async (
  params: ReportDateRangeParams,
): Promise<AppointmentReport> => {
  const { data } = await axiosInstance.get<AppointmentReport>(
    '/api/v1/reports/appointments',
    { params: reportParams(params) },
  )
  return data
}

export const getPatientReport = async (
  params: ReportDateRangeParams,
): Promise<PatientReport> => {
  const { data } = await axiosInstance.get<PatientReport>(
    '/api/v1/reports/patients',
    { params: reportParams(params) },
  )
  return data
}

export const getOperationReport = async (
  params: ReportDateRangeParams,
): Promise<OperationReport> => {
  const { data } = await axiosInstance.get<OperationReport>(
    '/api/v1/reports/operations',
    { params: reportParams(params) },
  )
  return data
}

export const getReportsBundle = async (
  params: ReportDateRangeParams,
): Promise<ReportsBundle> => {
  const [financial, appointments, patients, operations] = await Promise.all([
    getFinancialReport(params),
    getAppointmentReport(params),
    getPatientReport(params),
    getOperationReport(params),
  ])

  return {
    financial,
    appointments,
    patients,
    operations,
  }
}

export const getClinicFinancialReport = async (
  params: ReportDateRangeParams,
): Promise<ClinicFinancialReport> => {
  const { data } = await axiosInstance.get<ClinicFinancialReport>(
    '/api/v1/reports/clinic-financial',
    { params: reportParams(params) },
  )
  return data
}
