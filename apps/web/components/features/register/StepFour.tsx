"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface StepFourProps {
  bio: string;
  setBio: (bio: string) => void;
  experience: string | null;
  setExperience: (experience: string | null) => void;
  dbs: boolean;
  setDbs: (dbs: boolean) => void;
  onSubmit: () => void;
  onBack: () => void;
}

const EXPERIENCE_OPTIONS = [
  "Less than 1 year",
  "1–2 years",
  "3–5 years",
  "6–10 years",
  "10+ years",
];

export default function StepFour({
  bio,
  setBio,
  experience,
  setExperience,
  dbs,
  setDbs,
  onSubmit,
  onBack,
}: StepFourProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-5 mb-6">
        {/* DBS Checkbox */}
        <div className="flex items-start gap-3 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
          <Checkbox
            id="dbs"
            checked={dbs}
            onCheckedChange={(checked) => setDbs(checked as boolean)}
            className="mt-1"
          />
          <div className="flex-1">
            <Label
              htmlFor="dbs"
              className="text-sm font-semibold cursor-pointer"
            >
              I have a valid DBS check
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              Customers prefer DBS-verified hairdressers. You'll receive a
              verified badge on your profile.
            </p>
          </div>
        </div>

        {/* Experience Dropdown */}
        <div>
          <Label htmlFor="experience" className="text-sm font-semibold">
            Years of experience
          </Label>
          <Select value={experience} onValueChange={setExperience}>
            <SelectTrigger id="experience" className="mt-1.5">
              <SelectValue placeholder="Select years" />
            </SelectTrigger>
            <SelectContent>
              {EXPERIENCE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Bio Textarea */}
        <div>
          <Label htmlFor="bio" className="text-sm font-semibold">
            Bio
          </Label>
          <Textarea
            id="bio"
            placeholder="Tell customers about yourself, your specialities, and what makes you stand out..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            maxLength={500}
            className="mt-1.5 resize-none"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {bio.length}/500 characters
          </p>
        </div>
      </div>

      <div className="flex gap-3 mt-8 pt-6 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
        >
          Back
        </Button>
        <Button type="submit" className="flex-1">
          Submit Application
        </Button>
      </div>
    </form>
  );
}
