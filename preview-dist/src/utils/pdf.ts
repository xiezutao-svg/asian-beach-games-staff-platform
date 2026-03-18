import type { Report } from '@/types/report'

/**
 * 生成单个报告的PDF
 * @param report 报告对象
 * @returns Promise<Blob> PDF文件
 */
export async function generateSingleReportPDF(report: Report): Promise<Blob> {
  // Demo阶段使用模拟实现
  const content = `
${report.title}
=================================
日期: ${report.date}
作者: ${report.author}

${report.content}
  `.trim()

  const blob = new Blob([content], { type: 'application/pdf' })
  return blob
}

/**
 * 合并多个报告的PDF
 * @param reports 报告数组
 * @returns Promise<Blob> 合并后的PDF文件
 */
export async function mergeReportsPDF(reports: Report[]): Promise<Blob> {
  if (reports.length === 0) {
    throw new Error('没有可合并的报告')
  }

  // Demo阶段使用模拟实现
  let combinedContent = '亚沙会工作日报\n'
  combinedContent += '='.repeat(50) + '\n\n'

  reports.forEach((report, index) => {
    combinedContent += `\n[${index + 1}] ${report.title}\n`
    combinedContent += '-'.repeat(50) + '\n'
    combinedContent += `日期: ${report.date} | 作者: ${report.author}\n\n`
    combinedContent += `${report.content}\n\n`
  })

  const blob = { content: combinedContent, type: 'application/pdf' }
  return blob as Blob
}

/**
 * 下载PDF文件
 * @param blob PDF文件对象
 * @param filename 文件名
 */
export function downloadPDF(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * 格式化文件名
 * @param report 报告对象
 * @returns 格式化的文件名
 */
export function formatReportFilename(report: Report): string {
  const safeTitle = report.title.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_')
  return `${safeTitle}_${report.date}.pdf`
}

/**
 * 格式化合并文件名
 * @param reports 报告数组
 * @returns 格式化的合并文件名
 */
export function formatMergeFilename(reports: Report[]): string {
  const count = reports.length
  const startDate = reports[reports.length - 1]?.date || ''
  const endDate = reports[0]?.date || ''
  return `亚沙会工作日报合并_${startDate}_${endDate}（${count}份）.pdf`
}
