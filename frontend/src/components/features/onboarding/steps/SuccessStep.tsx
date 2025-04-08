import { Button } from "@/components/ui/button"
import { CheckCircle, ExternalLink } from "lucide-react"

export default function SuccessStep() {
  return (
    <div className="text-center space-y-4 py-4">
      <div className="flex justify-center">
        <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full">
          <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold">Setup Complete!</h3>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Your deployment pipeline has been successfully configured. You can now manage your deployments from the
          dashboard.
        </p>
      </div>

      <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
        <Button size="sm" className="gap-2">
          Go to Dashboard
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          View Documentation <ExternalLink className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}

