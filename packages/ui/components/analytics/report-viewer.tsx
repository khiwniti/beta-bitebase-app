import * as React from "react"
import { cn } from "../../lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"

export interface ReportSection {
  id: string
  title: string
  content: string
  charts?: React.ReactNode[]
  metrics?: {
    label: string
    value: string | number
  }[]
}

export interface ReportViewerProps {
  title: string
  sections: ReportSection[]
  generatedAt?: Date
  onExport?: (format: "pdf" | "excel") => void
  className?: string
}

const ReportViewer = React.forwardRef<HTMLDivElement, ReportViewerProps>(
  ({ title, sections, generatedAt, onExport, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-6", className)} {...props}>
        {/* Report Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{title}</CardTitle>
                {generatedAt && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Generated on {generatedAt.toLocaleDateString()} at {generatedAt.toLocaleTimeString()}
                  </p>
                )}
              </div>
              {onExport && (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onExport("pdf")}
                  >
                    Export PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onExport("excel")}
                  >
                    Export Excel
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Report Sections */}
        {sections.map((section) => (
          <Card key={section.id}>
            <CardHeader>
              <CardTitle className="text-lg">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose prose-sm max-w-none">
                <p>{section.content}</p>
              </div>
              
              {section.metrics && section.metrics.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {section.metrics.map((metric, index) => (
                    <div key={index} className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">{metric.value}</div>
                      <div className="text-sm text-muted-foreground">{metric.label}</div>
                    </div>
                  ))}
                </div>
              )}
              
              {section.charts && section.charts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.charts.map((chart, index) => (
                    <div key={index}>{chart}</div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
)
ReportViewer.displayName = "ReportViewer"

export { ReportViewer }
