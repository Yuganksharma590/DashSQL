import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Leaf, TrendingUp, Trophy, Activity, Plus, Cloud, Sun, CloudRain, Droplets } from "lucide-react";
import { Link } from "wouter";
import type { User, Activity as ActivityType, Reward } from "@shared/schema";

export default function Dashboard() {
  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  const { data: recentActivities, isLoading: activitiesLoading } = useQuery<ActivityType[]>({
    queryKey: ["/api/activities/recent"],
  });

  const { data: recentRewards } = useQuery<Reward[]>({
    queryKey: ["/api/rewards/recent"],
  });

  const { data: weather } = useQuery<any>({
    queryKey: ["/api/weather"],
  });

  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.username || "Eco Warrior"}!</h1>
        <p className="text-muted-foreground">Track your environmental impact and earn rewards for sustainable actions.</p>
      </div>

      {/* Top Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Carbon Saved</CardTitle>
            <Leaf className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary" data-testid="text-carbon-saved">
              {user?.totalCarbonSaved?.toFixed(1) || "0.0"} kg
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              CO₂ equivalent saved
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eco Points</CardTitle>
            <Trophy className="h-4 w-4 text-accent-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent-foreground" data-testid="text-points">
              {user?.totalPoints || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total points earned
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Level</CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-chart-3" data-testid="text-level">
              {user?.level || 1}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Eco warrior rank
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activities</CardTitle>
            <Activity className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-chart-2" data-testid="text-activity-count">
              {recentActivities?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Logged this week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activities */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Your latest eco-friendly actions</CardDescription>
              </div>
              <Link href="/activities">
                <Button size="sm" data-testid="button-log-activity">
                  <Plus className="h-4 w-4 mr-2" />
                  Log Activity
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {activitiesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-muted animate-pulse rounded-md" />
                ))}
              </div>
            ) : recentActivities && recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.slice(0, 5).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 p-4 rounded-md bg-card border hover-elevate"
                    data-testid={`activity-item-${activity.id}`}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                      <Leaf className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{activity.activityType}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.quantity} {activity.unit} • {activity.category}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        +{activity.carbonSaved.toFixed(1)} kg CO₂
                      </Badge>
                      <Badge variant="outline" className="bg-accent/10 text-accent-foreground border-accent/20">
                        +{activity.pointsEarned} pts
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Leaf className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Start Your Green Journey</h3>
                <p className="text-muted-foreground mb-4 max-w-sm">
                  Log your first eco-friendly activity and start making a positive impact on the planet!
                </p>
                <Link href="/activities">
                  <Button data-testid="button-start-journey">
                    <Plus className="h-4 w-4 mr-2" />
                    Log Your First Activity
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weather & Rewards Sidebar */}
        <div className="space-y-6">
          {/* Weather Widget */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {weather?.current?.is_day ? (
                  <Sun className="h-5 w-5 text-accent-foreground" />
                ) : (
                  <Cloud className="h-5 w-5 text-muted-foreground" />
                )}
                Weather
              </CardTitle>
              <CardDescription>Current conditions</CardDescription>
            </CardHeader>
            <CardContent>
              {weather ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-4xl font-bold" data-testid="text-temperature">
                        {weather.current?.temperature_2m || "--"}°C
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Feels like {weather.current?.apparent_temperature || "--"}°C
                      </p>
                    </div>
                    {weather.current?.precipitation > 0 ? (
                      <CloudRain className="h-12 w-12 text-chart-3" />
                    ) : weather.current?.is_day ? (
                      <Sun className="h-12 w-12 text-accent-foreground" />
                    ) : (
                      <Cloud className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
                        <Droplets className="h-3 w-3" />
                        Humidity
                      </div>
                      <div className="font-semibold">{weather.current?.relative_humidity_2m || "--"}%</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs mb-1">Wind Speed</div>
                      <div className="font-semibold">{weather.current?.wind_speed_10m || "--"} km/h</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Cloud className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Weather data unavailable</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Rewards */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-accent-foreground" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentRewards && recentRewards.length > 0 ? (
                <div className="space-y-3">
                  {recentRewards.slice(0, 3).map((reward) => (
                    <div
                      key={reward.id}
                      className="flex items-center gap-3 p-3 rounded-md bg-accent/10 border border-accent/20"
                      data-testid={`reward-${reward.id}`}
                    >
                      <Trophy className="h-5 w-5 text-accent-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{reward.title}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          +{reward.pointsAwarded} points
                        </p>
                      </div>
                    </div>
                  ))}
                  <Link href="/rewards">
                    <Button variant="outline" className="w-full" size="sm" data-testid="button-view-rewards">
                      View All Rewards
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Trophy className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No achievements yet</p>
                  <p className="text-xs mt-1">Complete activities to earn rewards!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
