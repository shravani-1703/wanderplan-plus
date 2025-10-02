import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, Hotel, Calendar, MapPin, Loader as Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function Accommodation() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    tripId,
    destination,
    startDate,
    endDate,
    selectedPOIs,
  } = location.state || {};

  const [accommodationName, setAccommodationName] = useState('');
  const [address, setAddress] = useState('');
  const [checkInDate, setCheckInDate] = useState(startDate || '');
  const [checkOutDate, setCheckOutDate] = useState(endDate || '');
  const [saving, setSaving] = useState(false);

  if (!tripId) {
    navigate('/plan');
    return null;
  }

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const nights = calculateNights();

      const { error } = await supabase.from('accommodations').insert({
        trip_id: tripId,
        name: accommodationName,
        address,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        num_nights: nights,
      });

      if (error) throw error;

      toast.success('Accommodation details saved!');

      navigate('/temp-itinerary', {
        state: {
          tripId,
          destination,
          selectedPOIs,
          accommodationName,
          checkInDate,
          checkOutDate,
        },
      });
    } catch (error: any) {
      console.error('Error saving accommodation:', error);
      toast.error(error.message || 'Failed to save accommodation');
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    navigate('/temp-itinerary', {
      state: {
        tripId,
        destination,
        selectedPOIs,
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
              1
            </div>
            <div className="w-16 h-0.5 bg-primary" />
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
              2
            </div>
            <div className="w-16 h-0.5 bg-primary" />
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
              3
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Hotel className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">Where are you staying?</h1>
            <p className="text-xl text-muted-foreground">
              Tell us about your accommodation to optimize your daily routes
            </p>
          </div>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Accommodation Details</CardTitle>
              <CardDescription>
                We'll use this as your base point for planning daily activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Hotel / Homestay Name *</Label>
                  <div className="relative">
                    <Hotel className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="Grand Hotel"
                      className="pl-10"
                      value={accommodationName}
                      onChange={(e) => setAccommodationName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="address"
                      placeholder="123 Main St, City"
                      className="pl-10"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="check-in">Check-in Date *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="check-in"
                        type="date"
                        className="pl-10"
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="check-out">Check-out Date *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="check-out"
                        type="date"
                        className="pl-10"
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        min={checkInDate}
                        required
                      />
                    </div>
                  </div>
                </div>

                {checkInDate && checkOutDate && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Total nights: <span className="font-semibold text-foreground">{calculateNights()}</span>
                    </p>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={handleSkip}
                  >
                    Skip for Now
                  </Button>
                  <Button
                    type="submit"
                    variant="hero"
                    className="flex-1"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <span>💡</span>
                Pro Tip
              </h3>
              <p className="text-sm text-muted-foreground">
                Adding your accommodation helps us create optimized daily routes that start and end at
                your hotel, minimizing travel time and maximizing your exploration!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
