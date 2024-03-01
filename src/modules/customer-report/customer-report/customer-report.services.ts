import databaseService from '~/modules/database/database.services'
import { CreateCustomerReportReqBody } from './customer-report.request'
import { CustomerReportStatus } from './customer-report.enum'
import { ObjectId } from 'mongodb'
import { CustomerReport } from './customer-report.schema'

class CustomerReportService {
  async createCustomerReport(body: CreateCustomerReportReqBody, user_id: string) {
    //lấy tất cả giá trị ra từ body
    const { report_id, order_id, description, rate_interior, images, interior_id } = body
    const result = await databaseService.customerReport.insertOne(
      new CustomerReport({
        _id: report_id ? new ObjectId(report_id) : new ObjectId(),
        interior_id: new ObjectId(interior_id),
        customer_id: new ObjectId(user_id),
        order_id: new ObjectId(order_id),
        rate_interior,
        description,
        images,
        status: CustomerReportStatus.Not_check
      })
    )
    const data = await databaseService.customerReport.findOne({ _id: result.insertedId })
    return data
  }

  async getReportById(id: string) {
    const report = await databaseService.customerReport.findOne({ _id: new ObjectId(id) })
    return report
  }

  async deleteCustomerReport(id: string) {
    const result = await databaseService.customerReport.deleteOne({ _id: new ObjectId(id) })
    return result
  }

  async changeStatus(id: string, status: CustomerReportStatus, reason_not_valid: string) {
    const result = await databaseService.customerReport.updateOne(
      {
        _id: new Object(id)
      },
      {
        $set: {
          reason_not_valid,
          status: status
        }
      }
    )
    const data = await this.getReportById(id)
    return data
  }
}

const customerReportService = new CustomerReportService()
export default customerReportService
