import { Mail } from 'lucide-react';

const Help = () => {
  return (
    <div className="min-h-screen container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Help & Support</h1>
      <div className="p-6 bg-card rounded-xl space-y-4">
        <div>
          <h3 className="font-medium">FAQ (Placeholder)</h3>
          <p className="text-sm text-muted-foreground">Common questions will appear here.</p>
        </div>
        <div>
          <h3 className="font-medium">Contact</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-2"><Mail className="w-4 h-4" /> support@campusx.example</p>
        </div>
      </div>
    </div>
  );
};

export default Help;
