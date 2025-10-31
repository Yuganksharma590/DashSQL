import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Award, Star, Zap, Target, TrendingUp } from "lucide-react";
import type { User, Reward } from "@shared/schema";

export default function Rewards() {
  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  const { data: rewards, isLoading } = useQuery<Reward[]>({
    queryKey: ["/api/rewards"],
  });

  // Calculate progress to next level
  const currentLevel = user?.level || 1;
  const pointsForNextLevel = currentLevel * 100;
  const currentPoints = user?.totalPoints || 0;
  const pointsInCurrentLevel = currentPoints % pointsForNextLevel;
  const levelProgress = (pointsInCurrentLevel / pointsForNextLevel) * 100;

  const achievementTypes = {
    Achievement: { icon: Trophy, color: "text-accent-foreground", bg: "bg-accent/10", border: "border-accent/20" },
    Milestone: { icon: Award, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
    Bonus: { icon: Star, color: "text-chart-4", bg: "bg-chart-4/10", border: "border-chart-4/20" },
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Rewards</h1>
        <p className="text-muted-foreground">Track your achievements and unlock new milestones</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Zap className="h-4 w-4 text-accent-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-accent-foreground" data-testid="text-total-points">
              {user?.totalPoints || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Eco points earned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Level</CardTitle>
            <Target className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-chart-3" data-testid="text-level">
              {currentLevel}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Eco warrior rank
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Trophy className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary" data-testid="text-achievement-count">
              {rewards?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Unlocked rewards
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Level Progress
          </CardTitle>
          <CardDescription>
            {pointsForNextLevel - pointsInCurrentLevel} points until Level {currentLevel + 1}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Level {currentLevel}</span>
              <span className="font-medium">{pointsInCurrentLevel} / {pointsForNextLevel} points</span>
            </div>
            <Progress value={levelProgress} className="h-3" />
            <p className="text-xs text-muted-foreground">
              Keep logging eco-friendly activities to earn more points and level up!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Achievements Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Your Achievements</h2>
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-md" />
            ))}
          </div>
        ) : rewards && rewards.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rewards.map((reward) => {
              const config = achievementTypes[reward.rewardType as keyof typeof achievementTypes] || achievementTypes.Achievement;
              const Icon = config.icon;
              
              return (
                <Card 
                  key={reward.id} 
                  className={`hover-elevate border-l-4 ${config.border}`}
                  data-testid={`reward-card-${reward.id}`}
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-md ${config.bg} flex-shrink-0`}>
                        <Icon className={`h-6 w-6 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg">{reward.title}</CardTitle>
                        <Badge variant="outline" className="mt-1">
                          {reward.rewardType}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {reward.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="bg-accent/10 text-accent-foreground border-accent/20">
                        +{reward.pointsAwarded} points
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(reward.unlockedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Trophy className="h-20 w-20 text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No achievements yet</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                Start logging eco-friendly activities to earn points and unlock your first achievements!
              </p>
              <div className="grid gap-3 w-full max-w-md">
                <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50 border">
                  <Trophy className="h-8 w-8 text-muted-foreground/70" />
                  <div className="text-left">
                    <p className="font-medium text-sm">First Steps</p>
                    <p className="text-xs text-muted-foreground">Log your first activity</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50 border">
                  <Award className="h-8 w-8 text-muted-foreground/70" />
                  <div className="text-left">
                    <p className="font-medium text-sm">Green Warrior</p>
                    <p className="text-xs text-muted-foreground">Save 10 kg of CO₂</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50 border">
                  <Star className="h-8 w-8 text-muted-foreground/70" />
                  <div className="text-left">
                    <p className="font-medium text-sm">Consistency Champion</p>
                    <p className="text-xs text-muted-foreground">Log activities for 7 days straight</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
