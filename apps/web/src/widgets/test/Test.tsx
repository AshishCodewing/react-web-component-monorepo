import { Button } from "@monorepo/ui/components/button";

interface TestProps {
  label: string;
}

export default function Test({ label }: TestProps) {
  return (
    <div>
      <Button>{label}</Button>
    </div>
  );
}