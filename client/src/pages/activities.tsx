import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Leaf, Calendar, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Activity, InsertActivity } from "@shared/schema";
import { ACTIVITY_CATEGORIES } from "@shared/schema";

const activityFormSchema = z.object({
  category: z.string().min(1, "Category is required"),
  activityType: z.string().min(1, "Activity type is required"),
  quantity: z.coerce.number().positive("Quantity must be positive"),
  unit: z.string().min(1, "Unit is required"),
  activityDate: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
  location: z.object({
    lat: z.number().optional(),
    lng: z.number().optional(),
    name: z.string().optional(),
  }).optional(),
});

type ActivityFormValues = z.infer<typeof activityFormSchema>;

export default function Activities() {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");

  const { data: activities, isLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      category: "",
      activityType: "",
      quantity: "",
      unit: "",
      activityDate: new Date().toISOString().split('T')[0],
      notes: "",
    },
  });

  const createActivity = useMutation({
    mutationFn: async (data: ActivityFormValues) => {
      const payload = {
        ...data,
        userId: "default-user",
        activityDate: new Date(data.activityDate).toISOString(),
      };
      return apiRequest("POST", "/api/activities", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities/recent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Activity logged!",
        description: "Your eco-friendly action has been recorded.",
      });
      form.reset({
        category: "",
        activityType: "",
        quantity: "",
        unit: "",
        activityDate: new Date().toISOString().split('T')[0],
        notes: "",
      });
      setSelectedCategory("");
      setSelectedType("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ActivityFormValues) => {
    createActivity.mutate(data);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedType("");
    form.setValue("category", category);
    form.setValue("activityType", "");
    form.setValue("unit", "");
  };

  const handleTypeChange = (typeName: string) => {
    setSelectedType(typeName);
    form.setValue("activityType", typeName);
    
    const category = selectedCategory as keyof typeof ACTIVITY_CATEGORIES;
    const typeConfig = ACTIVITY_CATEGORIES[category]?.types.find(t => t.name === typeName);
    if (typeConfig) {
      form.setValue("unit", typeConfig.unit);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Activities</h1>
        <p className="text-muted-foreground">Log your eco-friendly actions and track your impact</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Activity Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Log New Activity</CardTitle>
            <CardDescription>Record your sustainable actions and earn points</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={handleCategoryChange} value={selectedCategory}>
                          <FormControl>
                            <SelectTrigger data-testid="select-category">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.keys(ACTIVITY_CATEGORIES).map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="activityType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Activity Type</FormLabel>
                        <Select 
                          onValueChange={handleTypeChange} 
                          value={selectedType}
                          disabled={!selectedCategory}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="select-activity-type">
                              <SelectValue placeholder="Select activity" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {selectedCategory && ACTIVITY_CATEGORIES[selectedCategory as keyof typeof ACTIVITY_CATEGORIES]?.types.map((type) => (
                              <SelectItem key={type.name} value={type.name}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            placeholder="Enter amount"
                            {...field}
                            data-testid="input-quantity"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled
                            placeholder="Auto-filled"
                            data-testid="input-unit"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="activityDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} data-testid="input-date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any additional details..."
                          {...field}
                          data-testid="input-notes"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={createActivity.isPending}
                  data-testid="button-submit-activity"
                >
                  {createActivity.isPending ? "Logging..." : "Log Activity"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Activity Categories Info */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Categories</CardTitle>
            <CardDescription>Choose from sustainable actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(ACTIVITY_CATEGORIES).map(([category, config]) => (
              <div
                key={category}
                className="flex items-center gap-3 p-3 rounded-md bg-card border hover-elevate cursor-pointer"
                onClick={() => handleCategoryChange(category)}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                  <Leaf className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{category}</p>
                  <p className="text-xs text-muted-foreground">
                    {config.types.length} activities
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Activity History */}
      <Card>
        <CardHeader>
          <CardTitle>Activity History</CardTitle>
          <CardDescription>All your logged eco-friendly actions</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-muted animate-pulse rounded-md" />
              ))}
            </div>
          ) : activities && activities.length > 0 ? (
            <div className="space-y-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-4 rounded-md bg-card border hover-elevate"
                  data-testid={`history-activity-${activity.id}`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                    <Leaf className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">{activity.activityType}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.quantity} {activity.unit} • {activity.category}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(activity.activityDate).toLocaleDateString()}
                      {activity.location?.name && (
                        <>
                          <span>•</span>
                          <MapPin className="h-3 w-3" />
                          {activity.location.name}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {activity.carbonSaved.toFixed(1)} kg CO₂
                    </Badge>
                    <Badge variant="outline" className="bg-accent/10 text-accent-foreground border-accent/20">
                      {activity.pointsEarned} pts
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Leaf className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No activities yet</h3>
              <p className="text-muted-foreground">
                Log your first activity above to start tracking your impact!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
