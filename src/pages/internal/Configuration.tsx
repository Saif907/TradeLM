import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";
import { useFounderCheck } from "@/hooks/useFounderCheck";
import { InternalLayout } from "@/components/InternalLayout";

export default function Configuration() {
  const { loading: roleLoading } = useFounderCheck();
  const { toast } = useToast();

  const [features, setFeatures] = useState({
    aiStrategyPlanner: true,
    emotionTagging: true,
    journalSummarization: true,
    patternRecognition: false,
    socialSharing: false,
    advancedCharts: true,
    mobileApp: true,
    emailDigests: true,
  });

  const handleToggle = (feature: keyof typeof features) => {
    setFeatures((prev) => ({ ...prev, [feature]: !prev[feature] }));
  };

  const handleSave = () => {
    toast({
      title: "Configuration Saved",
      description: "Feature flags have been updated successfully.",
    });
  };

  if (roleLoading) {
    return (
      <InternalLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </InternalLayout>
    );
  }

  return (
    <InternalLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Configuration</h1>
            <p className="text-muted-foreground mt-1">Manage platform features and settings</p>
          </div>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Feature Flags</CardTitle>
            <CardDescription>Enable or disable platform features for all users</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="aiStrategyPlanner">AI Strategy Planner</Label>
                <p className="text-sm text-muted-foreground">
                  Let AI suggest trading strategies based on past performance
                </p>
              </div>
              <Switch
                id="aiStrategyPlanner"
                checked={features.aiStrategyPlanner}
                onCheckedChange={() => handleToggle("aiStrategyPlanner")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emotionTagging">Emotion Tagging</Label>
                <p className="text-sm text-muted-foreground">
                  Allow users to tag trades with emotional states for better insights
                </p>
              </div>
              <Switch
                id="emotionTagging"
                checked={features.emotionTagging}
                onCheckedChange={() => handleToggle("emotionTagging")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="journalSummarization">Journal Summarization</Label>
                <p className="text-sm text-muted-foreground">
                  AI-powered daily/weekly trade journal summaries
                </p>
              </div>
              <Switch
                id="journalSummarization"
                checked={features.journalSummarization}
                onCheckedChange={() => handleToggle("journalSummarization")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="patternRecognition">Pattern Recognition (Beta)</Label>
                <p className="text-sm text-muted-foreground">
                  Advanced AI pattern detection in trading behavior
                </p>
              </div>
              <Switch
                id="patternRecognition"
                checked={features.patternRecognition}
                onCheckedChange={() => handleToggle("patternRecognition")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="socialSharing">Social Sharing</Label>
                <p className="text-sm text-muted-foreground">
                  Allow users to share anonymized insights on social media
                </p>
              </div>
              <Switch
                id="socialSharing"
                checked={features.socialSharing}
                onCheckedChange={() => handleToggle("socialSharing")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="advancedCharts">Advanced Charts</Label>
                <p className="text-sm text-muted-foreground">
                  Additional chart types and technical indicators
                </p>
              </div>
              <Switch
                id="advancedCharts"
                checked={features.advancedCharts}
                onCheckedChange={() => handleToggle("advancedCharts")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="mobileApp">Mobile App Access</Label>
                <p className="text-sm text-muted-foreground">Enable mobile app for iOS and Android</p>
              </div>
              <Switch
                id="mobileApp"
                checked={features.mobileApp}
                onCheckedChange={() => handleToggle("mobileApp")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailDigests">Email Digests</Label>
                <p className="text-sm text-muted-foreground">
                  Weekly performance summaries sent to user emails
                </p>
              </div>
              <Switch
                id="emailDigests"
                checked={features.emailDigests}
                onCheckedChange={() => handleToggle("emailDigests")}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current platform configuration status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-card rounded-lg border border-border flex items-center justify-between">
              <span className="text-sm">Database Status</span>
              <span className="text-sm font-semibold text-green-500">Operational</span>
            </div>
            <div className="p-3 bg-card rounded-lg border border-border flex items-center justify-between">
              <span className="text-sm">AI Services</span>
              <span className="text-sm font-semibold text-green-500">Operational</span>
            </div>
            <div className="p-3 bg-card rounded-lg border border-border flex items-center justify-between">
              <span className="text-sm">Authentication</span>
              <span className="text-sm font-semibold text-green-500">Operational</span>
            </div>
            <div className="p-3 bg-card rounded-lg border border-border flex items-center justify-between">
              <span className="text-sm">File Storage</span>
              <span className="text-sm font-semibold text-green-500">Operational</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </InternalLayout>
  );
}
