import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { SERVICE_NAMES, type RegistrationService } from "@geocutters/shared";

interface StepThreeProps {
  services: RegistrationService[];
  onAddService: () => void;
  onRemoveService: (index: number) => void;
  onUpdateService: (
    index: number,
    field: keyof RegistrationService,
    value: string,
  ) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepThree({
  services,
  onAddService,
  onRemoveService,
  onUpdateService,
  onNext,
  onBack,
}: StepThreeProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
    >
      <div className="space-y-3 mb-6">
        {services.map((service, index) => (
          <Card key={index} className="p-4 relative">
            {services.length > 1 && (
              <button
                type="button"
                onClick={() => onRemoveService(index)}
                className="absolute top-3 right-3 p-1 text-red-400 hover:bg-red-50 rounded-full transition-colors"
              >
                <X size={16} />
              </button>
            )}

            <div className="space-y-3 pr-8">
              <div>
                <Label htmlFor={`service-name-${index}`} className="text-xs">
                  Service name
                </Label>
                <Select
                  value={service.name}
                  onValueChange={(value) =>
                    value !== null &&
                    onUpdateService(index, "name", value)
                  }
                >
                  <SelectTrigger
                    id={`service-name-${index}`}
                    aria-label="Service name"
                    className="mt-1.5 w-full"
                  >
                    <SelectValue placeholder="Choose a service" />
                  </SelectTrigger>
                  <SelectContent side="bottom" alignItemWithTrigger={false}>
                    {SERVICE_NAMES.map((serviceName) => (
                      <SelectItem key={serviceName} value={serviceName}>
                        {serviceName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor={`service-price-${index}`} className="text-xs">
                    Price (£)
                  </Label>
                  <Input
                    id={`service-price-${index}`}
                    type="number"
                    placeholder="45"
                    value={service.price}
                    onChange={(e) =>
                      onUpdateService(index, "price", e.target.value)
                    }
                    className="mt-1.5 text-sm"
                  />
                </div>
                <div>
                  <Label
                    htmlFor={`service-duration-${index}`}
                    className="text-xs"
                  >
                    Duration (mins)
                  </Label>
                  <Input
                    id={`service-duration-${index}`}
                    placeholder="60 min"
                    value={service.duration}
                    onChange={(e) =>
                      onUpdateService(index, "duration", e.target.value)
                    }
                    className="mt-1.5 text-sm"
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}

        <Button
          type="button"
          onClick={onAddService}
          variant="outline"
          className="w-full border-dashed"
        >
          <Plus size={16} className="mr-2" />
          Add service
        </Button>
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
          Continue
        </Button>
      </div>
    </form>
  );
}
