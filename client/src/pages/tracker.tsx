import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Leaf, TrendingUp, TrendingDown, Minus, Target } from "lucide-react";
import type { User, Activity } from "@shared/schema";

export default function Tracker() {
  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  const { data: activities } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  // Calculate monthly goal progress (example: 50 kg CO2 per month)
  const monthlyGoal = 50;
  const monthlyProgress = ((user?.totalCarbonSaved || 0) / monthlyGoal) * 100;

  // Calculate category breakdown
  const categoryBreakdown = activities?.reduce((acc, activity) => {
    const existing = acc.find(item => item.category === activity.category);
    if (existing) {
      existing.carbonSaved += activity.carbonSaved;
      existing.count += 1;
    } else {
      acc.push({
        category: activity.category,
        carbonSaved: activity.carbonSaved,
        count: 1,
      });
    }
    return acc;
  }, [] as Array<{ category: string; carbonSaved: number; count: number }>) || [];

  // Sort by carbon saved
  categoryBreakdown.sort((a, b) => b.carbonSaved - a.carbonSaved);

  // Calculate weekly comparison
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const thisWeekActivities = activities?.filter(a => new Date(a.activityDate) >= oneWeekAgo) || [];
  const lastWeekActivities = activities?.filter(a => 
    new Date(a.activityDate) >= twoWeeksAgo && new Date(a.activityDate) < oneWeekAgo
  ) || [];

  const thisWeekCarbon = thisWeekActivities.reduce((sum, a) => sum + a.carbonSaved, 0);
  const lastWeekCarbon = lastWeekActivities.reduce((sum, a) => sum + a.carbonSaved, 0);
  const weeklyChange = lastWeekCarbon > 0 
    ? ((thisWeekCarbon - lastWeekCarbon) / lastWeekCarbon) * 100 
    : thisWeekCarbon > 0 ? 100 : 0;

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Carbon Tracker</h1>
        <p className="text-muted-foreground">Monitor your carbon footprint reduction in detail</p>
      </div>

      {/* Main Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-primary" />
              Total Carbon Saved
            </CardTitle>
            <CardDescription>Your cumulative environmental impact</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-primary mb-4" data-testid="text-total-carbon-saved">
              {user?.totalCarbonSaved?.toFixed(1) || "0.0"} kg
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monthly Goal Progress</span>
                <span className="font-medium">{monthlyGoal} kg</span>
              </div>
              <Progress value={Math.min(monthlyProgress, 100)} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {monthlyProgress >= 100 
                  ? "🎉 Goal achieved! Keep up the great work!" 
                  : `${(monthlyGoal - (user?.totalCarbonSaved || 0)).toFixed(1)} kg to reach your monthly goal`
                }
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Leaf className="h-4 w-4 text-chart-1" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-chart-1" data-testid="text-week-carbon">
              {thisWeekCarbon.toFixed(1)} kg
            </div>
            <div className="flex items-center gap-1 mt-2">
              {weeklyChange > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : weeklyChange < 0 ? (
                <TrendingDown className="h-4 w-4 text-destructive" />
              ) : (
                <Minus className="h-4 w-4 text-muted-foreground" />
              )}
              <span className={`text-sm font-medium ${
                weeklyChange > 0 ? "text-green-600" : 
                weeklyChange < 0 ? "text-destructive" : 
                "text-muted-foreground"
              }`}>
                {weeklyChange > 0 ? "+" : ""}{weeklyChange.toFixed(1)}%
              </span>
              <span className="text-xs text-muted-foreground ml-1">vs last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activities</CardTitle>
            <Target className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-chart-2" data-testid="text-total-activities">
              {activities?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Total eco-actions logged
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Impact by Category</CardTitle>
          <CardDescription>Carbon saved across different activity types</CardDescription>
        </CardHeader>
        <CardContent>
          {categoryBreakdown.length > 0 ? (
            <div className="space-y-6">
              {categoryBreakdown.map((item, index) => {
                const percentage = user?.totalCarbonSaved 
                  ? (item.carbonSaved / user.totalCarbonSaved) * 100 
                  : 0;
                
                return (
                  <div key={item.category} data-testid={`category-${item.category}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <span className="font-medium">{item.category}</span>
                        <span className="text-sm text-muted-foreground">
                          ({item.count} {item.count === 1 ? "activity" : "activities"})
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-primary">
                          {item.carbonSaved.toFixed(1)} kg CO₂
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Leaf className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No data yet</h3>
              <p className="text-muted-foreground max-w-sm">
                Start logging activities to see your carbon savings broken down by category
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Insights */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Environmental Equivalents</CardTitle>
            <CardDescription>What your carbon savings represent</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-md bg-primary/5 border border-primary/20">
              <div>
                <p className="text-sm text-muted-foreground">Trees planted equivalent</p>
                <p className="text-2xl font-bold text-primary">
                  {Math.round((user?.totalCarbonSaved || 0) / 21)}
                </p>
              </div>
              <div className="text-4xl">🌳</div>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-md bg-chart-3/10 border border-chart-3/20">
              <div>
                <p className="text-sm text-muted-foreground">Miles not driven</p>
                <p className="text-2xl font-bold text-chart-3">
                  {Math.round((user?.totalCarbonSaved || 0) / 0.41)}
                </p>
              </div>
              <div className="text-4xl">🚗</div>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-md bg-accent/10 border border-accent/20">
              <div>
                <p className="text-sm text-muted-foreground">Smartphone charges saved</p>
                <p className="text-2xl font-bold text-accent-foreground">
                  {Math.round((user?.totalCarbonSaved || 0) * 1000 / 8)}
                </p>
              </div>
              <div className="text-4xl">📱</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Your sustainability snapshot</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <span className="text-sm text-muted-foreground">Best category</span>
              <span className="font-medium">{categoryBreakdown[0]?.category || "—"}</span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b">
              <span className="text-sm text-muted-foreground">Average per activity</span>
              <span className="font-medium">
                {activities && activities.length > 0
                  ? ((user?.totalCarbonSaved || 0) / activities.length).toFixed(1)
                  : "0.0"} kg CO₂
              </span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b">
              <span className="text-sm text-muted-foreground">Current level</span>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                Level {user?.level || 1}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-muted-foreground">Total points</span>
              <span className="font-medium text-accent-foreground">{user?.totalPoints || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
