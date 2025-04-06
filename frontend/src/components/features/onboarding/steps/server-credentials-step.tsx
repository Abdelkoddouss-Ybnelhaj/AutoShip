"use client"
import { useOnboarding } from "@/hooks/useOnboarding"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertCircle, Lock, User, HelpCircle, Info } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function ServerCredentialsStep() {
  const { onboardingData, errors, updateOnboardingData } = useOnboarding()

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Docker Credentials</h3>
        <p className="text-sm text-muted-foreground">Add your Docker Hub credentials (optional)</p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="dockerUsername">
                Docker Username <span className="text-muted-foreground">(optional)</span>
              </Label>
            </div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="dockerUsername"
                value={onboardingData.dockerUsername || ""}
                onChange={(e) => updateOnboardingData("dockerUsername", e.target.value)}
                placeholder="Your Docker Hub username"
                className="pl-10"
              />
            </div>
            {errors.dockerUsername && (
              <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" /> {errors.dockerUsername}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="dockerPassword">
                Docker Password <span className="text-muted-foreground">(optional)</span>
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Your password will be stored securely</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="dockerPassword"
                type="password"
                value={onboardingData.dockerPassword || ""}
                onChange={(e) => updateOnboardingData("dockerPassword", e.target.value)}
                placeholder="Your Docker Hub password"
                className="pl-10"
              />
            </div>
            {errors.dockerPassword && (
              <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" /> {errors.dockerPassword}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Alert className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300">
        <Info className="h-4 w-4" />
        <AlertDescription>
          Your credentials will be encrypted and stored securely. We recommend using access tokens instead of your main
          password when possible.
        </AlertDescription>
      </Alert>
    </div>
  )
}

