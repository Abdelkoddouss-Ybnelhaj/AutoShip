import { Building } from "lucide-react";

export function LogosSection() {
  return (
    <section className="py-12 border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 mb-8">
          TRUSTED BY INNOVATIVE TEAMS AROUND THE WORLD
        </p>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex justify-center">
              {/* <img
                src={`/placeholder-logo.svg?height=30&width=120`}
                alt={`Company logo ${i}`}
                className="h-8 opacity-50 hover:opacity-100 transition-opacity"
              /> */}
              <Building className="h-8 opacity-50 hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
